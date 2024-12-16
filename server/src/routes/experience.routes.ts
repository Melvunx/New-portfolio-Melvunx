import { Router } from "express";
const router = Router();

router.get("/", getExperiences);
router.get("/:id", getExperienceId);

module.exports = router;