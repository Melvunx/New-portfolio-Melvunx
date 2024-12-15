import colors from "@/schema/colors.schema";
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  console.log(colors.error("test"));

  res.send("Hello about");
});

module.exports = router;
