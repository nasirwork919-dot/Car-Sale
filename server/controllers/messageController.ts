import { Response } from "express";
import { prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { ok, okPaginated, fail, parsePagination } from "../utils/response";
import { isNonEmptyString } from "../utils/validation";
import { createNotification } from "../services/notificationService";

const userSelect = { id: true, firstName: true, lastName: true, avatar: true };

export async function sendMessage(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { receiverId, vehicleId, content } = req.body ?? {};

  if (!isNonEmptyString(receiverId)) {
    fail(res, 400, "receiverId is required");
    return;
  }
  if (receiverId === userId) {
    fail(res, 400, "You cannot send a message to yourself");
    return;
  }
  if (!isNonEmptyString(content)) {
    fail(res, 400, "content is required");
    return;
  }

  const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
  if (!receiver) {
    fail(res, 404, "Receiver not found");
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

  const message = await prisma.message.create({
    data: {
      senderId: userId,
      receiverId,
      vehicleId: isNonEmptyString(vehicleId) ? vehicleId : null,
      content,
      read: false,
    },
    include: {
      sender: { select: userSelect },
      receiver: { select: userSelect },
      vehicle: { select: { id: true, make: true, model: true, year: true } },
    },
  });

  const sender = await prisma.user.findUnique({ where: { id: userId }, select: { firstName: true, lastName: true } });
  await createNotification(
    receiverId,
    "NEW_MESSAGE",
    "New message",
    `${sender?.firstName ?? "Someone"} ${sender?.lastName ?? ""} sent you a message`.trim(),
    `/messages/${userId}`,
  );

  ok(res, message, 201);
}

export async function listConversations(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;

  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: userSelect },
      receiver: { select: userSelect },
      vehicle: { select: { id: true, make: true, model: true, year: true } },
    },
  });

  const conversations = new Map<
    string,
    {
      otherUser: (typeof userSelect extends never ? never : any);
      lastMessage: (typeof messages)[number];
      unreadCount: number;
      vehicle: (typeof messages)[number]["vehicle"] | null;
    }
  >();

  for (const message of messages) {
    const otherUser = message.senderId === userId ? message.receiver : message.sender;
    const key = otherUser.id;
    if (!conversations.has(key)) {
      conversations.set(key, {
        otherUser,
        lastMessage: message,
        unreadCount: 0,
        vehicle: message.vehicle,
      });
    }
    if (message.receiverId === userId && !message.read) {
      conversations.get(key)!.unreadCount += 1;
    }
  }

  const result = Array.from(conversations.values()).sort(
    (a, b) => b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime(),
  );

  ok(res, result);
}

export async function getConversation(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { userId: otherUserId } = req.params;
  const q = req.query as Record<string, unknown>;
  const { page, limit, skip } = parsePagination(q);

  const where: any = {
    OR: [
      { senderId: userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: userId },
    ],
  };
  if (isNonEmptyString(q.vehicleId)) {
    where.vehicleId = q.vehicleId;
  }

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      include: {
        sender: { select: userSelect },
        receiver: { select: userSelect },
        vehicle: { select: { id: true, make: true, model: true, year: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.message.count({ where }),
  ]);

  await prisma.message.updateMany({
    where: { senderId: otherUserId, receiverId: userId, read: false },
    data: { read: true },
  });

  okPaginated(res, messages, { page, limit, total });
}

export async function unreadCount(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const count = await prisma.message.count({ where: { receiverId: userId, read: false } });
  ok(res, { count });
}

export async function deleteMessage(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) {
    fail(res, 404, "Message not found");
    return;
  }
  if (message.senderId !== userId) {
    fail(res, 403, "You can only delete your own messages");
    return;
  }

  await prisma.message.delete({ where: { id } });
  ok(res, { id, deleted: true });
}
