import { Router } from "express";
import * as inspectionController from "../controllers/inspectionController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/my-inspections", requireAuth, inspectionController.myInspections);
router.post("/", requireAuth, requireRole("GOVERNMENT", "WORKSHOP"), inspectionController.createInspection);
router.get("/", inspectionController.listInspections);
router.get("/:id", inspectionController.getInspection);
router.patch("/:id", requireAuth, inspectionController.updateInspection);

export default router;
