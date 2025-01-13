import { z } from "zod";

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.union([z.string(), z.object({})]),
  stack: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const AccountSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  password: z.string(),
  name: z.string(),
  lastname: z.string(),
  verified: z.number(),
  cretedAt: z.string(),
  lastlogin: z.string().nullable(),
  role_id: z.string(),
});

export type Account = z.infer<typeof AccountSchema>;

export const AccountResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    account: AccountSchema,
  }),
});

export type AccountResponse = z.infer<typeof AccountResponseSchema>;

export const ApiResponseAccountSchema = z.union([
  AccountResponseSchema,
  ErrorResponseSchema,
]);

export type ApiResponseAccount = z.infer<typeof ApiResponseAccountSchema>;

export const AccountsSchema = z.array(AccountSchema);

export const AccountsResponseSchema = z.object({
  accounts: AccountsSchema,
});

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

export const UserRoleSchema = z.object({
  id: z.string(),
  status: z.string(),
});

export type UserRole = z.infer<typeof UserRoleSchema>;

export const ReactionLogSchema = z.object({
  id: z.string(),
  target_type_id: z.string(),
  target_id: z.string(),
  reaction_id: z.string(),
  account_id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ReactionLog = z.infer<typeof ReactionLogSchema>;

export const ReactionSchema = z.object({
  id: z.string(),
  emoji: z.string(),
  action: z.string(),
  tooltip: z.string(),
});

export type Reaction = z.infer<typeof ReactionSchema>;

export const ReactionsSchema = z.array(ReactionSchema);

export const ReactionTargetSchema = z.object({
  id: z.string(),
  target_name: z.string(),
});

export type ReactionTarget = z.infer<typeof ReactionTargetSchema>;

export const ReactionsTargetSchema = z.array(ReactionTargetSchema);
