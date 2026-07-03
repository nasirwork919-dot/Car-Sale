import { Router } from "express";
import * as marketplaceController from "../controllers/marketplaceController";

const router = Router();

router.get("/stats", marketplaceController.stats);
router.get("/featured", marketplaceController.featured);
router.get("/makes", marketplaceController.makes);
router.get("/recent", marketplaceController.recent);

export default router;
