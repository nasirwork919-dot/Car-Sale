import { Router } from "express";
import * as sparePartController from "../controllers/sparePartController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/my-parts", requireAuth, sparePartController.myParts);
router.get("/compatible/:vin", sparePartController.compatibleWithVin);
router.get("/", sparePartController.listParts);
router.get("/:id", sparePartController.getPart);
router.post("/", requireAuth, sparePartController.createPart);
router.put("/:id", requireAuth, sparePartController.updatePart);
router.delete("/:id", requireAuth, sparePartController.deletePart);

export default router;
