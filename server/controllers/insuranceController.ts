import { Response } from "express";
import { prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { ok, okPaginated, fail, parsePagination } from "../utils/response";
import { isNonEmptyString } from "../utils/validation";
import { ClaimStatus, PolicyStatus, Prisma } from "@prisma/client";
import { createNotification } from "../services/notificationService";

const POLICY_STATUSES = ["ACTIVE", "EXPIRED", "CANCELLED"] as const;
const CLAIM_STATUSES = ["OPEN", "REVIEWING", "APPROVED", "DENIED", "CLOSED"] as const;
const UPDATABLE_CLAIM_STATUSES = ["REVIEWING", "APPROVED", "DENIED", "CLOSED"] as const;

function toNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function toDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value as string);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export async function createPolicy(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { vehicleId, insurerId, policyNumber, coverageType, deductible, premium, startDate, endDate, documentUrl } = req.body ?? {};

  if (!isNonEmptyString(policyNumber)) {
    fail(res, 400, "policyNumber is required");
    return;
  }
  if (!isNonEmptyString(coverageType)) {
    fail(res, 400, "coverageType is required");
    return;
  }
  const deductibleNum = toNumber(deductible);
  const premiumNum = toNumber(premium);
  const start = toDate(startDate);
  const end = toDate(endDate);
  if (deductibleNum === undefined || premiumNum === undefined) {
    fail(res, 400, "A valid deductible and premium are required");
    return;
  }
  if (!start || !end) {
    fail(res, 400, "A valid startDate and endDate are required");
    return;
  }

  const existing = await prisma.insurancePolicy.findUnique({ where: { policyNumber } });
  if (existing) {
    fail(res, 409, "A policy with this policyNumber already exists");
    return;
  }

  if (isNonEmptyString(vehicleId)) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      fail(res, 404, "Vehicle not found");
      return;
    }
  }

  const policy = await prisma.insurancePolicy.create({
    data: {
      userId,
      vehicleId: isNonEmptyString(vehicleId) ? vehicleId : null,
      insurerId: isNonEmptyString(insurerId) ? insurerId : null,
      policyNumber,
      coverageType,
      deductible: deductibleNum,
      premium: premiumNum,
      startDate: start,
      endDate: end,
      documentUrl: isNonEmptyString(documentUrl) ? documentUrl : null,
      status: "ACTIVE",
    },
  });

  ok(res, policy, 201);
}

export async function listPolicies(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.InsurancePolicyWhereInput = { userId };
  if (isNonEmptyString(q.status) && POLICY_STATUSES.includes(q.status as any)) where.status = q.status as PolicyStatus;
  if (isNonEmptyString(q.vehicleId)) where.vehicleId = q.vehicleId as string;

  const [policies, total] = await Promise.all([
    prisma.insurancePolicy.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.insurancePolicy.count({ where }),
  ]);

  okPaginated(res, policies, { page, limit, total });
}

export async function getPolicy(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const policy = await prisma.insurancePolicy.findUnique({ where: { id } });
  if (!policy) {
    fail(res, 404, "Policy not found");
    return;
  }
  if (policy.userId !== userId) {
    fail(res, 403, "You do not own this policy");
    return;
  }
  ok(res, policy);
}

export async function updatePolicy(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const policy = await prisma.insurancePolicy.findUnique({ where: { id } });
  if (!policy) {
    fail(res, 404, "Policy not found");
    return;
  }
  if (policy.userId !== userId) {
    fail(res, 403, "You do not own this policy");
    return;
  }

  const { coverageType, deductible, premium, startDate, endDate, documentUrl } = req.body ?? {};
  const data: Prisma.InsurancePolicyUpdateInput = {};

  if (coverageType !== undefined) {
    if (!isNonEmptyString(coverageType)) {
      fail(res, 400, "coverageType must be a non-empty string");
      return;
    }
    data.coverageType = coverageType;
  }
  if (deductible !== undefined) {
    const n = toNumber(deductible);
    if (n === undefined) {
      fail(res, 400, "deductible must be a number");
      return;
    }
    data.deductible = n;
  }
  if (premium !== undefined) {
    const n = toNumber(premium);
    if (n === undefined) {
      fail(res, 400, "premium must be a number");
      return;
    }
    data.premium = n;
  }
  if (startDate !== undefined) {
    const d = toDate(startDate);
    if (!d) {
      fail(res, 400, "startDate must be a valid date");
      return;
    }
    data.startDate = d;
  }
  if (endDate !== undefined) {
    const d = toDate(endDate);
    if (!d) {
      fail(res, 400, "endDate must be a valid date");
      return;
    }
    data.endDate = d;
  }
  if (documentUrl !== undefined) data.documentUrl = isNonEmptyString(documentUrl) ? documentUrl : null;

  const updated = await prisma.insurancePolicy.update({ where: { id }, data });
  ok(res, updated);
}

