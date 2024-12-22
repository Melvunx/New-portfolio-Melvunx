import { getAllReactionLog, getUserReactionLog } from "@controller/reactionLog.controller";
import { getUserProfile } from "@controller/user.controller";
import {
  adminAuthentification,
  userAuthentification,
} from "@middleware/auth.middleware";
import { Router } from "express";
const router = Router();

// User only
router.get("/profile", userAuthentification, getUserProfile);
router.get("/reation-log/:id", userAuthentification, getUserReactionLog);

// Admin panel
router.get("/reaction-log/an/panels", userAuthentification, adminAuthentification, getAllReactionLog);

module.exports = router;
