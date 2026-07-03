import { Response } from "express";
import { prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { ok, okPaginated, fail, parsePagination } from "../utils/response";
import { isNonEmptyString } from "../utils/validation";
import { BusinessType, Prisma, UserRole } from "@prisma/client";

const USER_ROLES = ["PERSONAL", "BUSINESS", "INSURANCE", "WORKSHOP", "LOGISTICS", "GOVERNMENT", "POLICE"] as const;
const BUSINESS_TYPES = [
  "DEALER",
  "WORKSHOP",
  "TIRE_SHOP",
  "DRIVING_SCHOOL",
  "RENTAL",
  "DETAILING",
  "DISMANTLER",
] as const;

const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  avatar: true,
  country: true,
  city: true,
  role: true,
  emailVerified: true,
  identityVerified: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

function sevenDaysAgo(): Date {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
}

export async function listUsers(req: AuthenticatedRequest, res: Response) {
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.UserWhereInput = {};
  if (isNonEmptyString(q.role) && USER_ROLES.includes(q.role as any)) {
    where.role = q.role as UserRole;
  }
  if (isNonEmptyString(q.search)) {
    const search = q.search as string;
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({ where, select: userSelect, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.user.count({ where }),
  ]);

  okPaginated(res, users, { page, limit, total });
}

export async function updateUserRole(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { role } = req.body ?? {};

  if (!isNonEmptyString(role) || !USER_ROLES.includes(role as any)) {
    fail(res, 400, `role must be one of: ${USER_ROLES.join(", ")}`);
    return;
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    fail(res, 404, "User not found");
    return;
  }

  const updated = await prisma.user.update({ where: { id }, data: { role: role as UserRole }, select: userSelect });
  ok(res, updated);
}

export async function verifyUser(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    fail(res, 404, "User not found");
    return;
  }

  const updated = await prisma.user.update({ where: { id }, data: { identityVerified: true }, select: userSelect });
  ok(res, updated);
}

export async function banUser(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    fail(res, 404, "User not found");
    return;
  }

  const updated = await prisma.user.update({ where: { id }, data: { deletedAt: new Date() }, select: userSelect });
  ok(res, updated);
}

export async function listBusinesses(req: AuthenticatedRequest, res: Response) {
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.BusinessProfileWhereInput = {};
  if (q.verified === "true") where.verified = true;
  if (q.verified === "false") where.verified = false;
  if (isNonEmptyString(q.businessType) && BUSINESS_TYPES.includes(q.businessType as any)) {
    where.businessType = q.businessType as BusinessType;
  }

  const [businesses, total] = await Promise.all([
    prisma.businessProfile.findMany({
      where,
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.businessProfile.count({ where }),
  ]);

  okPaginated(res, businesses, { page, limit, total });
}

export async function verifyBusiness(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;

  const business = await prisma.businessProfile.findUnique({ where: { id } });
  if (!business) {
    fail(res, 404, "Business not found");
    return;
  }

  const updated = await prisma.businessProfile.update({ where: { id }, data: { verified: true } });
  ok(res, updated);
}

export async function rejectBusiness(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { deleteRecord } = req.body ?? {};

  const business = await prisma.businessProfile.findUnique({ where: { id } });
  if (!business) {
    fail(res, 404, "Business not found");
    return;
  }

  if (deleteRecord === true) {
    await prisma.businessProfile.delete({ where: { id } });
    ok(res, { id, deleted: true });
    return;
  }

  const updated = await prisma.businessProfile.update({ where: { id }, data: { verified: false } });
  ok(res, updated);
}

export async function platformStats(_req: AuthenticatedRequest, res: Response) {
  const since = sevenDaysAgo();

  const [
    totalUsers,
    totalVehicles,
    totalBusinesses,
    totalAuctions,
    completedBookings,
    confirmedTransfers,
    usersRegisteredThisWeek,
    vehiclesListedThisWeek,
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.vehicle.count({ where: { deletedAt: null } }),
    prisma.businessProfile.count(),
    prisma.auction.count(),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.ownershipTransfer.count({ where: { status: "CONFIRMED" } }),
    prisma.user.count({ where: { createdAt: { gte: since }, deletedAt: null } }),
    prisma.vehicle.count({ where: { createdAt: { gte: since }, deletedAt: null } }),
  ]);

  ok(res, {
    totalUsers,
    totalVehicles,
    totalBusinesses,
    totalAuctions,
    totalTransactions: completedBookings + confirmedTransfers,
    usersRegisteredThisWeek,
    vehiclesListedThisWeek,
  });
}

export async function flaggedOverview(_req: AuthenticatedRequest, res: Response) {
  const [flaggedVehicles, openStolenReports, openClaims] = await Promise.all([
    prisma.vehicle.findMany({
      where: { status: "FLAGGED" },
      include: { seller: { select: { id: true, firstName: true, lastName: true, phone: true } } },
    }),
    prisma.stolenReport.findMany({
      where: { status: { in: ["OPEN", "INVESTIGATING"] } },
      include: {
        vehicle: { select: { id: true, vin: true, make: true, model: true, year: true } },
        reporter: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.claim.findMany({
      where: { status: { in: ["OPEN", "REVIEWING"] } },
      include: {
        vehicle: { select: { id: true, vin: true, make: true, model: true, year: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  ok(res, { flaggedVehicles, openStolenReports, openClaims });
}
