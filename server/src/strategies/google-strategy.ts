import { checkAffectedRow } from "@/services/handleAffectedRows.services";
import { updateDateTime } from "@/services/handleDateTime.services";
import pool from "@config/database";
import { Account, GoogleProfile } from "@schema/account.schema";
import colors from "@schema/colors.schema";
import { Generator } from "@services/generator.services";
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
  USER_ID,
} = process.env;

passport.use(
  "google",
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

        if (!CHECK_GOOGLE_EMAIL || !CREATE_NEW_ACCOUNT || !USER_ID)
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

        console.log("Email checking...");

        const [googleAccount] = await pool.query<RowDataPacket[] & Account>(
          CHECK_GOOGLE_EMAIL,
          [email]
        );

        if (googleAccount.length > 0) {
          console.log(`Account found ! Hello ${googleAccount[0].username} !`);
          await updateDateTime("account", googleAccount[0].id, "lastlogin");
          return done(null, googleAccount[0]);
        }

        console.log("Email not found... Creation new account...");

        const generator = new Generator(14);
        const accountId = generator.generateIds();
        const password = generator.generatePassword();
        const hashedPassword = generator.generateHasshedPassword(password);

        const [newGoogleAccount] = await pool.query<
          RowDataPacket[] & OkPacketParams & Account
        >(CREATE_NEW_ACCOUNT, [
          accountId,
          `user_${id}`,
          email,
          hashedPassword,
          given_name,
          family_name,
          USER_ID,
        ]);

        checkAffectedRow(newGoogleAccount);

        console.log(colors.info(`New User created! Welcome ${given_name}`));
        await updateDateTime("account", accountId, "lastlogin");

        return done(null, {
          id: accountId,
          username: `user_${id}`,
          email,
          name: given_name,
          lastname: family_name,
        });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
