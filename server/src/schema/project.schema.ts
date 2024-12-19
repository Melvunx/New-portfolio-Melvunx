import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  project_status_id: z.number(),
  reaction_target_id: z.string(),
  production_url: z.string().optional(),
  github_url: z.string(),
  image_url: z.string().optional(),
  video_url: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ProjectsSchema = z.array(ProjectSchema);

export const ProjectsResponseSchema = z.object({
  projects: ProjectsSchema,
});

export const ProjectResponseSchema = z.object({
  project: z.array(ProjectSchema),
});

export const ProjectStatusSchema = z.object({
  id: z.number(),
  status_name: z.string(),
});

export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

export const ProjectsStatusSchema = z.array(ProjectStatusSchema);

export const ProjectsStatusResponseSchema = z.object({
  projects_status: ProjectsStatusSchema,
});

export const ProjectStatusResponseSchema = z.object({
  project_status: z.array(ProjectStatusSchema),
});

export const ProjectTechnologySchema = z.object({
  project_id: z.number(),
  technology_id: z.number(),
});

export type ProjectTechnology = z.infer<typeof ProjectTechnologySchema>;

export const TechnologySchema = z.object({
  id: z.number(),
  name: z.string(),
  category_id: z.number(),
});

export type Technology = z.infer<typeof TechnologySchema>;

export const TechnologiesSchema = z.array(TechnologySchema);

export const TechnologiesResponseSchema = z.object({
  technologies: TechnologiesSchema,
});

export const TechnologtResponseSchema = z.object({
  technology: z.array(TechnologySchema),
});

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;

export const CategoriesSchema = z.array(CategorySchema);

export const CategoriesResponseSchema = z.object({
  categories: CategoriesSchema,
});

export const CategoryResponseSchema = z.object({
  category: z.array(CategorySchema),
});
