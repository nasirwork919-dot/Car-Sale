import { Router } from "express";
import * as dashboardController from "../controllers/dashboardController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/user", requireAuth, dashboardController.userDashboard);
router.get("/business", requireAuth, dashboardController.businessDashboard);
router.get("/government", requireAuth, requireRole("GOVERNMENT"), dashboardController.governmentDashboard);
router.get("/police", requireAuth, requireRole("POLICE"), dashboardController.policeDashboard);
router.get("/insurance", requireAuth, requireRole("INSURANCE"), dashboardController.insuranceDashboard);

export default router;
