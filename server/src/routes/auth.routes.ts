import {
  accountRegister,
  adminUserController,
  passportLogin,
  passportLogout,
} from "@controller/auth.controller";
import {
  adminAuthentification,
  userAuthentification,
} from "@middleware/auth.middleware";
import { Router } from "express";
const router = Router();

router.post("/register", accountRegister);

router.post("/login", passportLogin);

router.get("/google", googleLogin);

router.get("/google/callback");

router.post("/logout", passportLogout);

router.get(
  "/user",
  userAuthentification,
  adminAuthentification,
  adminUserController
);

module.exports = router;
