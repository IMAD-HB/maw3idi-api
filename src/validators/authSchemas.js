import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),

  email: z.email(),

  password: z.string().min(8, "Password must be at least 8 characters"),

  role: z.enum(["client", "provider", "admin"]).optional(),

  specialty: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email(),

  password: z.string().min(1),
});
