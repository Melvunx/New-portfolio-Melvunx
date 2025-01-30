require("dotenv").config();
import colors from "@schema/colors.schema";
import "@strategies/google-strategy";
import "@strategies/local-strategy";
import cookieParser from "cookie-parser";
import express from "express";
import * as session from "express-session";
import passport from "passport";
import { prisma } from "./config/prisma";
import { handleResponseError } from "./utils/handleResponse";
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const { PORT, SECRET_SESSION } = process.env;

if (!PORT || !SECRET_SESSION) {
  throw new Error("Ids not found");
}

const oneHour = 60 * 60 * 1000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session.default({
    secret: SECRET_SESSION,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: oneHour,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.account.findUnique({
      where: { id },
    });

    if (!user)
      return done(handleResponseError(new Error("User not found")), false);

    return done(null, user);
  } catch (error) {
    return done(handleResponseError(error), null);
  }
});

// Routes
const authRoutes = require("@routes/auth.routes");
const userRoutes = require("@routes/user.routes");
const aboutMeRoutes = require("@routes/aboutMe.routes");
const emailingRoutes = require("@routes/emailing.routes");
const experienceRoutes = require("@routes/experience.routes");
const formationRoutes = require("@routes/formation.routes");
const projectRoutes = require("@routes/project.routes");
const reactionRoutes = require("@routes/reaction.routes");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/about-me", aboutMeRoutes);
app.use("/api/emailing", emailingRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/formation", formationRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/reaction", reactionRoutes);

app.listen(PORT, () =>
  console.log(
    colors.info(`\nServer running on port http://localhost:${Number(PORT)}`)
  )
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
