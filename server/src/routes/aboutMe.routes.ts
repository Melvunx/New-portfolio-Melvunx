import { getInfoAboutMe } from "@/controller/aboutMe.controller";
import { Router } from "express";

const router = Router();

router.get("/", getInfoAboutMe);

module.exports = router;
