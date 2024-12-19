import { getReactions } from "@controller/reaction.controller";
import { Router } from "express";
const router = Router();

router.get("/panels", getReactions);

module.exports = router;
