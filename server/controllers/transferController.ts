import { Response } from "express";
import { prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { ok, fail } from "../utils/response";
import { isNonEmptyString } from "../utils/validation";

const transferInclude = {
  vehicle: { select: { id: true, vin: true, make: true, model: true, year: true } },
  fromUser: { select: { id: true, firstName: true, lastName: true, avatar: true } },
  toUser: { select: { id: true, firstName: true, lastName: true, avatar: true } },
};

export async function createTransfer(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { vehicleId, toUserId } = req.body ?? {};

  if (!isNonEmptyString(vehicleId)) {
    fail(res, 400, "vehicleId is required");
    return;
  }
  if (!isNonEmptyString(toUserId)) {
    fail(res, 400, "toUserId is required");
    return;
  }
  if (toUserId === userId) {
    fail(res, 400, "Cannot transfer a vehicle to yourself");
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

  const toUser = await prisma.user.findUnique({ where: { id: toUserId } });
  if (!toUser) {
    fail(res, 404, "Recipient user not found");
    return;
  }

  const existingPending = await prisma.ownershipTransfer.findFirst({ where: { vehicleId, status: "PENDING" } });
  if (existingPending) {
    fail(res, 409, "This vehicle already has a pending transfer");
    return;
  }

  const transfer = await prisma.ownershipTransfer.create({
    data: {
      vehicle: { connect: { id: vehicleId } },
      fromUser: { connect: { id: userId } },
      toUser: { connect: { id: toUserId } },
      transferDate: new Date(),
      status: "PENDING",
    },
    include: transferInclude,
  });

  ok(res, transfer, 201);
}

export async function confirmTransfer(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const transfer = await prisma.ownershipTransfer.findUnique({ where: { id } });
  if (!transfer) {
    fail(res, 404, "Transfer not found");
    return;
  }
  if (transfer.toUserId !== userId) {
    fail(res, 403, "Only the recipient can confirm this transfer");
    return;
  }
  if (transfer.status !== "PENDING") {
    fail(res, 400, "This transfer is no longer pending");
    return;
  }

  const [updatedTransfer] = await prisma.$transaction([
    prisma.ownershipTransfer.update({
      where: { id },
      data: { status: "CONFIRMED", transferDate: new Date() },
      include: transferInclude,
    }),
    prisma.vehicle.update({ where: { id: transfer.vehicleId }, data: { sellerId: transfer.toUserId } }),
  ]);

  ok(res, updatedTransfer);
}

export async function cancelTransfer(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const transfer = await prisma.ownershipTransfer.findUnique({ where: { id } });
  if (!transfer) {
    fail(res, 404, "Transfer not found");
    return;
  }
  if (transfer.fromUserId !== userId && transfer.toUserId !== userId) {
    fail(res, 403, "You are not a party to this transfer");
    return;
  }
  if (transfer.status !== "PENDING") {
    fail(res, 400, "Only pending transfers can be cancelled");
    return;
  }

  const updated = await prisma.ownershipTransfer.update({ where: { id }, data: { status: "CANCELLED" }, include: transferInclude });
  ok(res, updated);
}

export async function myTransfers(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;

  const transfers = await prisma.ownershipTransfer.findMany({
    where: { OR: [{ fromUserId: userId }, { toUserId: userId }] },
    include: transferInclude,
    orderBy: { createdAt: "desc" },
  });

  ok(res, transfers);
}
