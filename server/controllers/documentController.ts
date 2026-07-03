import { Response } from "express";
import { prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { ok, fail } from "../utils/response";
import { isNonEmptyString } from "../utils/validation";
import { DocumentType, Prisma } from "@prisma/client";

const DOCUMENT_TYPES = [
  "ID_CARD",
  "PASSPORT",
  "REGISTRATION",
  "INSURANCE",
  "INSPECTION",
  "CONTRACT",
  "INVOICE",
  "RECEIPT",
] as const;

export async function createDocument(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { vehicleId, type, url, name } = req.body ?? {};

  if (!isNonEmptyString(type) || !DOCUMENT_TYPES.includes(type as any)) {
    fail(res, 400, `type must be one of: ${DOCUMENT_TYPES.join(", ")}`);
    return;
  }
  if (!isNonEmptyString(url)) {
    fail(res, 400, "url is required");
    return;
  }
  if (!isNonEmptyString(name)) {
    fail(res, 400, "name is required");
    return;
  }

  if (vehicleId !== undefined && vehicleId !== null) {
    if (!isNonEmptyString(vehicleId)) {
      fail(res, 400, "vehicleId must be a string");
      return;
    }
    const vehicle = await prisma.vehicle.findFirst({ where: { id: vehicleId, deletedAt: null } });
    if (!vehicle) {
      fail(res, 404, "Vehicle not found");
      return;
    }
  }

  const document = await prisma.document.create({
    data: {
      userId,
      vehicleId: isNonEmptyString(vehicleId) ? vehicleId : null,
      type: type as DocumentType,
      url,
      name,
    },
  });

  ok(res, document, 201);
}

export async function listDocuments(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const q = req.query as Record<string, unknown>;

  const where: Prisma.DocumentWhereInput = { userId };
  if (isNonEmptyString(q.type) && DOCUMENT_TYPES.includes(q.type as any)) where.type = q.type as DocumentType;
  if (isNonEmptyString(q.vehicleId)) where.vehicleId = q.vehicleId as string;

  const documents = await prisma.document.findMany({ where, orderBy: { createdAt: "desc" } });
  ok(res, documents);
}

export async function getDocument(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) {
    fail(res, 404, "Document not found");
    return;
  }
  if (document.userId !== userId) {
    fail(res, 403, "You do not have permission to view this document");
    return;
  }
  ok(res, document);
}

export async function deleteDocument(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) {
    fail(res, 404, "Document not found");
    return;
  }
  if (document.userId !== userId) {
    fail(res, 403, "You do not have permission to delete this document");
    return;
  }

  await prisma.document.delete({ where: { id } });
  ok(res, { id, deleted: true });
}
