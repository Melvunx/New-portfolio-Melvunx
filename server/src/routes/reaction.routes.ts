import {
  createNewReaction,
  deleteReaction,
  getReactionId,
  getReactions,
  updateReaction,
} from "@controller/reaction.controller";
import {
  adminAuthentification,
  userAuthentification,
} from "@middleware/auth.middleware";
import { Router } from "express";
const router = Router();

// Get
router.get("/panels", getReactions);
router.get("/panels/:id", getReactionId);

// Post
router.post(
  "/new-reaction",
  userAuthentification,
  adminAuthentification,
  createNewReaction
);

// Modify a reaction
router.patch(
  "/:id",
  userAuthentification,
  adminAuthentification,
  updateReaction
);

// Delete
router.delete(
  "/:id",
  userAuthentification,
  adminAuthentification,
  deleteReaction
);

module.exports = router;
