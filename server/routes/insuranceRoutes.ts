import { Router } from "express";
import * as insuranceController from "../controllers/insuranceController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/policies", requireAuth, insuranceController.createPolicy);
router.get("/policies", requireAuth, insuranceController.listPolicies);
router.get("/policies/:id", requireAuth, insuranceController.getPolicy);
router.patch("/policies/:id/cancel", requireAuth, insuranceController.cancelPolicy);
router.patch("/policies/:id", requireAuth, insuranceController.updatePolicy);

router.post("/claims", requireAuth, insuranceController.createClaim);
router.get("/claims", requireAuth, insuranceController.listClaims);
router.get("/claims/:id", requireAuth, insuranceController.getClaim);
router.patch("/claims/:id/status", requireAuth, insuranceController.updateClaimStatus);

export default router;
