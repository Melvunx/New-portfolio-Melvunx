import { getUser } from "@controller/user.controller";
import { Router } from "express";
const router = Router();

router.get("/profile", getUser);

module.exports = router;
