import { prisma } from "../utils/prisma";

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  link?: string | null,
) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link: link ?? null,
    },
  });
}
