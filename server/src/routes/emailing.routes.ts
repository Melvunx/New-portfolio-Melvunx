import { postEmail } from "@/controller/email.controller";
import {
  moderatorAuthentification,
  userAuthentification,
} from "@middleware/auth.middleware";
import { Router } from "express";
const router = Router();

// Get all messages
router.get("/senders", userAuthentification, moderatorAuthentification);

// Post messages
router.post("/new-email", postEmail);

module.exports = router;
