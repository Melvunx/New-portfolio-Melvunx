import { getUserProfile } from "@controller/user.controller";
import { Router } from "express";
const router = Router();

router.get("/profile", getUserProfile);

module.exports = router;
