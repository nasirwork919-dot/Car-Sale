import { Router } from "express";
import * as stolenReportController from "../controllers/stolenReportController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/", requireAuth, stolenReportController.createReport);
router.get("/", requireAuth, stolenReportController.listReports);
router.get("/:id", requireAuth, stolenReportController.getReport);
router.patch("/:id/status", requireAuth, stolenReportController.updateReportStatus);

export default router;
