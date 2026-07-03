import { Response, Request } from "express";
import { prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { ok, okPaginated, fail, parsePagination } from "../utils/response";
import { isNonEmptyString } from "../utils/validation";
import { Prisma, VehicleCondition, VehicleStatus } from "@prisma/client";

const VEHICLE_CONDITIONS = ["NEW", "USED", "DAMAGED", "EXPORT"] as const;
const VEHICLE_STATUSES = ["ACTIVE", "SOLD", "RESERVED", "EXPIRED", "FLAGGED"] as const;

const publicVehicleInclude = {
  photos: { orderBy: { order: "asc" as const } },
  seller: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatar: true,
      phone: true,
      country: true,
      city: true,
      role: true,
    },
  },
};

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

export async function createVehicle(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const body = req.body ?? {};

  const requiredStrings = ["vin", "make", "model", "fuelType", "transmission", "country", "city"];
  for (const field of requiredStrings) {
    if (!isNonEmptyString(body[field])) {
      fail(res, 400, `${field} is required`);
      return;
    }
  }

  const year = toInt(body.year);
  const mileage = toInt(body.mileage);
  const price = toNumber(body.price);

  if (year === undefined || year < 1900 || year > new Date().getFullYear() + 1) {
    fail(res, 400, "A valid year is required");
    return;
  }
  if (mileage === undefined || mileage < 0) {
    fail(res, 400, "A valid mileage is required");
    return;
  }
  if (price === undefined || price <= 0) {
    fail(res, 400, "A valid price is required");
    return;
  }

  if (body.condition !== undefined && !VEHICLE_CONDITIONS.includes(body.condition)) {
    fail(res, 400, `condition must be one of: ${VEHICLE_CONDITIONS.join(", ")}`);
    return;
  }

  const existingVin = await prisma.vehicle.findUnique({ where: { vin: body.vin } });
  if (existingVin) {
    fail(res, 409, "A vehicle with this VIN already exists");
    return;
  }

  let photos: { url: string; isPrimary?: boolean; order?: number }[] = [];
  if (Array.isArray(body.photos)) {
    photos = body.photos
      .filter((p: unknown) => p && typeof p === "object" && isNonEmptyString((p as { url?: unknown }).url))
      .map((p: { url: string; isPrimary?: boolean; order?: number }, idx: number) => ({
        url: p.url,
        isPrimary: Boolean(p.isPrimary),
        order: typeof p.order === "number" ? p.order : idx,
      }));
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        sellerId: userId,
        vin: body.vin,
        make: body.make,
        model: body.model,
        year,
        mileage,
        fuelType: body.fuelType,
        transmission: body.transmission,
        color: isNonEmptyString(body.color) ? body.color : null,
        bodyType: isNonEmptyString(body.bodyType) ? body.bodyType : null,
        engineSize: isNonEmptyString(body.engineSize) ? body.engineSize : null,
        power: isNonEmptyString(body.power) ? body.power : null,
        price,
        currency: isNonEmptyString(body.currency) ? body.currency : "USD",
        country: body.country,
        city: body.city,
        condition: (body.condition as VehicleCondition) ?? "USED",
        description: isNonEmptyString(body.description) ? body.description : null,
        photos: photos.length > 0 ? { create: photos } : undefined,
      },
      include: publicVehicleInclude,
    });

    ok(res, vehicle, 201);
  } catch (err) {
    fail(res, 400, "Failed to create vehicle listing");
  }
}

