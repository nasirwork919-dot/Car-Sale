import { Router } from "express";
import * as vehicleController from "../controllers/vehicleController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/my-listings", requireAuth, vehicleController.myListings);
router.post("/", requireAuth, vehicleController.createVehicle);
router.get("/", vehicleController.listVehicles);
router.get("/:id", vehicleController.getVehicle);
router.put("/:id", requireAuth, vehicleController.updateVehicle);
router.delete("/:id", requireAuth, vehicleController.deleteVehicle);
router.patch("/:id/status", requireAuth, vehicleController.updateVehicleStatus);

router.post("/:id/photos", requireAuth, vehicleController.addPhotos);
router.delete("/:vehicleId/photos/:photoId", requireAuth, vehicleController.deletePhoto);
router.patch("/:vehicleId/photos/:photoId", requireAuth, vehicleController.updatePhoto);

export default router;
