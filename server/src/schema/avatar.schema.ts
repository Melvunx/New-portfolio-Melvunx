import { z } from "zod";

export const AvatarSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type Avatar = z.infer<typeof AvatarSchema>;

export const AvatarsSchema = z.array(AvatarSchema);
