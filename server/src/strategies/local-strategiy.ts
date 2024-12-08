import colors from "@models/colors.models";
import { errorMessage } from "@utils/handleMessageError";
import passport from "passport";
import { Strategy } from "passport-google-oauth2";

passport.use(
  new Strategy(async (username, password, done) => {
    try {
    } catch (error) {
      console.log(colors.error(errorMessage(), error));
      done(null, false, { message: errorMessage(), error });
    }
  })
);