export async function listVehicles(req: Request, res: Response) {
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.VehicleWhereInput = {
    deletedAt: null,
    status: isNonEmptyString(q.status) && VEHICLE_STATUSES.includes(q.status as any) ? (q.status as VehicleStatus) : "ACTIVE",
  };

  if (isNonEmptyString(q.search)) {
    const search = q.search as string;
    where.OR = [
      { make: { contains: search, mode: "insensitive" } },
      { model: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (isNonEmptyString(q.make)) where.make = { equals: q.make as string, mode: "insensitive" };
  if (isNonEmptyString(q.model)) where.model = { equals: q.model as string, mode: "insensitive" };
  if (toInt(q.year) !== undefined) where.year = toInt(q.year);

  const minPrice = toNumber(q.minPrice);
  const maxPrice = toNumber(q.maxPrice);
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const minYear = toInt(q.minYear);
  const maxYear = toInt(q.maxYear);
  if (minYear !== undefined || maxYear !== undefined) {
    where.year = { ...(typeof where.year === "object" ? where.year : {}), ...(minYear !== undefined ? { gte: minYear } : {}), ...(maxYear !== undefined ? { lte: maxYear } : {}) };
  }

  const minMileage = toInt(q.minMileage);
  const maxMileage = toInt(q.maxMileage);
  if (minMileage !== undefined || maxMileage !== undefined) {
    where.mileage = {};
    if (minMileage !== undefined) where.mileage.gte = minMileage;
    if (maxMileage !== undefined) where.mileage.lte = maxMileage;
  }

  if (isNonEmptyString(q.fuelType)) where.fuelType = { equals: q.fuelType as string, mode: "insensitive" };
  if (isNonEmptyString(q.transmission)) where.transmission = { equals: q.transmission as string, mode: "insensitive" };
  if (isNonEmptyString(q.bodyType)) where.bodyType = { equals: q.bodyType as string, mode: "insensitive" };
  if (isNonEmptyString(q.color)) where.color = { equals: q.color as string, mode: "insensitive" };
  if (isNonEmptyString(q.condition) && VEHICLE_CONDITIONS.includes(q.condition as any)) {
    where.condition = q.condition as VehicleCondition;
  }
  if (isNonEmptyString(q.country)) where.country = { equals: q.country as string, mode: "insensitive" };
  if (isNonEmptyString(q.city)) where.city = { equals: q.city as string, mode: "insensitive" };

  let orderBy: Prisma.VehicleOrderByWithRelationInput = { createdAt: "desc" };
  switch (q.sortBy) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "year_desc":
      orderBy = { year: "desc" };
      break;
    case "mileage_asc":
      orderBy = { mileage: "asc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
  }

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      include: publicVehicleInclude,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.vehicle.count({ where }),
  ]);

  okPaginated(res, vehicles, { page, limit, total });
}

export async function myListings(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.VehicleWhereInput = { sellerId: userId, deletedAt: null };

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      include: publicVehicleInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.vehicle.count({ where }),
  ]);

  okPaginated(res, vehicles, { page, limit, total });
}

export async function getVehicle(req: Request, res: Response) {
  const { id } = req.params;
  const vehicle = await prisma.vehicle.findFirst({
    where: { id, deletedAt: null },
    include: publicVehicleInclude,
  });
  if (!vehicle) {
    fail(res, 404, "Vehicle not found");
    return;
  }
  ok(res, vehicle);
}

async function loadOwnedVehicle(id: string, userId: string) {
  return prisma.vehicle.findFirst({ where: { id, deletedAt: null } });
}

export async function updateVehicle(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;
  const vehicle = await loadOwnedVehicle(id, userId);
  if (!vehicle) {
    fail(res, 404, "Vehicle not found");
    return;
  }
  if (vehicle.sellerId !== userId) {
    fail(res, 403, "You do not own this vehicle listing");
    return;
  }

  const body = req.body ?? {};
  const data: Prisma.VehicleUpdateInput = {};

  const stringFields = ["make", "model", "fuelType", "transmission", "color", "bodyType", "engineSize", "power", "currency", "country", "city", "description"] as const;
  for (const field of stringFields) {
    if (body[field] !== undefined) {
      if (!isNonEmptyString(body[field]) && body[field] !== null) {
        fail(res, 400, `${field} must be a non-empty string`);
        return;
      }
      (data as any)[field] = body[field];
    }
  }

  if (body.year !== undefined) {
    const year = toInt(body.year);
    if (year === undefined || year < 1900 || year > new Date().getFullYear() + 1) {
      fail(res, 400, "A valid year is required");
      return;
    }
    data.year = year;
  }
  if (body.mileage !== undefined) {
    const mileage = toInt(body.mileage);
    if (mileage === undefined || mileage < 0) {
      fail(res, 400, "A valid mileage is required");
      return;
    }
    data.mileage = mileage;
  }
  if (body.price !== undefined) {
    const price = toNumber(body.price);
    if (price === undefined || price <= 0) {
      fail(res, 400, "A valid price is required");
      return;
    }
    data.price = price;
  }
  if (body.condition !== undefined) {
    if (!VEHICLE_CONDITIONS.includes(body.condition)) {
      fail(res, 400, `condition must be one of: ${VEHICLE_CONDITIONS.join(", ")}`);
      return;
    }
    data.condition = body.condition;
  }

  const updated = await prisma.vehicle.update({
    where: { id },
    data,
    include: publicVehicleInclude,
  });

  ok(res, updated);
}

