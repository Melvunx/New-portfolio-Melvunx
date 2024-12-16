import { Router } from "express";
const router = Router();

router.get("/", getFormations);
router.get("/:id", getFormationId);

module.exports = router;
