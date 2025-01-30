import { getAllLetters, postEmail } from "@/controller/email.controller";
import {
  moderatorAuthentication,
  userAuthentication,
} from "@middleware/auth.middleware";
import { Router } from "express";
const router = Router();

// Get all messages
router.get(
  "/senders",
  userAuthentication,
  moderatorAuthentication,
  getAllLetters
);

// Post messages
router.post("/new-email", postEmail);

module.exports = router;