export async function deleteVehicle(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;
  const vehicle = await loadOwnedVehicle(id, userId);
  if (!vehicle) {
    fail(res, 404, "Vehicle not found");
    return;
  }
  if (vehicle.sellerId !== userId) {
    fail(res, 403, "You do not own this vehicle listing");
    return;
  }

  await prisma.vehicle.update({ where: { id }, data: { deletedAt: new Date() } });
  ok(res, { id, deleted: true });
}

export async function updateVehicleStatus(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { status } = req.body ?? {};

  if (!isNonEmptyString(status) || !VEHICLE_STATUSES.includes(status as any)) {
    fail(res, 400, `status must be one of: ${VEHICLE_STATUSES.join(", ")}`);
    return;
  }

  const vehicle = await loadOwnedVehicle(id, userId);
  if (!vehicle) {
    fail(res, 404, "Vehicle not found");
    return;
  }
  if (vehicle.sellerId !== userId) {
    fail(res, 403, "You do not own this vehicle listing");
    return;
  }

  const updated = await prisma.vehicle.update({
    where: { id },
    data: { status: status as VehicleStatus },
    include: publicVehicleInclude,
  });

  ok(res, updated);
}

export async function addPhotos(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;
  const body = req.body;

  const photosInput = Array.isArray(body) ? body : body?.photos;
  if (!Array.isArray(photosInput) || photosInput.length === 0) {
    fail(res, 400, "photos must be a non-empty array of {url, isPrimary, order}");
    return;
  }

  const vehicle = await loadOwnedVehicle(id, userId);
  if (!vehicle) {
    fail(res, 404, "Vehicle not found");
    return;
  }
  if (vehicle.sellerId !== userId) {
    fail(res, 403, "You do not own this vehicle listing");
    return;
  }

  const validPhotos = [];
  for (const p of photosInput) {
    if (!p || typeof p !== "object" || !isNonEmptyString(p.url)) {
      fail(res, 400, "Each photo requires a url");
      return;
    }
    validPhotos.push({
      vehicleId: id,
      url: p.url,
      isPrimary: Boolean(p.isPrimary),
      order: typeof p.order === "number" ? p.order : 0,
    });
  }

  await prisma.vehiclePhoto.createMany({ data: validPhotos });
  const photos = await prisma.vehiclePhoto.findMany({ where: { vehicleId: id }, orderBy: { order: "asc" } });
  ok(res, photos, 201);
}

export async function deletePhoto(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { vehicleId, photoId } = req.params;

  const vehicle = await loadOwnedVehicle(vehicleId, userId);
  if (!vehicle) {
    fail(res, 404, "Vehicle not found");
    return;
  }
  if (vehicle.sellerId !== userId) {
    fail(res, 403, "You do not own this vehicle listing");
    return;
  }

  const photo = await prisma.vehiclePhoto.findFirst({ where: { id: photoId, vehicleId } });
  if (!photo) {
    fail(res, 404, "Photo not found");
    return;
  }

  await prisma.vehiclePhoto.delete({ where: { id: photoId } });
  ok(res, { id: photoId, deleted: true });
}

export async function updatePhoto(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { vehicleId, photoId } = req.params;
  const { isPrimary, order } = req.body ?? {};

  const vehicle = await loadOwnedVehicle(vehicleId, userId);
  if (!vehicle) {
    fail(res, 404, "Vehicle not found");
    return;
  }
  if (vehicle.sellerId !== userId) {
    fail(res, 403, "You do not own this vehicle listing");
    return;
  }

  const photo = await prisma.vehiclePhoto.findFirst({ where: { id: photoId, vehicleId } });
  if (!photo) {
    fail(res, 404, "Photo not found");
    return;
  }

  const data: Prisma.VehiclePhotoUpdateInput = {};
  if (isPrimary !== undefined) data.isPrimary = Boolean(isPrimary);
  if (order !== undefined) {
    const orderNum = toInt(order);
    if (orderNum === undefined) {
      fail(res, 400, "order must be a number");
      return;
    }
    data.order = orderNum;
  }

  const updated = await prisma.vehiclePhoto.update({ where: { id: photoId }, data });
  ok(res, updated);
}
