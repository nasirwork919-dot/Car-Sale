import { Router } from "express";
import * as auctionController from "../controllers/auctionController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/my-auctions", requireAuth, auctionController.myAuctions);
router.get("/my-bids", requireAuth, auctionController.myBids);
router.post("/", requireAuth, auctionController.createAuction);
router.get("/", auctionController.listAuctions);
router.get("/:id", auctionController.getAuction);
router.post("/:id/bid", requireAuth, auctionController.placeBid);
router.patch("/:id/cancel", requireAuth, auctionController.cancelAuction);

export default router;
