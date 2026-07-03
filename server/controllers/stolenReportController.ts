import { Response } from "express";
import { prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { ok, okPaginated, fail, parsePagination } from "../utils/response";
import { isNonEmptyString } from "../utils/validation";
import { Prisma, StolenReportStatus } from "@prisma/client";

const REPORT_STATUSES = ["OPEN", "INVESTIGATING", "RECOVERED", "CLOSED"] as const;
const UPDATABLE_STATUSES = ["INVESTIGATING", "RECOVERED", "CLOSED"] as const;

function toDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value as string);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

const reportInclude = {
  vehicle: { select: { id: true, vin: true, make: true, model: true, year: true, status: true } },
  reporter: { select: { id: true, firstName: true, lastName: true, avatar: true } },
};

export async function createReport(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { vehicleId, incidentDate, policeRef, description } = req.body ?? {};

  if (!isNonEmptyString(vehicleId)) {
    fail(res, 400, "vehicleId is required");
    return;
  }
  const incidentDateParsed = toDate(incidentDate);
  if (!incidentDateParsed) {
    fail(res, 400, "A valid incidentDate is required");
    return;
  }

  const vehicle = await prisma.vehicle.findFirst({ where: { id: vehicleId, deletedAt: null } });
  if (!vehicle) {
    fail(res, 404, "Vehicle not found");
    return;
  }
  if (vehicle.sellerId !== userId) {
    fail(res, 403, "You do not own this vehicle");
    return;
  }

  const existingOpen = await prisma.stolenReport.findFirst({
    where: { vehicleId, status: { in: ["OPEN", "INVESTIGATING"] } },
  });
  if (existingOpen) {
    fail(res, 409, "This vehicle already has an open stolen report");
    return;
  }

  const [report] = await prisma.$transaction([
    prisma.stolenReport.create({
      data: {
        vehicleId,
        reporterId: userId,
        incidentDate: incidentDateParsed,
        policeRef: isNonEmptyString(policeRef) ? policeRef : null,
        description: isNonEmptyString(description) ? description : null,
        status: "OPEN",
      },
      include: reportInclude,
    }),
    prisma.vehicle.update({ where: { id: vehicleId }, data: { status: "FLAGGED" } }),
  ]);

  ok(res, report, 201);
}

export async function listReports(req: AuthenticatedRequest, res: Response) {
  const userRole = req.user!.role;
  if (userRole !== "POLICE" && userRole !== "GOVERNMENT") {
    fail(res, 403, "Only police or government accounts can view all stolen reports");
    return;
  }

  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.StolenReportWhereInput = {};
  if (isNonEmptyString(q.status) && REPORT_STATUSES.includes(q.status as any)) where.status = q.status as StolenReportStatus;

  const [reports, total] = await Promise.all([
    prisma.stolenReport.findMany({ where, include: reportInclude, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.stolenReport.count({ where }),
  ]);

  okPaginated(res, reports, { page, limit, total });
}

export async function getReport(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const { id } = req.params;

  const report = await prisma.stolenReport.findUnique({ where: { id }, include: reportInclude });
  if (!report) {
    fail(res, 404, "Report not found");
    return;
  }
  if (report.reporterId !== userId && userRole !== "POLICE" && userRole !== "GOVERNMENT") {
    fail(res, 403, "You do not have permission to view this report");
    return;
  }
  ok(res, report);
}

export async function updateReportStatus(req: AuthenticatedRequest, res: Response) {
  const userRole = req.user!.role;
  const { id } = req.params;
  const { status } = req.body ?? {};

  if (userRole !== "POLICE") {
    fail(res, 403, "Only police accounts can update report status");
    return;
  }
  if (!isNonEmptyString(status) || !UPDATABLE_STATUSES.includes(status as any)) {
    fail(res, 400, `status must be one of: ${UPDATABLE_STATUSES.join(", ")}`);
    return;
  }

  const report = await prisma.stolenReport.findUnique({ where: { id } });
  if (!report) {
    fail(res, 404, "Report not found");
    return;
  }

  const updates: Prisma.PrismaPromise<any>[] = [
    prisma.stolenReport.update({ where: { id }, data: { status: status as StolenReportStatus }, include: reportInclude }),
  ];
  if (status === "RECOVERED") {
    updates.push(prisma.vehicle.update({ where: { id: report.vehicleId }, data: { status: "ACTIVE" } }));
  }

  const [updated] = await prisma.$transaction(updates);
  ok(res, updated);
}
