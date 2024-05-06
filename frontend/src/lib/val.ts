import { z } from "zod";

export const usernameSchema = z
  .string()
  .regex(new RegExp(/^[0-9A-Z@#_-]+$/i))
  .min(3, "At Least 3 Characters")
  .max(30, "At Most 30 Characters");