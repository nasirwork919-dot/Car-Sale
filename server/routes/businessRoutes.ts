import { Router } from "express";
import * as businessController from "../controllers/businessController";
import * as reviewController from "../controllers/reviewController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/my-business", requireAuth, businessController.myBusiness);
router.post("/", requireAuth, businessController.createBusiness);
router.get("/", businessController.listBusinesses);
router.get("/:slug", businessController.getBusinessBySlug);
router.get("/:id/vehicles", businessController.getBusinessVehicles);
router.put("/:id", requireAuth, businessController.updateBusiness);

router.post("/:id/reviews", requireAuth, reviewController.createReview);
router.get("/:id/reviews", reviewController.listReviews);

export default router;
