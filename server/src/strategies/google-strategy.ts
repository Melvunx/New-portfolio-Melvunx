import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
}, () => {}));
