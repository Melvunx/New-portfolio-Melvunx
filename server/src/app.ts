require("dotenv").config();
import pool from "@config/database";
import { Account } from "@schema/account.schema";
import colors from "@schema/colors.schema";
import "@strategies/google-strategy";
import "@strategies/local-strategy";
import cookieParser from "cookie-parser";
import express from "express";
import MySQLStoreFactory from "express-mysql-session";
import * as session from "express-session";
import { RowDataPacket } from "mysql2";
import passport from "passport";
import { handleError, loggedHandleError } from "./utils/handleMessageError";
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const {
  PORT,
  SECRET_SESSION,
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;
const oneHour = 60 * 60 * 1000;

const { SELECT_USER_ID } = process.env;

const MySQLStore = MySQLStoreFactory(session);

const sessionStore = new MySQLStore({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  schema: {
    tableName: "sessions",
    columnNames: {
      session_id: "session_id",
      expires: "expires_date",
      data: "session_data",
    },
  },
});

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
    secret: SECRET_SESSION || "Melvunx",
    saveUninitialized: false,
    resave: false,
    store: sessionStore,
    cookie: {
      maxAge: oneHour,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id: number, done) => {
  if (!SELECT_USER_ID)
    return done(handleError(new Error("Sql request not defined")), false);
  try {
    const [user] = await pool.query<RowDataPacket[] & Account[]>(
      SELECT_USER_ID,
      [id]
    );
    if (user.length === 0)
      return done(
        handleError(new Error("User not found"), "DeserializeUser error")
      );
    return done(null, user[0]);
  } catch (error) {
    loggedHandleError(error);
    return done(error, null);
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
  res.send("Hello World!");
});
