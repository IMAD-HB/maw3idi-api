import express from "express";

import {
  createAvailability,
  getProviderAvailability,
  deleteAvailability,
} from "../controllers/availabilityController.js";

import { protect } from "../middleware/authMiddleware.js";

import validate from "../middleware/validate.js";

import { availabilitySchema } from "../validators/availabilitySchemas.js";

const router = express.Router();

router.post("/", protect, validate(availabilitySchema), createAvailability);

router.get("/:providerId", getProviderAvailability);

router.delete("/:id", protect, deleteAvailability);

export default router;
