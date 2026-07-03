import { Response } from "express";
import { Request } from "express";
import { prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { ok, okPaginated, fail, parsePagination } from "../utils/response";

export async function createReview(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id: businessId } = req.params;
  const { rating, comment } = req.body ?? {};

  const ratingNum = Number(rating);
  if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    fail(res, 400, "rating must be a number between 1 and 5");
    return;
  }

  const business = await prisma.businessProfile.findUnique({ where: { id: businessId } });
  if (!business) {
    fail(res, 404, "Business not found");
    return;
  }
  if (business.userId === userId) {
    fail(res, 400, "You cannot review your own business");
    return;
  }

  const existing = await prisma.review.findUnique({
    where: { reviewerId_businessId: { reviewerId: userId, businessId } },
  });
  if (existing) {
    fail(res, 409, "You have already reviewed this business");
    return;
  }

  const review = await prisma.$transaction(async (tx) => {
    const created = await tx.review.create({
      data: {
        reviewerId: userId,
        businessId,
        rating: Math.round(ratingNum),
        comment: typeof comment === "string" && comment.trim().length > 0 ? comment : null,
      },
    });

    const agg = await tx.review.aggregate({
      where: { businessId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await tx.businessProfile.update({
      where: { id: businessId },
      data: {
        rating: agg._avg.rating ?? 0,
        reviewCount: agg._count.rating,
      },
    });

    return created;
  });

  ok(res, review, 201);
}

export async function listReviews(req: Request, res: Response) {
  const { id: businessId } = req.params;
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { businessId },
      include: {
        reviewer: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.review.count({ where: { businessId } }),
  ]);

  okPaginated(res, reviews, { page, limit, total });
}

export async function deleteReview(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    fail(res, 404, "Review not found");
    return;
  }
  if (review.reviewerId !== userId) {
    fail(res, 403, "You can only delete your own review");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id } });
    const agg = await tx.review.aggregate({
      where: { businessId: review.businessId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await tx.businessProfile.update({
      where: { id: review.businessId },
      data: {
        rating: agg._avg.rating ?? 0,
        reviewCount: agg._count.rating,
      },
    });
  });

  ok(res, { id, deleted: true });
}
