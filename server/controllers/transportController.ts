import { Response, Request } from "express";
import { prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { ok, okPaginated, fail, parsePagination } from "../utils/response";
import { isNonEmptyString } from "../utils/validation";
import { Prisma, TransportType } from "@prisma/client";
import { createNotification } from "../services/notificationService";

const TRANSPORT_TYPES = ["OPEN", "ENCLOSED"] as const;
const REQUEST_STATUSES = ["OPEN", "ACCEPTED", "IN_TRANSIT", "DELIVERED", "CANCELLED"] as const;

function toNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function toInt(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) ? n : undefined;
}

const requestInclude = {
  vehicle: { include: { photos: { orderBy: { order: "asc" as const } } } },
  requester: { select: { id: true, firstName: true, lastName: true, avatar: true, phone: true } },
  offers: {
    include: { carrier: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    orderBy: { createdAt: "asc" as const },
  },
};

export async function createRequest(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { vehicleId, originCountry, originCity, destCountry, destCity, transportType } = req.body ?? {};

  const requiredStrings = { originCountry, originCity, destCountry, destCity };
  for (const [key, value] of Object.entries(requiredStrings)) {
    if (!isNonEmptyString(value)) {
      fail(res, 400, `${key} is required`);
      return;
    }
  }
  if (!isNonEmptyString(transportType) || !TRANSPORT_TYPES.includes(transportType as any)) {
    fail(res, 400, `transportType must be one of: ${TRANSPORT_TYPES.join(", ")}`);
    return;
  }

  if (vehicleId !== undefined && vehicleId !== null) {
    if (!isNonEmptyString(vehicleId)) {
      fail(res, 400, "vehicleId must be a string");
      return;
    }
    const vehicle = await prisma.vehicle.findFirst({ where: { id: vehicleId, deletedAt: null } });
    if (!vehicle) {
      fail(res, 404, "Vehicle not found");
      return;
    }
  }

  const request = await prisma.transportRequest.create({
    data: {
      requesterId: userId,
      vehicleId: isNonEmptyString(vehicleId) ? vehicleId : null,
      originCountry,
      originCity,
      destCountry,
      destCity,
      transportType: transportType as TransportType,
      status: "OPEN",
    },
    include: requestInclude,
  });

  ok(res, request, 201);
}

export async function listRequests(req: Request, res: Response) {
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.TransportRequestWhereInput = { status: "OPEN" };
  if (isNonEmptyString(q.originCountry)) where.originCountry = { equals: q.originCountry as string, mode: "insensitive" };
  if (isNonEmptyString(q.destCountry)) where.destCountry = { equals: q.destCountry as string, mode: "insensitive" };
  if (isNonEmptyString(q.transportType) && TRANSPORT_TYPES.includes(q.transportType as any)) {
    where.transportType = q.transportType as TransportType;
  }

  const [requests, total] = await Promise.all([
    prisma.transportRequest.findMany({ where, include: requestInclude, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.transportRequest.count({ where }),
  ]);

  okPaginated(res, requests, { page, limit, total });
}

export async function getRequest(req: Request, res: Response) {
  const { id } = req.params;
  const request = await prisma.transportRequest.findUnique({ where: { id }, include: requestInclude });
  if (!request) {
    fail(res, 404, "Transport request not found");
    return;
  }
  ok(res, request);
}

export async function createOffer(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id: requestId } = req.params;
  const { price, estimatedDays, message } = req.body ?? {};

  const priceNum = toNumber(price);
  const daysNum = toInt(estimatedDays);
  if (priceNum === undefined || priceNum <= 0) {
    fail(res, 400, "A valid price is required");
    return;
  }
  if (daysNum === undefined || daysNum <= 0) {
    fail(res, 400, "A valid estimatedDays is required");
    return;
  }

  const request = await prisma.transportRequest.findUnique({ where: { id: requestId } });
  if (!request) {
    fail(res, 404, "Transport request not found");
    return;
  }
  if (request.requesterId === userId) {
    fail(res, 400, "You cannot offer on your own transport request");
    return;
  }
  if (request.status !== "OPEN") {
    fail(res, 400, "This transport request is no longer open");
    return;
  }

  const offer = await prisma.transportOffer.create({
    data: {
      requestId,
      carrierId: userId,
      price: priceNum,
      estimatedDays: daysNum,
      message: isNonEmptyString(message) ? message : null,
      status: "PENDING",
    },
  });

  await createNotification(
    request.requesterId,
    "NEW_TRANSPORT_OFFER",
    "New transport offer",
    `You received a new offer of ${priceNum} for your transport request`,
    `/transport/${requestId}`,
  );

  ok(res, offer, 201);
}

export async function acceptOffer(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { offerId } = req.params;

  const offer = await prisma.transportOffer.findUnique({ where: { id: offerId }, include: { request: true } });
  if (!offer) {
    fail(res, 404, "Offer not found");
    return;
  }
  if (offer.request.requesterId !== userId) {
    fail(res, 403, "Only the request owner can accept an offer");
    return;
  }
  if (offer.request.status !== "OPEN") {
    fail(res, 400, "This request is no longer open");
    return;
  }

  await prisma.$transaction([
    prisma.transportOffer.update({ where: { id: offerId }, data: { status: "ACCEPTED" } }),
    prisma.transportOffer.updateMany({
      where: { requestId: offer.requestId, id: { not: offerId } },
      data: { status: "REJECTED" },
    }),
    prisma.transportRequest.update({ where: { id: offer.requestId }, data: { status: "ACCEPTED" } }),
  ]);

  await createNotification(
    offer.carrierId,
    "TRANSPORT_OFFER_ACCEPTED",
    "Your transport offer was accepted",
    "Your offer has been accepted by the requester",
    `/transport/${offer.requestId}`,
  );

  const updated = await prisma.transportRequest.findUnique({ where: { id: offer.requestId }, include: requestInclude });
  ok(res, updated);
}

export async function updateRequestStatus(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { status } = req.body ?? {};

  const UPDATABLE_STATUSES = ["IN_TRANSIT", "DELIVERED", "CANCELLED"] as const;
  if (!isNonEmptyString(status) || !UPDATABLE_STATUSES.includes(status as any)) {
    fail(res, 400, "status must be one of: IN_TRANSIT, DELIVERED, CANCELLED");
    return;
  }
  const newStatus = status as (typeof UPDATABLE_STATUSES)[number];

  const request = await prisma.transportRequest.findUnique({
    where: { id },
    include: { offers: { where: { status: "ACCEPTED" } } },
  });
  if (!request) {
    fail(res, 404, "Transport request not found");
    return;
  }

  const acceptedCarrierId = request.offers[0]?.carrierId;
  const isOwner = request.requesterId === userId;
  const isCarrier = acceptedCarrierId === userId;
  if (!isOwner && !isCarrier) {
    fail(res, 403, "You do not have permission to update this request");
    return;
  }

  const updated = await prisma.transportRequest.update({
    where: { id },
    data: { status: newStatus },
    include: requestInclude,
  });

  ok(res, updated);
}

export async function myRequests(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.TransportRequestWhereInput = { requesterId: userId };
  const [requests, total] = await Promise.all([
    prisma.transportRequest.findMany({ where, include: requestInclude, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.transportRequest.count({ where }),
  ]);

  okPaginated(res, requests, { page, limit, total });
}

export async function myOffers(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.TransportOfferWhereInput = { carrierId: userId };
  const [offers, total] = await Promise.all([
    prisma.transportOffer.findMany({
      where,
      include: { request: { include: requestInclude } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.transportOffer.count({ where }),
  ]);

  okPaginated(res, offers, { page, limit, total });
}
