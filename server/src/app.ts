import express from "express";
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

require("dotenv").config();
const { PORT } = process.env;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${Number(PORT)}`);
});
