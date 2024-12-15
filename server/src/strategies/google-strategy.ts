import { GoogleProfile } from "@schema/account.schema";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CALLBACK_URL } = process.env;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID || "",
      clientSecret: GOOGLE_CLIENT_SECRET || "",
      callbackURL: CALLBACK_URL || "",
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, profile: GoogleProfile, done) => {
      console.log(profile);
    }
  )
);

export default passport;
