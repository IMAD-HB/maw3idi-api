import express from "express";

import {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
} from "../controllers/appointmentController.js";

import { protect } from "../middleware/authMiddleware.js";

import validate from "../middleware/validate.js";

import { bookingLimiter } from "../middleware/rateLimiters.js";

import { createAppointmentSchema } from "../validators/appointmentSchemas.js";

const router = express.Router();

router.post(
  "/",
  protect,
  bookingLimiter,
  validate(createAppointmentSchema),
  createAppointment,
);

router.get("/my", protect, getMyAppointments);

router.patch("/:id/cancel", protect, cancelAppointment);

export default router;
