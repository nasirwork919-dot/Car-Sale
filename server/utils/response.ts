import { Response } from "express";

export function ok(res: Response, data: unknown, status = 200) {
  res.status(status).json({ success: true, data });
}

export function okPaginated(
  res: Response,
  data: unknown,
  meta: { page: number; limit: number; total: number },
) {
  res.status(200).json({
    success: true,
    data,
    meta: {
      page: meta.page,
      limit: meta.limit,
      total: meta.total,
      totalPages: Math.max(1, Math.ceil(meta.total / meta.limit)),
    },
  });
}

export function fail(res: Response, status: number, error: string) {
  res.status(status).json({ success: false, error });
}

export function parsePagination(query: Record<string, unknown>, defaultLimit = 20, maxLimit = 100) {
  let page = parseInt(String(query.page ?? "1"), 10);
  let limit = parseInt(String(query.limit ?? String(defaultLimit)), 10);
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = defaultLimit;
  if (limit > maxLimit) limit = maxLimit;
  return { page, limit, skip: (page - 1) * limit };
}
