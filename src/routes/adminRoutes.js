import express from "express";

import {
  getDashboardStats,
  approveProvider,
} from "../controllers/adminController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, authorize("admin"), getDashboardStats);

router.patch(
  "/providers/:id/approve",
  protect,
  authorize("admin"),
  approveProvider,
);

export default router;
