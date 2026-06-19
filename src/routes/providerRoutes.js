import express from "express";

import { protect, authorize } from "../middleware/authMiddleware.js";

import {
  getMyProviderProfile,
  updateMyProviderProfile,
  getProviders,
  getProviderById,
} from "../controllers/providerController.js";

const router = express.Router();

router.get("/me", protect, authorize("provider"), getMyProviderProfile);

router.patch("/me", protect, authorize("provider"), updateMyProviderProfile);

router.get("/", getProviders);

router.get("/:id", getProviderById);

export default router;
