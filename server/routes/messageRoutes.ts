import { Router } from "express";
import * as messageController from "../controllers/messageController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/conversations", requireAuth, messageController.listConversations);
router.get("/conversation/:userId", requireAuth, messageController.getConversation);
router.get("/unread-count", requireAuth, messageController.unreadCount);
router.post("/", requireAuth, messageController.sendMessage);
router.delete("/:id", requireAuth, messageController.deleteMessage);

export default router;
