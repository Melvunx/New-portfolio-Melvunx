import { Router } from "express";
const router = Router();

router.post("/register");

router.post("/login");

router.post("/logout");

router.get("/user");

module.exports = router;
