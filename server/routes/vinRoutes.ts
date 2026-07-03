import { Router } from "express";
import * as vinController from "../controllers/vinController";

const router = Router();

router.get("/:vin/inspections", vinController.vinInspections);
router.get("/:vin/ownership", vinController.vinOwnership);
router.get("/:vin/stolen", vinController.vinStolen);
router.get("/:vin/fraud-score", vinController.vinFraudScore);
router.get("/:vin", vinController.lookupVin);

export default router;
