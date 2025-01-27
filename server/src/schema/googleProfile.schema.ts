import { z } from "zod";

export const GoogleProfileSchema = z.object({
  provider: z.string(),
  id: z.string(),
  sub: z.string(),
  displayName: z.string(),
  name: z.object({
    givenName: z.string(),
    familyName: z.string(),
  }),
  email: z.string(),
  email_verified: z.boolean(),
  verified: z.boolean().optional(),
  given_name: z.string(),
  family_name: z.string(),
  picture: z.string(),
  emails: z
    .array(
      z.object({
        value: z.string(),
        type: z.string().optional(),
      })
    )
    .optional(),
  photos: z
    .array(
      z.object({
        value: z.string(),
        type: z.string().optional(),
      })
    )
    .optional(),
  _raw: z.string().optional(),
  _json: z.object({
    sub: z.string(),
    name: z.string(),
    given_name: z.string(),
    family_name: z.string(),
    picture: z.string(),
    email: z.string(),
    email_verified: z.boolean(),
    hd: z.string().optional(),
    domain: z.string().optional(),
  }),
});

export type GoogleProfile = z.infer<typeof GoogleProfileSchema>;
