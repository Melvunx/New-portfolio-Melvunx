import {
  emailVerification,
  googleLogin,
  passportLogin,
  passportLogout,
  register,
  resetPassword,
  userController,
} from "@controller/auth.controller";
import {
  moderatorAuthentication,
  userAuthentication,
} from "@middleware/auth.middleware";
import { Router } from "express";
import passport from "passport";
const router = Router();

router.post("/register", register);

router.get("/verify-email", emailVerification);

router.post("/login", passportLogin);

router.post("/reset-password", resetPassword)

router.get("/google", passport.authenticate("google"));

router.get("/google/callback", googleLogin);

router.post("/logout", passportLogout);

router.get(
  "/user",
  userAuthentication,
  moderatorAuthentication,
  userController
);

module.exports = router;
