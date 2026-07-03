import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { ok, okPaginated, fail, parsePagination } from "../utils/response";
import { isNonEmptyString } from "../utils/validation";
import { InspectionResult, Prisma } from "@prisma/client";

const RESULTS = ["PASSED", "FAILED", "REINSPECTION"] as const;

function toInt(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) ? n : undefined;
}

const inspectionInclude = {
  vehicle: { select: { id: true, vin: true, make: true, model: true, year: true } },
  inspector: { select: { id: true, firstName: true, lastName: true, avatar: true } },
};

export async function createInspection(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { vehicleId, centerId, result, mileageRecorded, notes, fraudFlags, certificateUrl } = req.body ?? {};

  if (!isNonEmptyString(vehicleId)) {
    fail(res, 400, "vehicleId is required");
    return;
  }
  if (!isNonEmptyString(result) || !RESULTS.includes(result as any)) {
    fail(res, 400, `result must be one of: ${RESULTS.join(", ")}`);
    return;
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) {
    fail(res, 404, "Vehicle not found");
    return;
  }

  const inspection = await prisma.inspection.create({
    data: {
      vehicleId,
      inspectorId: userId,
      centerId: isNonEmptyString(centerId) ? centerId : null,
      result: result as InspectionResult,
      mileageRecorded: toInt(mileageRecorded) ?? null,
      notes: isNonEmptyString(notes) ? notes : null,
      fraudFlags: Array.isArray(fraudFlags) ? fraudFlags : undefined,
      certificateUrl: isNonEmptyString(certificateUrl) ? certificateUrl : null,
    },
    include: inspectionInclude,
  });

  ok(res, inspection, 201);
}

export async function listInspections(req: Request, res: Response) {
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.InspectionWhereInput = {};
  if (isNonEmptyString(q.vehicleId)) where.vehicleId = q.vehicleId as string;
  if (isNonEmptyString(q.inspectorId)) where.inspectorId = q.inspectorId as string;
  if (isNonEmptyString(q.centerId)) where.centerId = q.centerId as string;
  if (isNonEmptyString(q.result) && RESULTS.includes(q.result as any)) where.result = q.result as InspectionResult;

  const [inspections, total] = await Promise.all([
    prisma.inspection.findMany({ where, include: inspectionInclude, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.inspection.count({ where }),
  ]);

  okPaginated(res, inspections, { page, limit, total });
}

export async function getInspection(req: Request, res: Response) {
  const { id } = req.params;
  const inspection = await prisma.inspection.findUnique({ where: { id }, include: inspectionInclude });
  if (!inspection) {
    fail(res, 404, "Inspection not found");
    return;
  }
  ok(res, inspection);
}

export async function myInspections(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.InspectionWhereInput = { inspectorId: userId };
  const [inspections, total] = await Promise.all([
    prisma.inspection.findMany({ where, include: inspectionInclude, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.inspection.count({ where }),
  ]);

  okPaginated(res, inspections, { page, limit, total });
}

export async function updateInspection(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const inspection = await prisma.inspection.findUnique({ where: { id } });
  if (!inspection) {
    fail(res, 404, "Inspection not found");
    return;
  }
  if (inspection.inspectorId !== userId) {
    fail(res, 403, "You did not create this inspection");
    return;
  }

  const { result, notes, fraudFlags } = req.body ?? {};
  const data: Prisma.InspectionUpdateInput = {};

  if (result !== undefined) {
    if (!RESULTS.includes(result)) {
      fail(res, 400, `result must be one of: ${RESULTS.join(", ")}`);
      return;
    }
    data.result = result;
  }
  if (notes !== undefined) data.notes = isNonEmptyString(notes) ? notes : null;
  if (fraudFlags !== undefined) data.fraudFlags = Array.isArray(fraudFlags) ? fraudFlags : Prisma.JsonNull;

  const updated = await prisma.inspection.update({ where: { id }, data, include: inspectionInclude });
  ok(res, updated);
}
