import { Router } from "express";
const router = Router();

router.get("/profile", getUser);

export default router;
