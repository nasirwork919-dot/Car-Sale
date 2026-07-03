import { Router } from "express";
import * as bookingController from "../controllers/bookingController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/my-bookings", requireAuth, bookingController.myBookings);
router.get("/business-bookings", requireAuth, bookingController.businessBookings);
router.post("/", requireAuth, bookingController.createBooking);
router.patch("/:id/status", requireAuth, bookingController.updateBookingStatus);

export default router;
