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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${Number(PORT)}`);
});

app.get("/", (req, res) => {
  const { session, sessionID } = req;
  console.log(session, sessionID);
  res.send("Hello World!");
});
