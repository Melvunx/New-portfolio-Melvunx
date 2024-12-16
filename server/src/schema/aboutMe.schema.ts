import { z } from "zod";

export const AddressSchema = z.object({
  id: z.number(),
  city: z.string(),
  department: z.string(),
  country: z.string(),
});

export type Address = z.infer<typeof AddressSchema>;

export const AboutMeSchema = z.object({
  id: z.number(),
  address_id: z.number(),
  linkedIn_url: z.string(),
  introduction_text: z.string(),
  github_url: z.string(),
  avatar_url: z.string(),
  ongoing_formation_id: z.number(),
});

export type AboutMe = z.infer<typeof AboutMeSchema>;

export const FormationSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  level: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  reaction_target_id: z.string(),
  address_id: z.number(),
});

export type Formation = z.infer<typeof FormationSchema>;

export const OnGoingFormationSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  rythme: z.string(),
  sector: z.string(),
  duration: z.number(),
  address_id: z.number(),
});

export type OnGoingFormation = z.infer<typeof OnGoingFormationSchema>;

export const ExperienceSchema = z.object({
  id: z.number(),
  title: z.string(),
  task: z.string(),
  skills: z.string(),
  reaction_target_id: z.string(),
  address_id: z.number(),
});

export type Experience = z.infer<typeof ExperienceSchema>;
