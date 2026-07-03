import { Router } from "express";
import * as transportController from "../controllers/transportController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/my-requests", requireAuth, transportController.myRequests);
router.get("/my-offers", requireAuth, transportController.myOffers);
router.patch("/offers/:offerId/accept", requireAuth, transportController.acceptOffer);
router.post("/", requireAuth, transportController.createRequest);
router.get("/", transportController.listRequests);
router.get("/:id", transportController.getRequest);
router.post("/:id/offers", requireAuth, transportController.createOffer);
router.patch("/:id/status", requireAuth, transportController.updateRequestStatus);

export default router;
