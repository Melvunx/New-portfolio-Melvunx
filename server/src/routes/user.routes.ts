import {
  getAllReactionLog,
  getUserReactionLog,
  reactToElement,
  removeReactionFromElement,
} from "@controller/reactionLog.controller";
import { getUserProfile } from "@controller/user.controller";
import {
  adminAuthentication,
  userAuthentication,
} from "@middleware/auth.middleware";
import { Router } from "express";
const router = Router();

// User only
router.get("/profile", userAuthentication, getUserProfile);
router.get("/reaction-log", userAuthentication, getUserReactionLog);

// Add a reaction
router.post(
  "/add/reaction-log/:reactionId/:targetId",
  userAuthentication,
  reactToElement
);

// Remove a reaction
router.delete(
  "/remove/reaction-log/:reactionLogId",
  userAuthentication,
  removeReactionFromElement
);

// Admin panel
router.get(
  "/reaction-log/panels",
  userAuthentication,
  adminAuthentication,
  getAllReactionLog
);

module.exports = router;
