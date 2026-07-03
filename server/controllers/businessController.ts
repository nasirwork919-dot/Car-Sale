import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { ok, okPaginated, fail, parsePagination } from "../utils/response";
import { isNonEmptyString } from "../utils/validation";
import { Prisma } from "@prisma/client";

const BUSINESS_TYPES = [
  "DEALER",
  "WORKSHOP",
  "TIRE_SHOP",
  "DRIVING_SCHOOL",
  "RENTAL",
  "DISMANTLER",
  "LAWYER",
  "PAINTER",
  "GLASS_REPAIR",
  "METALWORK",
  "WRAPPING",
  "DETAILING",
] as const;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || "business";
  let slug = base;
  let counter = 1;
  while (await prisma.businessProfile.findUnique({ where: { slug } })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

export async function createBusiness(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const body = req.body ?? {};

  if (!isNonEmptyString(body.businessName)) {
    fail(res, 400, "businessName is required");
    return;
  }
  if (!isNonEmptyString(body.businessType) || !BUSINESS_TYPES.includes(body.businessType)) {
    fail(res, 400, `businessType must be one of: ${BUSINESS_TYPES.join(", ")}`);
    return;
  }

  const slug = isNonEmptyString(body.slug) ? slugify(body.slug) : await generateUniqueSlug(body.businessName);
  const existingSlug = await prisma.businessProfile.findUnique({ where: { slug } });
  if (existingSlug) {
    fail(res, 409, "That slug is already taken");
    return;
  }

  const business = await prisma.businessProfile.create({
    data: {
      userId,
      businessType: body.businessType,
      businessName: body.businessName,
      slug,
      description: isNonEmptyString(body.description) ? body.description : null,
      logo: isNonEmptyString(body.logo) ? body.logo : null,
      coverImage: isNonEmptyString(body.coverImage) ? body.coverImage : null,
      address: isNonEmptyString(body.address) ? body.address : null,
      country: isNonEmptyString(body.country) ? body.country : null,
      city: isNonEmptyString(body.city) ? body.city : null,
      phone: isNonEmptyString(body.phone) ? body.phone : null,
      website: isNonEmptyString(body.website) ? body.website : null,
      verified: false,
    },
  });

  ok(res, business, 201);
}

export async function listBusinesses(req: Request, res: Response) {
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.BusinessProfileWhereInput = { verified: true };

  if (isNonEmptyString(q.businessType) && BUSINESS_TYPES.includes(q.businessType as any)) {
    where.businessType = q.businessType as (typeof BUSINESS_TYPES)[number];
  }
  if (isNonEmptyString(q.country)) where.country = { equals: q.country as string, mode: "insensitive" };
  if (isNonEmptyString(q.city)) where.city = { equals: q.city as string, mode: "insensitive" };
  if (isNonEmptyString(q.search)) {
    where.businessName = { contains: q.search as string, mode: "insensitive" };
  }

  let orderBy: Prisma.BusinessProfileOrderByWithRelationInput = { createdAt: "desc" };
  switch (q.sortBy) {
    case "rating":
      orderBy = { rating: "desc" };
      break;
    case "reviewCount":
      orderBy = { reviewCount: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
  }

  const [businesses, total] = await Promise.all([
    prisma.businessProfile.findMany({ where, orderBy, skip, take: limit }),
    prisma.businessProfile.count({ where }),
  ]);

  okPaginated(res, businesses, { page, limit, total });
}

export async function getBusinessBySlug(req: Request, res: Response) {
  const { slug } = req.params;
  const business = await prisma.businessProfile.findUnique({
    where: { slug },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
    },
  });
  if (!business) {
    fail(res, 404, "Business not found");
    return;
  }
  ok(res, business);
}

export async function getBusinessVehicles(req: Request, res: Response) {
  const { id } = req.params;
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const business = await prisma.businessProfile.findUnique({ where: { id } });
  if (!business) {
    fail(res, 404, "Business not found");
    return;
  }

  const where: Prisma.VehicleWhereInput = {
    sellerId: business.userId,
    status: "ACTIVE",
    deletedAt: null,
  };

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      include: { photos: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.vehicle.count({ where }),
  ]);

  okPaginated(res, vehicles, { page, limit, total });
}

export async function updateBusiness(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const business = await prisma.businessProfile.findUnique({ where: { id } });
  if (!business) {
    fail(res, 404, "Business not found");
    return;
  }
  if (business.userId !== userId) {
    fail(res, 403, "You do not own this business profile");
    return;
  }

  const body = req.body ?? {};
  const data: Prisma.BusinessProfileUpdateInput = {};

  const stringFields = ["businessName", "description", "logo", "coverImage", "address", "country", "city", "phone", "website"] as const;
  for (const field of stringFields) {
    if (body[field] !== undefined) {
      (data as any)[field] = isNonEmptyString(body[field]) ? body[field] : null;
    }
  }

  if (body.businessType !== undefined) {
    if (!BUSINESS_TYPES.includes(body.businessType)) {
      fail(res, 400, `businessType must be one of: ${BUSINESS_TYPES.join(", ")}`);
      return;
    }
    data.businessType = body.businessType;
  }

  const updated = await prisma.businessProfile.update({ where: { id }, data });
  ok(res, updated);
}

export async function myBusiness(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const businesses = await prisma.businessProfile.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  ok(res, businesses);
}
