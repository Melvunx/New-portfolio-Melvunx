import {
  createNewFormation,
  deleteFormation,
  getFormationId,
  getFormations,
  updateFormation,
} from "@controller/formation.controller";
import {
  adminAuthentification,
  userAuthentification,
} from "@middleware/auth.middleware";
import { Router } from "express";
const router = Router();

// Get
router.get("/", getFormations);
router.get("/:id", getFormationId);

// Post
router.post(
  "/an/new-formation",
  userAuthentification,
  adminAuthentification,
  createNewFormation
);

// Patch
router.patch("/", userAuthentification, adminAuthentification, updateFormation);

// Delete
router.delete(
  "/",
  userAuthentification,
  adminAuthentification,
  deleteFormation
);

module.exports = router;
