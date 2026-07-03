import { Router } from "express";
import * as adminController from "../controllers/adminController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.use(requireAuth, requireRole("GOVERNMENT"));

router.get("/stats", adminController.platformStats);
router.get("/flagged", adminController.flaggedOverview);
router.get("/users", adminController.listUsers);
router.patch("/users/:id/role", adminController.updateUserRole);
router.patch("/users/:id/verify", adminController.verifyUser);
router.patch("/users/:id/ban", adminController.banUser);
router.get("/businesses", adminController.listBusinesses);
router.patch("/businesses/:id/verify", adminController.verifyBusiness);
router.patch("/businesses/:id/reject", adminController.rejectBusiness);

export default router;
