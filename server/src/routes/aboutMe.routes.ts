import {
  createNewInfoAboutMe,
  deleteAboutMe,
  editAboutMe,
  getInfoAboutMe,
} from "@controller/aboutMe.controller";
import {
  adminAuthentication,
  userAuthentication,
} from "@middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/info", userAuthentication, adminAuthentication, getInfoAboutMe);

router.post(
  "/new-info",
  userAuthentication,
  adminAuthentication,
  createNewInfoAboutMe
);

router.patch(
  "/info/:about_meId",
  userAuthentication,
  adminAuthentication,
  editAboutMe
);

router.delete(
  "/info/:id",
  userAuthentication,
  adminAuthentication,
  deleteAboutMe
);

module.exports = router;
