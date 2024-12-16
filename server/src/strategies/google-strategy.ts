import colors from "@/schema/colors.schema";
import pool from "@config/database";
import { Account, GoogleProfile } from "@schema/account.schema";
import { handleError } from "@utils/handleMessageError";
import { OkPacketParams, RowDataPacket } from "mysql2";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  CALLBACK_URL,
  CHECK_GOOGLE_EMAIL,
  CREATE_NEW_ACCOUNT,
  UPDATE_LASTLOGIN,
} = process.env;

passport.use("google",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID || "",
      clientSecret: GOOGLE_CLIENT_SECRET || "",
      callbackURL: CALLBACK_URL || "",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile: GoogleProfile, done) => {
      try {
        const { id, email, given_name, family_name, email_verified, verified } =
          profile;

        if (!CHECK_GOOGLE_EMAIL || !CREATE_NEW_ACCOUNT || !UPDATE_LASTLOGIN)
          return done(handleError(new Error("Sql request not defined")), null);

        if (!email)
          return done(handleError(new Error("Email is not found")), null);

        if (!email_verified || !verified)
          return done(
            handleError(
              new Error("Email not verified"),
              "You need to have a verified email !"
            ),
            null
          );

        const ExistingGoogleAccount = await pool.query<
          RowDataPacket[] & Account[]
        >(CHECK_GOOGLE_EMAIL, [email]);

        if (ExistingGoogleAccount.length > 0)
          return done(null, ExistingGoogleAccount[0]);

        const newGoogleAccount = await pool.query<
          RowDataPacket[] & OkPacketParams & Account
        >(CREATE_NEW_ACCOUNT, [
          `user_${id}`,
          email,
          "NULL",
          given_name,
          family_name,
          1,
        ]);

        const newUserId = newGoogleAccount[0].insertId;

        await pool.query(UPDATE_LASTLOGIN, [newUserId]);

        console.log(
          colors.info(`User ${newGoogleAccount[0].name} is authentificated !`)
        );
        return done(null, {
          id: newUserId,
          username: `user_${id}`,
          name: given_name,
          lastname: family_name,
          email,
        });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
