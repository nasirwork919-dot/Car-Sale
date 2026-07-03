import { Router } from "express";
import * as documentController from "../controllers/documentController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, documentController.listDocuments);
router.get("/:id", requireAuth, documentController.getDocument);
router.post("/", requireAuth, documentController.createDocument);
router.delete("/:id", requireAuth, documentController.deleteDocument);

export default router;
