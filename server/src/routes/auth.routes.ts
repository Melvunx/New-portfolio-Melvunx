import {
  googleLogin,
  passportLogin,
  passportLogout,
  register,
  userController,
} from "@controller/auth.controller";
import {
  moderatorAuthentification,
  userAuthentification,
} from "@middleware/auth.middleware";
import { Router } from "express";
import passport from "passport";
const router = Router();

router.post("/register", register);

router.post("/login", passportLogin);

router.get("/google", passport.authenticate("google"));

router.get("/google/callback", googleLogin);

router.post("/logout", passportLogout);

router.get(
  "/user",
  userAuthentification,
  moderatorAuthentification,
  userController
);

module.exports = router;
