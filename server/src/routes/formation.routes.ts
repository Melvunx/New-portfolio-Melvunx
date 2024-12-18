import {
  getFormationId,
  getFormations,
} from "@controller/formation.controller";
import { Router } from "express";
const router = Router();

router.get("/", getFormations);
router.get("/:id", getFormationId);

module.exports = router;
