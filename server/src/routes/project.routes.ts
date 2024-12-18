import {
  adminAuthentification,
  userAuthentification,
} from "@/middleware/auth.middleware";
import { getProjectId, getProjects } from "@controller/project.controller";
import { Router } from "express";
const router = Router();

// Get projects
router.get("/", getProjects);
router.get("/:id", getProjectId);

// Post projects
router.post(
  "/new-project",
  userAuthentification,
  adminAuthentification,
  createNewProject
);

// Put projects
router.put(
  "/:id",
  userAuthentification,
  adminAuthentification,
  projectModifier
);

// Delete projects
router.delete(
  "/:id",
  userAuthentification,
  adminAuthentification,
  deleteProject
);

module.exports = router;
