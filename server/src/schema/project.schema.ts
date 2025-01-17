import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  project_status_id: z.string(),
  target_type_id: z.string(),
  production_url: z.string().optional(),
  github_url: z.string(),
  image_url: z.string().optional(),
  video_url: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ProjectsSchema = z.array(ProjectSchema);

export const ProjectsResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    projects: ProjectsSchema,
  }),
});

export type ProjectsResponse = z.infer<typeof ProjectsResponseSchema>;

export const ProjectResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    project: ProjectSchema,
  }),
});

export const ProjectStatusSchema = z.object({
  id: z.string(),
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
  project_id: z.string(),
  technology_id: z.string(),
});

export type ProjectTechnology = z.infer<typeof ProjectTechnologySchema>;

export const TechnologySchema = z.object({
  id: z.string(),
  name: z.string(),
  category_id: z.string(),
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
  id: z.string(),
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
