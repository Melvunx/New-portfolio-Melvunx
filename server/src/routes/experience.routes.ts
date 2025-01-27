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

router.get("/:experienceId", getExperienceId);

// Post
router.post(
  "/new-exp",
  userAuthentification,
  adminAuthentification,
  createNewExperience
);

// Patch
router.patch(
  "/:addressId/:experienceId",
  userAuthentification,
  adminAuthentification,
  updateExperience
);

// Delete
router.delete(
  "/:add_id/:exp_id",
  userAuthentification,
  adminAuthentification,
  deleteExperience
);

module.exports = router;
