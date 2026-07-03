import { Router } from "express";
import * as notificationController from "../controllers/notificationController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/unread-count", requireAuth, notificationController.unreadCount);
router.get("/", requireAuth, notificationController.listNotifications);
router.patch("/read-all", requireAuth, notificationController.markAllAsRead);
router.patch("/:id/read", requireAuth, notificationController.markAsRead);
router.delete("/:id", requireAuth, notificationController.deleteNotification);

export default router;
