import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createAppointmentSchema = z.object({
  provider: z.string(),

  date: z.string(),

  startTime: z.string().regex(timeRegex),

  endTime: z.string().regex(timeRegex),
});
