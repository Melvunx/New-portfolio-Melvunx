import {
  accountRegister,
  adminUserController,
  googleLogin,
  passportLogin,
  passportLogout,
} from "@controller/auth.controller";
import {
  adminAuthentification,
  userAuthentification,
} from "@middleware/auth.middleware";
import { Router } from "express";
import passport from "passport";
const router = Router();

router.post("/register", accountRegister);

router.post("/login", passportLogin);

router.get("/google", passport.authenticate("google"));

router.get("/google/callback", googleLogin);

router.post("/logout", passportLogout);

router.get(
  "/user",
  userAuthentification,
  adminAuthentification,
  adminUserController
);

module.exports = router;
