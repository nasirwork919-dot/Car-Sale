import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { ok } from "../utils/response";

export async function stats(_req: Request, res: Response) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalActiveVehicles, totalDealers, countries, vehiclesThisWeek] = await Promise.all([
    prisma.vehicle.count({ where: { status: "ACTIVE", deletedAt: null } }),
    prisma.businessProfile.count({ where: { verified: true } }),
    prisma.vehicle.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      select: { country: true },
      distinct: ["country"],
    }),
    prisma.vehicle.count({
      where: { status: "ACTIVE", deletedAt: null, createdAt: { gte: weekAgo } },
    }),
  ]);

  ok(res, {
    totalActiveVehicles,
    totalDealers,
    totalCountries: countries.length,
    vehiclesAddedThisWeek: vehiclesThisWeek,
  });
}

export async function featured(_req: Request, res: Response) {
  const candidates = await prisma.vehicle.findMany({
    where: { status: "ACTIVE", deletedAt: null },
    select: { id: true },
  });

  const shuffled = candidates.sort(() => Math.random() - 0.5).slice(0, 8);
  const ids = shuffled.map((v) => v.id);

  const vehicles = await prisma.vehicle.findMany({
    where: { id: { in: ids } },
    include: {
      photos: { orderBy: { order: "asc" } },
      seller: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } },
    },
  });

  ok(res, vehicles);
}

export async function makes(_req: Request, res: Response) {
  const grouped = await prisma.vehicle.groupBy({
    by: ["make"],
    where: { status: "ACTIVE", deletedAt: null },
    _count: { make: true },
    orderBy: { _count: { make: "desc" } },
  });

  ok(
    res,
    grouped.map((g) => ({ make: g.make, count: g._count.make })),
  );
}

export async function recent(_req: Request, res: Response) {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "ACTIVE", deletedAt: null },
    include: {
      photos: { orderBy: { order: "asc" } },
      seller: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  ok(res, vehicles);
}
