import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  // console.log(colors.info("test"));

  res.send("Hello about");
});

module.exports = router;