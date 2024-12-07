import pool from "@config/database";
import colors from "@models/colors.models";
import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
// import passport from "./strategies/local-strategiy";
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

require("dotenv").config();
const { PORT, SECRET_SESSION } = process.env;
const oneHour = 60 * 60 * 1000;

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

// Routes
const authRoutes = require("@routes/auth.routes");
const aboutMeRoutes = require("@routes/aboutMe.routes");
const emailingRoutes = require("@routes/emailing.routes");
const experienceRoutes = require("@routes/experience.routes");
const formationRoutes = require("@routes/formation.routes");
const projectRoutes = require("@routes/project.routes");
const reactionRoutes = require("@routes/reaction.routes");

app.use("/api/auth", authRoutes);
app.use("/api/about-me", aboutMeRoutes);
app.use("/api/emailing", emailingRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/formation", formationRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/reacion", reactionRoutes);

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
      colors.error({ message: "Error to connect to the database", error })
    )
  );

app.get("/", (req, res) => {
  const { session, sessionID } = req;
  console.log(colors.info(session, sessionID));
  res.send("Hello World!");
});
