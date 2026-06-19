import express from "express";

import { register, login, getMe } from "../controllers/authController.js";

import validate from "../middleware/validate.js";

import { loginLimiter } from "../middleware/rateLimiters.js";

import { registerSchema, loginSchema } from "../validators/authSchemas.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", loginLimiter, validate(loginSchema), login);

router.get("/me", protect, getMe);

export default router;
