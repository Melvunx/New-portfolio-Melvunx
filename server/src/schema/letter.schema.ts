import { z } from "zod";

export interface Letter {
  id: number;
  sender: string;
  object: string;
  email: string;
  message: string;
  sendAt: Date;
  account_id?: number;
}

export const LetterSchema = z.object({
  id: z.number(),
  sender: z.string(),
  object: z.string(),
  email: z.string(),
  message: z.string(),
  sendAt: z.date(),
  account_id: z.number().optional(),
});

export const LettersSchema = z.array(LetterSchema);
