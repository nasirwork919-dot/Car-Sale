import { Response } from "express";
import { prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { ok, okPaginated, fail, parsePagination } from "../utils/response";
import { isNonEmptyString } from "../utils/validation";
import { BookingStatus } from "@prisma/client";

const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { businessId, serviceType, date, timeSlot, notes } = req.body ?? {};

  if (!isNonEmptyString(businessId)) {
    fail(res, 400, "businessId is required");
    return;
  }
  if (!isNonEmptyString(serviceType)) {
    fail(res, 400, "serviceType is required");
    return;
  }
  const parsedDate = new Date(date);
  if (!date || Number.isNaN(parsedDate.getTime())) {
    fail(res, 400, "A valid date is required");
    return;
  }

  const business = await prisma.businessProfile.findUnique({ where: { id: businessId } });
  if (!business) {
    fail(res, 404, "Business not found");
    return;
  }

  const booking = await prisma.booking.create({
    data: {
      userId,
      businessId,
      serviceType,
      date: parsedDate,
      timeSlot: isNonEmptyString(timeSlot) ? timeSlot : null,
      notes: isNonEmptyString(notes) ? notes : null,
    },
  });

  ok(res, booking, 201);
}

export async function myBookings(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where: { userId },
      include: {
        business: { select: { id: true, businessName: true, slug: true, logo: true } },
      },
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    prisma.booking.count({ where: { userId } }),
  ]);

  okPaginated(res, bookings, { page, limit, total });
}

export async function businessBookings(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const businesses = await prisma.businessProfile.findMany({ where: { userId }, select: { id: true } });
  const businessIds = businesses.map((b) => b.id);

  if (businessIds.length === 0) {
    okPaginated(res, [], { page, limit, total: 0 });
    return;
  }

  const where = { businessId: { in: businessIds } };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true, phone: true } },
        business: { select: { id: true, businessName: true, slug: true } },
      },
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  okPaginated(res, bookings, { page, limit, total });
}

export async function updateBookingStatus(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { status } = req.body ?? {};

  if (!isNonEmptyString(status) || !BOOKING_STATUSES.includes(status as any)) {
    fail(res, 400, `status must be one of: ${BOOKING_STATUSES.join(", ")}`);
    return;
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { business: { select: { userId: true } } },
  });
  if (!booking) {
    fail(res, 404, "Booking not found");
    return;
  }

  const isCreator = booking.userId === userId;
  const isBusinessOwner = booking.business.userId === userId;
  if (!isCreator && !isBusinessOwner) {
    fail(res, 403, "You do not have permission to update this booking");
    return;
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: status as BookingStatus },
  });

  ok(res, updated);
}
