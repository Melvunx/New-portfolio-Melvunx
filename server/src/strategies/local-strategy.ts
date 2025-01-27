import { prisma } from "@/config/prisma";
import colors from "@/schema/colors.schema";
import { handleResponseError } from "@/utils/handleResponse";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  "local",
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.account.findUnique({ where: { username } });

      if (!user)
        return done(handleResponseError(new Error("User not found")), false);

      console.log(colors.info("User verification..."));

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword)
        return done(handleResponseError(new Error("Invalid password")), false);

      console.log(colors.info(`User ${user.name} is authentificated !`));

      return done(null, user);
    } catch (error) {
      done(handleResponseError(error), false);
    }
  })
);
