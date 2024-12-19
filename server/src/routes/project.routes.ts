import {
  adminAuthentification,
  userAuthentification,
} from "@/middleware/auth.middleware";
import {
  createNewProject,
  deleteProject,
  getProjectId,
  getProjects,
  updateProject,
} from "@controller/project.controller";
import { Router } from "express";
const router = Router();

// Get projects
router.get("/", getProjects);
router.get("/:id", getProjectId);

// Post projects
router.post(
  "/an/new-project",
  userAuthentification,
  adminAuthentification,
  createNewProject
);

// Patch projects
router.patch(
  "/an/:id",
  userAuthentification,
  adminAuthentification,
  updateProject
);

// Delete projects
router.delete(
  "/an/:id",
  userAuthentification,
  adminAuthentification,
  deleteProject
);

module.exports = router;