export async function cancelPolicy(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const policy = await prisma.insurancePolicy.findUnique({ where: { id } });
  if (!policy) {
    fail(res, 404, "Policy not found");
    return;
  }
  if (policy.userId !== userId) {
    fail(res, 403, "You do not own this policy");
    return;
  }

  const updated = await prisma.insurancePolicy.update({ where: { id }, data: { status: "CANCELLED" } });
  ok(res, updated);
}

export async function createClaim(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { policyId, vehicleId, incidentDate, incidentType, description, evidenceUrls } = req.body ?? {};

  if (!isNonEmptyString(policyId)) {
    fail(res, 400, "policyId is required");
    return;
  }
  if (!isNonEmptyString(vehicleId)) {
    fail(res, 400, "vehicleId is required");
    return;
  }
  if (!isNonEmptyString(incidentType)) {
    fail(res, 400, "incidentType is required");
    return;
  }
  const incidentDateParsed = toDate(incidentDate);
  if (!incidentDateParsed) {
    fail(res, 400, "A valid incidentDate is required");
    return;
  }

  const policy = await prisma.insurancePolicy.findUnique({ where: { id: policyId } });
  if (!policy) {
    fail(res, 404, "Policy not found");
    return;
  }
  if (policy.userId !== userId) {
    fail(res, 403, "You do not own this policy");
    return;
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) {
    fail(res, 404, "Vehicle not found");
    return;
  }

  const claim = await prisma.claim.create({
    data: {
      policyId,
      userId,
      vehicleId,
      incidentDate: incidentDateParsed,
      incidentType,
      description: isNonEmptyString(description) ? description : null,
      evidenceUrls: Array.isArray(evidenceUrls) ? evidenceUrls : undefined,
      status: "OPEN",
    },
  });

  ok(res, claim, 201);
}

export async function listClaims(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.ClaimWhereInput = { userId };
  if (isNonEmptyString(q.status) && CLAIM_STATUSES.includes(q.status as any)) where.status = q.status as ClaimStatus;
  if (isNonEmptyString(q.vehicleId)) where.vehicleId = q.vehicleId as string;

  const [claims, total] = await Promise.all([
    prisma.claim.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.claim.count({ where }),
  ]);

  okPaginated(res, claims, { page, limit, total });
}

export async function getClaim(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const { id } = req.params;

  const claim = await prisma.claim.findUnique({ where: { id } });
  if (!claim) {
    fail(res, 404, "Claim not found");
    return;
  }
  if (claim.userId !== userId && userRole !== "INSURANCE") {
    fail(res, 403, "You do not have permission to view this claim");
    return;
  }
  ok(res, claim);
}

export async function updateClaimStatus(req: AuthenticatedRequest, res: Response) {
  const userRole = req.user!.role;
  const { id } = req.params;
  const { status } = req.body ?? {};

  if (userRole !== "INSURANCE") {
    fail(res, 403, "Only insurance representatives can update claim status");
    return;
  }
  if (!isNonEmptyString(status) || !UPDATABLE_CLAIM_STATUSES.includes(status as any)) {
    fail(res, 400, `status must be one of: ${UPDATABLE_CLAIM_STATUSES.join(", ")}`);
    return;
  }

  const claim = await prisma.claim.findUnique({ where: { id } });
  if (!claim) {
    fail(res, 404, "Claim not found");
    return;
  }

  const updated = await prisma.claim.update({ where: { id }, data: { status: status as ClaimStatus } });

  await createNotification(
    claim.userId,
    "CLAIM_STATUS_UPDATED",
    "Claim status updated",
    `Your insurance claim status changed to ${status}`,
    `/claims/${id}`,
  );

  ok(res, updated);
}
