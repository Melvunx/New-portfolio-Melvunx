import { userAuthentification } from "@/middleware/auth.middleware";
import { Router } from "express";
const router = Router();

router.get("/panels", getReactions);

module.exports = router;
