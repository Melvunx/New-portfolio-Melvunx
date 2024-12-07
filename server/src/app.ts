import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import pool from "./config/database";
// import passport from "./strategies/local-strategiy";
const bodyParser = require("body-parser");
const colors = require("@colors/colors");
const cors = require("cors");
const app = express();

require("dotenv").config();
const { PORT, SECRET_SESSION } = process.env;
const oneHour = 60 * 60 * 1000;

colors.setTheme({
  success: "brightGreen",
  info: "cyan",
  data: ["gray", "italic"],
  warn: "brightYellow",
  error: ["red", "bgWhite"],
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: SECRET_SESSION || "Melvunx",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: oneHour,
    },
  })
);

// app.use(passport.initialize())
// app.use(passport.session())

pool
  .query("SELECT 1")
  .then(() => {
    console.log(colors.success("Connected to database"));

    app.listen(PORT, () =>
      console.log(
        colors.info(`Server running on port http://localhost:${Number(PORT)}`)
      )
    );
  })
  .catch((error) =>
    console.log(
      colors.error({ message: `Error to connect to the database`, error })
    )
  );

app.get("/", (req, res) => {
  const { session, sessionID } = req;
  console.log(colors.info(session, sessionID));
  res.send("Hello World!");
});
