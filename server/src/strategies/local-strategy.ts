import { Account } from "@/schema/account.schema";
import colors from "@/schema/colors.schema";
import { updateDateTime } from "@/services/handleDateTime.services";
import pool from "@config/database";
import { handleError, loggedHandleError } from "@utils/handleMessageError";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const { CHECK_LOGIN } = process.env;

passport.use(
  "local",
  new LocalStrategy(async (username, password, done) => {
    if (!CHECK_LOGIN)
      return done(null, false, handleError("Sql request is not defined"));

    try {
      const [user] = await pool.query<RowDataPacket[] & Account[]>(
        CHECK_LOGIN,
        [username]
      );

      if (user[0].length === 0) {
        return done(
          null,
          false,
          handleError("User not found or invalid username")
        );
      }
      console.log(colors.info("User verification..."));

      const isValidPassword = await bcrypt.compare(password, user[0].password);
      if (!isValidPassword)
        return done(null, false, handleError("Invalid password"));

      await updateDateTime("account", user[0].id, "lastlogin");

      console.log(colors.info(`User ${user[0].name} is authentificated !`));

      return done(null, user[0]);
    } catch (error) {
      loggedHandleError(error);
      done(error, false);
    }
  })
);
