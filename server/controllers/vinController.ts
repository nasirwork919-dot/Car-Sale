import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { ok, fail } from "../utils/response";

const vehicleWithHistoryInclude = {
  inspections: { include: { inspector: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { createdAt: "desc" as const } },
  ownershipTransfers: {
    include: {
      fromUser: { select: { id: true, firstName: true, lastName: true } },
      toUser: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { transferDate: "desc" as const },
  },
  stolenReports: { orderBy: { createdAt: "desc" as const } },
  insurancePolicies: { orderBy: { createdAt: "desc" as const } },
};

export async function lookupVin(req: Request, res: Response) {
  const { vin } = req.params;

  const vehicles = await prisma.vehicle.findMany({
    where: { vin },
    include: vehicleWithHistoryInclude,
  });

  if (vehicles.length === 0) {
    ok(res, { vehicles: [], message: "No vehicle found for this VIN" });
    return;
  }

  ok(res, { vehicles });
}

export async function vinInspections(req: Request, res: Response) {
  const { vin } = req.params;
  const vehicles = await prisma.vehicle.findMany({ where: { vin }, select: { id: true } });
  if (vehicles.length === 0) {
    ok(res, { inspections: [], message: "No vehicle found for this VIN" });
    return;
  }

  const inspections = await prisma.inspection.findMany({
    where: { vehicleId: { in: vehicles.map((v) => v.id) } },
    include: { inspector: { select: { id: true, firstName: true, lastName: true } } },
    orderBy: { createdAt: "desc" },
  });

  ok(res, inspections);
}

export async function vinOwnership(req: Request, res: Response) {
  const { vin } = req.params;
  const vehicles = await prisma.vehicle.findMany({ where: { vin }, select: { id: true } });
  if (vehicles.length === 0) {
    ok(res, { transfers: [], message: "No vehicle found for this VIN" });
    return;
  }

  const transfers = await prisma.ownershipTransfer.findMany({
    where: { vehicleId: { in: vehicles.map((v) => v.id) } },
    include: {
      fromUser: { select: { id: true, firstName: true, lastName: true } },
      toUser: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { transferDate: "asc" },
  });

  ok(res, transfers);
}

export async function vinStolen(req: Request, res: Response) {
  const { vin } = req.params;
  const vehicles = await prisma.vehicle.findMany({ where: { vin }, select: { id: true } });
  if (vehicles.length === 0) {
    ok(res, { reports: [], message: "No vehicle found for this VIN" });
    return;
  }

  const reports = await prisma.stolenReport.findMany({
    where: { vehicleId: { in: vehicles.map((v) => v.id) } },
    orderBy: { createdAt: "desc" },
  });

  ok(res, reports);
}

export async function vinFraudScore(req: Request, res: Response) {
  const { vin } = req.params;
  const vehicles = await prisma.vehicle.findMany({
    where: { vin },
    include: {
      inspections: { orderBy: { createdAt: "asc" } },
      ownershipTransfers: true,
      stolenReports: true,
    },
  });

  if (vehicles.length === 0) {
    fail(res, 404, "No vehicle found for this VIN");
    return;
  }

  const vehicle = vehicles[0];

  const transferCount = vehicle.ownershipTransfers.length;
  const failedInspections = vehicle.inspections.filter((i) => i.result === "FAILED").length;
  const stolenReportCount = vehicle.stolenReports.length;

  let mileageInconsistencies = 0;
  let lastMileage: number | null = null;
  for (const inspection of vehicle.inspections) {
    if (inspection.mileageRecorded === null || inspection.mileageRecorded === undefined) continue;
    if (lastMileage !== null && inspection.mileageRecorded < lastMileage) {
      mileageInconsistencies += 1;
    }
    lastMileage = inspection.mileageRecorded;
  }

  const transferPoints = Math.min(20, transferCount * 5);
  const inspectionPoints = Math.min(30, failedInspections * 15);
  const stolenPoints = Math.min(40, stolenReportCount * 40);
  const mileagePoints = Math.min(30, mileageInconsistencies * 20);

  const score = Math.min(100, transferPoints + inspectionPoints + stolenPoints + mileagePoints);

  ok(res, {
    vin,
    fraudScore: score,
    riskLevel: score >= 60 ? "HIGH" : score >= 30 ? "MEDIUM" : "LOW",
    breakdown: {
      ownershipTransfers: { count: transferCount, points: transferPoints },
      failedInspections: { count: failedInspections, points: inspectionPoints },
      stolenReports: { count: stolenReportCount, points: stolenPoints },
      mileageInconsistencies: { count: mileageInconsistencies, points: mileagePoints },
    },
  });
}
