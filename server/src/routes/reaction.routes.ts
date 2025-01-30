import {
  createNewReaction,
  deleteManyReactions,
  deleteReaction,
  getReactionId,
  getReactions,
  updateReaction,
} from "@controller/reaction.controller";
import {
  adminAuthentication,
  userAuthentication,
} from "@middleware/auth.middleware";
import { Router } from "express";
const router = Router();

// Get
router.get("/panels", getReactions);
router.get("/panels/:reactionId", getReactionId);

// Post
router.post(
  "/new-reaction",
  userAuthentication,
  adminAuthentication,
  createNewReaction
);

// Modify a reaction
router.patch(
  "/:reactionId",
  userAuthentication,
  adminAuthentication,
  updateReaction
);

// Delete
router.delete(
  "/:reactionId",
  userAuthentication,
  adminAuthentication,
  deleteReaction
);

router.delete(
  "/:reactionId",
  userAuthentication,
  adminAuthentication,
  deleteManyReactions
);

module.exports = router;
