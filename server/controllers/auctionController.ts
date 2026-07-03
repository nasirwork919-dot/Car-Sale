import { Response, Request } from "express";
import { prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { ok, okPaginated, fail, parsePagination } from "../utils/response";
import { isNonEmptyString } from "../utils/validation";
import { AuctionDuration, Prisma } from "@prisma/client";

const DURATIONS = ["H24", "H48", "D7"] as const;
const DURATION_MS: Record<(typeof DURATIONS)[number], number> = {
  H24: 24 * 60 * 60 * 1000,
  H48: 48 * 60 * 60 * 1000,
  D7: 7 * 24 * 60 * 60 * 1000,
};

function toNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

const auctionInclude = {
  vehicle: { include: { photos: { orderBy: { order: "asc" as const } } } },
  seller: { select: { id: true, firstName: true, lastName: true, avatar: true } },
};

export async function createAuction(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { vehicleId, startingPrice, reservePrice, duration, depositRequired } = req.body ?? {};

  if (!isNonEmptyString(vehicleId)) {
    fail(res, 400, "vehicleId is required");
    return;
  }
  const startPrice = toNumber(startingPrice);
  if (startPrice === undefined || startPrice <= 0) {
    fail(res, 400, "A valid startingPrice is required");
    return;
  }
  if (!isNonEmptyString(duration) || !DURATIONS.includes(duration as any)) {
    fail(res, 400, `duration must be one of: ${DURATIONS.join(", ")}`);
    return;
  }

  const vehicle = await prisma.vehicle.findFirst({ where: { id: vehicleId, deletedAt: null } });
  if (!vehicle) {
    fail(res, 404, "Vehicle not found");
    return;
  }
  if (vehicle.sellerId !== userId) {
    fail(res, 403, "You do not own this vehicle");
    return;
  }

  const existingActive = await prisma.auction.findFirst({ where: { vehicleId, status: "ACTIVE" } });
  if (existingActive) {
    fail(res, 409, "This vehicle already has an active auction");
    return;
  }

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + DURATION_MS[duration as (typeof DURATIONS)[number]]);
  const reserve = toNumber(reservePrice);

  const auction = await prisma.auction.create({
    data: {
      vehicleId,
      sellerId: userId,
      startingPrice: startPrice,
      reservePrice: reserve,
      currentBid: startPrice,
      duration: duration as AuctionDuration,
      startTime,
      endTime,
      status: "ACTIVE",
      depositRequired: toNumber(depositRequired) ?? 0,
    },
    include: auctionInclude,
  });

  ok(res, auction, 201);
}

export async function listAuctions(req: Request, res: Response) {
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.AuctionWhereInput = { status: "ACTIVE" };

  let orderBy: Prisma.AuctionOrderByWithRelationInput = { endTime: "asc" };
  switch (q.sortBy) {
    case "ending_soon":
      orderBy = { endTime: "asc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "price_asc":
      orderBy = { currentBid: "asc" };
      break;
    case "price_desc":
      orderBy = { currentBid: "desc" };
      break;
  }

  const [auctions, total] = await Promise.all([
    prisma.auction.findMany({ where, include: auctionInclude, orderBy, skip, take: limit }),
    prisma.auction.count({ where }),
  ]);

  okPaginated(res, auctions, { page, limit, total });
}

export async function getAuction(req: Request, res: Response) {
  const { id } = req.params;
  const auction = await prisma.auction.findUnique({
    where: { id },
    include: {
      ...auctionInclude,
      bids: {
        orderBy: { amount: "desc" },
        include: { bidder: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
      },
    },
  });
  if (!auction) {
    fail(res, 404, "Auction not found");
    return;
  }

  const timeRemainingMs = Math.max(0, auction.endTime.getTime() - Date.now());
  ok(res, { ...auction, timeRemainingMs });
}

export async function placeBid(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { amount } = req.body ?? {};

  const bidAmount = toNumber(amount);
  if (bidAmount === undefined || bidAmount <= 0) {
    fail(res, 400, "A valid bid amount is required");
    return;
  }

  const auction = await prisma.auction.findUnique({ where: { id } });
  if (!auction) {
    fail(res, 404, "Auction not found");
    return;
  }
  if (auction.sellerId === userId) {
    fail(res, 403, "You cannot bid on your own auction");
    return;
  }
  if (auction.status !== "ACTIVE") {
    fail(res, 400, "This auction is not active");
    return;
  }
  if (auction.endTime.getTime() <= Date.now()) {
    fail(res, 400, "This auction has expired");
    return;
  }
  const minimumBid = auction.currentBid > 0 ? auction.currentBid : auction.startingPrice;
  if (bidAmount <= minimumBid) {
    fail(res, 400, `Bid must be higher than ${minimumBid}`);
    return;
  }

  const [, updatedAuction] = await prisma.$transaction([
    prisma.bid.create({ data: { auctionId: id, bidderId: userId, amount: bidAmount } }),
    prisma.auction.update({ where: { id }, data: { currentBid: bidAmount }, include: auctionInclude }),
  ]);

  ok(res, updatedAuction, 201);
}

export async function myAuctions(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.AuctionWhereInput = { sellerId: userId };
  const [auctions, total] = await Promise.all([
    prisma.auction.findMany({ where, include: auctionInclude, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.auction.count({ where }),
  ]);

  okPaginated(res, auctions, { page, limit, total });
}

export async function myBids(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;

  const bids = await prisma.bid.findMany({
    where: { bidderId: userId },
    include: { auction: { include: auctionInclude } },
    orderBy: { amount: "desc" },
  });

  const byAuction = new Map<string, (typeof bids)[number]>();
  for (const bid of bids) {
    const existing = byAuction.get(bid.auctionId);
    if (!existing || bid.amount > existing.amount) {
      byAuction.set(bid.auctionId, bid);
    }
  }

  ok(res, Array.from(byAuction.values()));
}

export async function cancelAuction(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const auction = await prisma.auction.findUnique({ where: { id } });
  if (!auction) {
    fail(res, 404, "Auction not found");
    return;
  }
  if (auction.sellerId !== userId) {
    fail(res, 403, "You do not own this auction");
    return;
  }

  const bidCount = await prisma.bid.count({ where: { auctionId: id } });
  if (bidCount > 0) {
    fail(res, 400, "Cannot cancel an auction that already has bids");
    return;
  }

  const updated = await prisma.auction.update({ where: { id }, data: { status: "CANCELLED" }, include: auctionInclude });
  ok(res, updated);
}
