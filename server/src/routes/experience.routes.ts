import {
  createNewExperience,
  deletedManyExperiences,
  deleteExperience,
  getExperienceId,
  getExperiences,
  updateExperience,
} from "@controller/experience.controller";
import {
  adminAuthentication,
  userAuthentication,
} from "@middleware/auth.middleware";
import { Router } from "express";
const router = Router();

// Get
router.get("/", getExperiences);

router.get("/:experienceId", getExperienceId);

// Post
router.post(
  "/new-exp",
  userAuthentication,
  adminAuthentication,
  createNewExperience
);

// Patch
router.patch(
  "/:addressId/:experienceId",
  userAuthentication,
  adminAuthentication,
  updateExperience
);

// Delete
router.delete(
  "/:add_id/:exp_id",
  userAuthentication,
  adminAuthentication,
  deleteExperience
);

router.delete(
  "/many",
  userAuthentication,
  adminAuthentication,
  deletedManyExperiences
);

module.exports = router;
