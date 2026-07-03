import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { fail, ok } from "../utils/response";
import { isNonEmptyString } from "../utils/validation";

export async function globalSearch(req: Request, res: Response) {
  const q = req.query.q;
  if (!isNonEmptyString(q)) {
    fail(res, 400, "q is required");
    return;
  }
  const query = q as string;

  const vehicleWhere = {
    status: "ACTIVE" as const,
    deletedAt: null,
    OR: [
      { make: { contains: query, mode: "insensitive" as const } },
      { model: { contains: query, mode: "insensitive" as const } },
      { description: { contains: query, mode: "insensitive" as const } },
    ],
  };

  const businessWhere = {
    OR: [
      { businessName: { contains: query, mode: "insensitive" as const } },
      { description: { contains: query, mode: "insensitive" as const } },
    ],
  };

  const sparePartWhere = {
    OR: [
      { name: { contains: query, mode: "insensitive" as const } },
      { oem: { contains: query, mode: "insensitive" as const } },
    ],
  };

  const [vehicles, vehicleTotal, businesses, businessTotal, spareParts, sparePartTotal] = await Promise.all([
    prisma.vehicle.findMany({
      where: vehicleWhere,
      include: { photos: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.vehicle.count({ where: vehicleWhere }),
    prisma.businessProfile.findMany({
      where: businessWhere,
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.businessProfile.count({ where: businessWhere }),
    prisma.sparePart.findMany({
      where: sparePartWhere,
      include: { business: { select: { id: true, businessName: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.sparePart.count({ where: sparePartWhere }),
  ]);

  ok(res, {
    vehicles: { results: vehicles, total: vehicleTotal },
    businesses: { results: businesses, total: businessTotal },
    spareParts: { results: spareParts, total: sparePartTotal },
  });
}
