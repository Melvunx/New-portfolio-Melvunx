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
  "/an/:add_id/:exp_id",
  userAuthentification,
  adminAuthentification,
  updateExperience
);

// Delete
router.delete(
  "/an/:add_id/:exp_id",
  userAuthentification,
  adminAuthentification,
  deleteExperience
);

module.exports = router;
