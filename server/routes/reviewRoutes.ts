import { Router } from "express";
import * as reviewController from "../controllers/reviewController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.delete("/:id", requireAuth, reviewController.deleteReview);

export default router;
