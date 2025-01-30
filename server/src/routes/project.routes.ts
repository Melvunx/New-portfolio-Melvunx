import {
  adminAuthentication,
  userAuthentication,
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

router.get("/:projectId", getProjectId);

// Post projects
router.post(
  "/new-project",
  userAuthentication,
  adminAuthentication,
  createNewProject
);

// Patch projects
router.patch(
  "/:projectId",
  userAuthentication,
  adminAuthentication,
  updateProject
);

// Delete projects
router.delete(
  "/:projectId",
  userAuthentication,
  adminAuthentication,
  deleteProject
);

router.delete(
  "/many",
  userAuthentication,
  adminAuthentication,
  deleteManyProject
);

module.exports = router;
