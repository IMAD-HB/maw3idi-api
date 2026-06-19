import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const availabilitySchema = z.object({
  dayOfWeek: z.number().min(0).max(6),

  startTime: z.string().regex(timeRegex),

  endTime: z.string().regex(timeRegex),
});
