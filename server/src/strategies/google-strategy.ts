import { prisma } from "@/config/prisma";
import { GoogleProfile } from "@/schema/googleProfile.schema";
import generator from "@/services/generator.services";
import { handleResponseError } from "@/utils/handleResponse";
import { Account } from "@prisma/client";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CALLBACK_URL, USER_ID } =
  process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !CALLBACK_URL) {
  throw new Error("Google and callback url is not set");
}

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile: GoogleProfile, done) => {
      try {
        const { id, email, given_name, family_name, email_verified, verified } =
          profile;

        if (!USER_ID)
          return done(handleResponseError(new Error(".env not found")), null);

        if (!email)
          return done(
            handleResponseError(new Error("Email is not found")),
            null
          );

        if (!email_verified || !verified)
          return done(
            handleResponseError(
              new Error("Email not verified"),
              "You need to have a verified email !"
            ),
            null
          );

        console.log("Email checking...");

        let googleAccount: Account | null = null;

        googleAccount = await prisma.account.findUnique({
          where: {
            email,
          },
        });

        if (googleAccount) {
          console.log(`Account found ! Hello ${googleAccount.username} !`);

          if (googleAccount.verified === false) {
            await prisma.account.update({
              where: {
                id: googleAccount.id,
              },
              data: {
                verified: true,
              },
            });
          }
          return done(null, googleAccount);
        }

        console.log("Email not found... Creation new account...");

        const password = generator.generatePassword();
        const hashedPassword = await generator.generateHashedPassword(password);

        const account = await prisma.account.create({
          data: {
            username: `user_${id}`,
            email,
            password: hashedPassword,
            verified: true,
            name: given_name,
            lastname: family_name,
            lastLogin: new Date(),
            roleId: USER_ID,
          },
        });

        return done(null, account);
      } catch (error) {
        return done(handleResponseError(error), null);
      }
    }
  )
);
