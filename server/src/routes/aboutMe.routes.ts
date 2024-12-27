import { createNewInfoAboutMe, deleteAboutMe, editAboutMe, getInfoAboutMe } from "@controller/aboutMe.controller";
import {
  adminAuthentification,
  userAuthentification,
} from "@middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.get(
  "/info",
  userAuthentification,
  adminAuthentification,
  getInfoAboutMe
);

router.post(
  "/new-info",
  userAuthentification,
  adminAuthentification,
  createNewInfoAboutMe
);

router.patch("/info/:id", userAuthentification, adminAuthentification, editAboutMe);

router.delete("/info/:id", userAuthentification, adminAuthentification, deleteAboutMe);

module.exports = router;
