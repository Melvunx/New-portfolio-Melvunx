import { z } from "zod";

export type Letter = z.infer<typeof LetterSchema>;

export const LetterSchema = z.object({
  id: z.string(),
  sender: z.string(),
  object: z.string(),
  email: z.string(),
  message: z.string(),
  sendAt: z.date(),
  account_id: z.string().optional(),
});

export const LettersSchema = z.array(LetterSchema);
