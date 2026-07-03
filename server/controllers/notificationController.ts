import { Response } from "express";
import { prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { ok, okPaginated, fail, parsePagination } from "../utils/response";
import { isNonEmptyString } from "../utils/validation";
import { Prisma } from "@prisma/client";

export async function listNotifications(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: Prisma.NotificationWhereInput = { userId };
  if (q.read === "true") where.read = true;
  if (q.read === "false") where.read = false;
  if (isNonEmptyString(q.type)) where.type = q.type as string;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.notification.count({ where }),
  ]);

  okPaginated(res, notifications, { page, limit, total });
}

export async function markAsRead(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) {
    fail(res, 404, "Notification not found");
    return;
  }
  if (notification.userId !== userId) {
    fail(res, 403, "You do not have permission to update this notification");
    return;
  }

  const updated = await prisma.notification.update({ where: { id }, data: { read: true } });
  ok(res, updated);
}

export async function markAllAsRead(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  await prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
  ok(res, { success: true });
}

export async function unreadCount(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const count = await prisma.notification.count({ where: { userId, read: false } });
  ok(res, { count });
}

export async function deleteNotification(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) {
    fail(res, 404, "Notification not found");
    return;
  }
  if (notification.userId !== userId) {
    fail(res, 403, "You do not have permission to delete this notification");
    return;
  }

  await prisma.notification.delete({ where: { id } });
  ok(res, { id, deleted: true });
}
