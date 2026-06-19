import express from "express";

import {
  getDashboardStats,
  getAllProviders,
  approveProvider,
} from "../controllers/adminController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, authorize("admin"), getDashboardStats);

router.get("/providers", protect, authorize("admin"), getAllProviders);

router.patch(
  "/providers/:id/approve",
  protect,
  authorize("admin"),
  approveProvider,
);

export default router;
