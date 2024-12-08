import colors from "@models/colors.models";
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  console.log(colors.error("test"));

  res.send("Hello about");
});

module.exports = router;
