import {
  moderatorAuthentification,
  userAuthentification,
} from "@/middleware/auth.middleware";
import { createNewReaction, deleteReaction, getReactionId, getReactions, updateReaction } from "@controller/reaction.controller";
import { Router } from "express";
const router = Router();

// Get
router.get("/panels", getReactions);
router.get("/panels/:id", getReactionId);

// Post
router.post(
  "/new-reaction",
  userAuthentification,
  moderatorAuthentification,
  createNewReaction
);

// Patch
router.patch(
  "/:id",
  userAuthentification,
  moderatorAuthentification,
  updateReaction
);

// Delete
router.delete(
  "/:id",
  userAuthentification,
  moderatorAuthentification,
  deleteReaction
);

module.exports = router;
