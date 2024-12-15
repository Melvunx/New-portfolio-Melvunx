import { z } from "zod";

export const AccountSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  password: z.string(),
  name: z.string(),
  lastname: z.string(),
  cretedAt: z.date(),
  lastlogin: z.date(),
  role_id: z.number(),
});

export type Account = z.infer<typeof AccountSchema>;

export const AccountsSchema = z.array(AccountSchema);

export const AccountResponseSchema = z.object({
  account: z.array(AccountSchema),
});

export const AccountsResponseSchema = z.object({
  accounts: AccountsSchema,
});

export const UserRoleSchema = z.object({
  id: z.number(),
  status: z.string(),
});

export type UserRole = z.infer<typeof UserRoleSchema>;

export const ReactionLogSchema = z.object({
  id: z.number(),
  target_type_id: z.number(),
  target_id: z.number(),
  reaction_id: z.number(),
  account_id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ReactionLog = z.infer<typeof ReactionLogSchema>;

export const ReactionSchema = z.object({
  id: z.number(),
  emoji: z.string(),
  action: z.string(),
  tooltip: z.string(),
});

export type Reaction = z.infer<typeof ReactionSchema>;

export const ReactionsSchema = z.array(ReactionSchema);

export const ReactionTargetSchema = z.object({
  id: z.number(),
  target_name: z.string(),
});

export type ReactionTarget = z.infer<typeof ReactionTargetSchema>;

export const ReactionsTargetSchema = z.array(ReactionTargetSchema);
