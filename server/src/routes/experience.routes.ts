import {
  createNewExperience,
  deleteExperience,
  getExperienceId,
  getExperiences,
  updateExperience,
} from "@controller/experience.controller";
import {
  adminAuthentification,
  userAuthentification,
} from "@middleware/auth.middleware";
import { Router } from "express";
const router = Router();

// Get
router.get("/", getExperiences);
router.get("/:id", getExperienceId);

// Post
router.post(
  "/an/new-exp",
  userAuthentification,
  adminAuthentification,
  createNewExperience
);

// Patch
router.patch(
  "/an/exp?expid=:exp_id&addid=:add_id",
  userAuthentification,
  adminAuthentification,
  updateExperience
);

// Delete
router.delete(
  "/an/exp?expid=:exp_id&addid=:add_id",
  userAuthentification,
  adminAuthentification,
  deleteExperience
);

module.exports = router;
