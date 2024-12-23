import {
  getAllReactionLog,
  getUserReactionLog,
  reactToElement,
  removeReactionFromElement,
} from "@controller/reactionLog.controller";
import { getUserProfile } from "@controller/user.controller";
import {
  adminAuthentification,
  userAuthentification,
} from "@middleware/auth.middleware";
import { Router } from "express";
const router = Router();

// User only
router.get("/profile", userAuthentification, getUserProfile);
router.get("/reation-log", userAuthentification, getUserReactionLog);

// Admin panel
router.get(
  "/reaction-log/an/panels",
  userAuthentification,
  adminAuthentification,
  getAllReactionLog
);

// Add a reaction
router.post("/add/reaction-log/:reaction_id/:target_id", userAuthentification, reactToElement);

// Remove a reaction
router.delete(
  "/remove/reacion-log",
  userAuthentification,
  removeReactionFromElement
);

module.exports = router;
