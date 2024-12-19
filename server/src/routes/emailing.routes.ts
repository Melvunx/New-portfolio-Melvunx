import { getAllSenders, postEmail } from "@controller/emailing.controller";
import {
  adminAuthentification,
  userAuthentification,
} from "@middleware/auth.middleware";
import { Router } from "express";
const router = Router();

// Get all messages
router.get(
  "/senders",
  userAuthentification,
  adminAuthentification,
  getAllSenders
);

// Post messages
router.post("/new-email", postEmail);

module.exports = router;
