import { Router } from "express";
import * as transferController from "../controllers/transferController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/my-transfers", requireAuth, transferController.myTransfers);
router.post("/", requireAuth, transferController.createTransfer);
router.patch("/:id/confirm", requireAuth, transferController.confirmTransfer);
router.patch("/:id/cancel", requireAuth, transferController.cancelTransfer);

export default router;
