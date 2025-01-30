import {
  createNewFormation,
  deleteFormation,
  getFormationId,
  getFormations,
  updateFormation,
} from "@controller/formation.controller";
import {
  adminAuthentication,
  userAuthentication,
} from "@middleware/auth.middleware";
import { Router } from "express";
const router = Router();

// Get
router.get("/", getFormations);
router.get("/:id", getFormationId);

// Post
router.post(
  "/an/new-formation",
  userAuthentication,
  adminAuthentication,
  createNewFormation
);

// Patch
router.patch(
  "/an/:add_id/form_id",
  userAuthentication,
  adminAuthentication,
  updateFormation
);

// Delete
router.delete(
  "/an/:add_id/form_id",
  userAuthentication,
  adminAuthentication,
  deleteFormation
);

module.exports = router;
