import { Response, Request } from "express";
import { prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { ok, okPaginated, fail, parsePagination } from "../utils/response";
import { isNonEmptyString } from "../utils/validation";
import { PartCondition, Prisma } from "@prisma/client";

const CONDITIONS = ["NEW", "USED", "REFURBISHED"] as const;

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

const businessSelect = { id: true, businessName: true, slug: true, logo: true, businessType: true, verified: true };

async function getOwnedDismantlerBusiness(userId: string) {
  return prisma.businessProfile.findFirst({ where: { userId, businessType: "DISMANTLER" } });
}

export async function createPart(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { name, oem, compatibleVins, condition, price, stock } = req.body ?? {};

  if (!isNonEmptyString(name)) {
    fail(res, 400, "name is required");
    return;
  }
  if (!isNonEmptyString(condition) || !CONDITIONS.includes(condition as any)) {
    fail(res, 400, `condition must be one of: ${CONDITIONS.join(", ")}`);
    return;
  }
  const priceNum = toNumber(price);
  if (priceNum === undefined || priceNum <= 0) {
    fail(res, 400, "A valid price is required");
    return;
  }
  const stockNum = toInt(stock) ?? 0;
  if (compatibleVins !== undefined && !Array.isArray(compatibleVins)) {
    fail(res, 400, "compatibleVins must be an array");
    return;
  }

  const business = await getOwnedDismantlerBusiness(userId);
  if (!business) {
    fail(res, 403, "You must have a DISMANTLER business profile to list spare parts");
    return;
  }

  const part = await prisma.sparePart.create({
    data: {
      businessId: business.id,
      name,
      oem: isNonEmptyString(oem) ? oem : null,
      compatibleVins: Array.isArray(compatibleVins) ? compatibleVins : undefined,
      condition: condition as PartCondition,
      price: priceNum,
      stock: stockNum,
    },
    include: { business: { select: businessSelect } },
  });

  ok(res, part, 201);
}

export async function listParts(req: Request, res: Response) {
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.SparePartWhereInput = {};
  if (isNonEmptyString(q.name)) where.name = { contains: q.name as string, mode: "insensitive" };
  if (isNonEmptyString(q.oem)) where.oem = { contains: q.oem as string, mode: "insensitive" };
  if (isNonEmptyString(q.condition) && CONDITIONS.includes(q.condition as any)) {
    where.condition = q.condition as PartCondition;
  }
  const minPrice = toNumber(q.minPrice);
  const maxPrice = toNumber(q.maxPrice);
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }
  if (isNonEmptyString(q.compatibleVin)) {
    where.compatibleVins = { array_contains: q.compatibleVin as string } as any;
  }

  const [parts, total] = await Promise.all([
    prisma.sparePart.findMany({
      where,
      include: { business: { select: businessSelect } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.sparePart.count({ where }),
  ]);

  okPaginated(res, parts, { page, limit, total });
}

export async function getPart(req: Request, res: Response) {
  const { id } = req.params;
  const part = await prisma.sparePart.findUnique({ where: { id }, include: { business: { select: businessSelect } } });
  if (!part) {
    fail(res, 404, "Spare part not found");
    return;
  }
  ok(res, part);
}

export async function updatePart(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const part = await prisma.sparePart.findUnique({ where: { id }, include: { business: true } });
  if (!part) {
    fail(res, 404, "Spare part not found");
    return;
  }
  if (part.business.userId !== userId) {
    fail(res, 403, "You do not own this spare part listing");
    return;
  }

  const { name, oem, compatibleVins, condition, price, stock } = req.body ?? {};
  const data: Prisma.SparePartUpdateInput = {};

  if (name !== undefined) {
    if (!isNonEmptyString(name)) {
      fail(res, 400, "name must be a non-empty string");
      return;
    }
    data.name = name;
  }
  if (oem !== undefined) data.oem = isNonEmptyString(oem) ? oem : null;
  if (compatibleVins !== undefined) {
    if (!Array.isArray(compatibleVins)) {
      fail(res, 400, "compatibleVins must be an array");
      return;
    }
    data.compatibleVins = compatibleVins;
  }
  if (condition !== undefined) {
    if (!isNonEmptyString(condition) || !CONDITIONS.includes(condition as any)) {
      fail(res, 400, `condition must be one of: ${CONDITIONS.join(", ")}`);
      return;
    }
    data.condition = condition as PartCondition;
  }
  if (price !== undefined) {
    const n = toNumber(price);
    if (n === undefined || n <= 0) {
      fail(res, 400, "price must be a positive number");
      return;
    }
    data.price = n;
  }
  if (stock !== undefined) {
    const n = toInt(stock);
    if (n === undefined || n < 0) {
      fail(res, 400, "stock must be a non-negative integer");
      return;
    }
    data.stock = n;
  }

  const updated = await prisma.sparePart.update({ where: { id }, data, include: { business: { select: businessSelect } } });
  ok(res, updated);
}

export async function deletePart(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const part = await prisma.sparePart.findUnique({ where: { id }, include: { business: true } });
  if (!part) {
    fail(res, 404, "Spare part not found");
    return;
  }
  if (part.business.userId !== userId) {
    fail(res, 403, "You do not own this spare part listing");
    return;
  }

  await prisma.sparePart.delete({ where: { id } });
  ok(res, { id, deleted: true });
}

export async function myParts(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const businesses = await prisma.businessProfile.findMany({ where: { userId }, select: { id: true } });
  const businessIds = businesses.map((b) => b.id);
  if (businessIds.length === 0) {
    okPaginated(res, [], { page, limit, total: 0 });
    return;
  }

  const where: Prisma.SparePartWhereInput = { businessId: { in: businessIds } };
  const [parts, total] = await Promise.all([
    prisma.sparePart.findMany({
      where,
      include: { business: { select: businessSelect } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.sparePart.count({ where }),
  ]);

  okPaginated(res, parts, { page, limit, total });
}

export async function compatibleWithVin(req: Request, res: Response) {
  const { vin } = req.params;
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.SparePartWhereInput = { compatibleVins: { array_contains: vin } as any };

  const [parts, total] = await Promise.all([
    prisma.sparePart.findMany({
      where,
      include: { business: { select: businessSelect } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.sparePart.count({ where }),
  ]);

  okPaginated(res, parts, { page, limit, total });
}
