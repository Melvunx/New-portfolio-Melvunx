import pool from "@config/database";
import { Account } from "@schema/account.schema";
import colors from "@schema/colors.schema";
import { Generator } from "@services/generator.services";
import { checkAffectedRow } from "@services/handleAffectedRows.services";
import "@strategies/google-strategy";
import "@strategies/local-strategy";
import { handleError, loggedHandleError } from "@utils/handleMessageError";
import {
  handleSuccess,
  loggedHandleSuccess,
} from "@utils/handleMessageSuccess";
import { RequestHandler } from "express";
import { OkPacketParams, RowDataPacket } from "mysql2";
import passport from "passport";

const {
  CREATE_NEW_ACCOUNT,
  CHECK_USERNAME,
  CHECK_EMAIL,
  SALT_ROUNDS,
  ADMIN_USERNAME,
  ADMIN_USERNAME_BACKUP,
  ADMIN_EMAIL,
  ADMIN_EMAIL_BACKUP,
  SUB_MANAGER_USERNAME,
  SUB_MANAGER_EMAIL,
  SELECT_ALL_USERS,
  CREATE_REACTION_LOG,
  USER_ID,
  MODERATOR_ID,
  ADMIN_ID,
} = process.env;

export const accountRegister: RequestHandler<{}, {}, Account> = async (
  req,
  res
) => {
  try {
    const { username, email, password, name, lastname } = req.body;

    if (
      !CREATE_NEW_ACCOUNT ||
      !CHECK_USERNAME ||
      !CHECK_EMAIL ||
      !CREATE_REACTION_LOG ||
      !USER_ID ||
      !MODERATOR_ID ||
      !ADMIN_ID
    ) {
      res.status(500).send(handleError("Sql request not defined"));
      return;
    } else if (!username || !email || !password || !name || !lastname) {
      res.status(400).send(handleError("Missing fields"));
      return;
    }

    const [checkUsername] = await pool.query<RowDataPacket[]>(CHECK_USERNAME, [
      username,
    ]);

    const [checkEmail] = await pool.query<RowDataPacket[]>(CHECK_EMAIL, [
      email,
    ]);

    if (checkUsername.length > 0 || checkEmail.length > 0) {
      res.status(401).send({
        error: handleError(
          "Username or Email already used",
          "Username or Email field"
        ),
        data: { username: checkUsername, email: checkEmail },
      });
      return;
    }

    let role: string;
    if (
      (username === ADMIN_USERNAME && email === ADMIN_EMAIL) ||
      (username === ADMIN_USERNAME_BACKUP && email === ADMIN_EMAIL_BACKUP) ||
      (username === SUB_MANAGER_USERNAME && email === SUB_MANAGER_EMAIL)
    )
      role = ADMIN_ID;
    else role = USER_ID;

    const generator = new Generator(14);
    const userId = generator.generateIds();
    const userReactionLogId = generator.generateIds();
    const hashedPassword = await generator.generateHasshedPassword(password);

    const [newAccount] = await pool.query<RowDataPacket[] & OkPacketParams>(
      CREATE_NEW_ACCOUNT,
      [userId, username, email, hashedPassword, name, lastname, role]
    );

    checkAffectedRow(newAccount);

    const [userReactionLog] = await pool.query<
      RowDataPacket[] & OkPacketParams
    >(CREATE_REACTION_LOG, [userReactionLogId, userId]);

    checkAffectedRow(userReactionLog);

    loggedHandleSuccess("new Account created", {
      id: userId,
      username,
      email,
      password: hashedPassword,
      name,
      lastname,
      role_id: role,
    });

    res.status(201).json(
      handleSuccess("New  Account created", {
        new_account: {
          id: userId,
          username,
          email,
          password: hashedPassword,
          name,
          lastname,
          role_id: role,
        },
        user_reaction_log: { id: userReactionLogId, account_id: userId },
      })
    );
  } catch (error) {
    loggedHandleError(error);
    res.status(500).send(handleError(error));
  }
};

export const passportLogin: RequestHandler = (req, res, next) => {
  passport.authenticate(
    "local",
    (
      error: string,
      user: Account,
      info: { success: boolean; message: string; error: any }
    ) => {
      if (error) return res.status(500).send(info);
      if (!user) return res.status(401).send(info);

      // loggedHandleSuccess("Verification user...");
      req.logIn(user, (loginErr) => {
        if (loginErr)
          return res.status(500).send(handleError(loginErr, "Error on login"));

        // loggedHandleSuccess(`User ${user.username} logged in !`);
        res.cookie("userCookie", user, { maxAge: 360000 });

        return res.status(200).json(handleSuccess("Loggin successful", user));
      });
    }
  )(req, res, next);
};

export const passportLogout: RequestHandler = (req, res) => {
  req.logout((error) => {
    const user: Account = req.cookies.userCookie;
    if (error) return res.status(500).send(handleError(error, "Logout failed"));
    else if (!user)
      return res
        .status(401)
        .send(handleError("User not found or session expired"));

    req.session.destroy((sessionError) => {
      if (sessionError)
        return res.status(500).send(handleError(sessionError, "Logout failed"));

      res.clearCookie("userCookie");
      console.log(
        colors.info(`User ${user.username} logged out successfully !`)
      );

      return res
        .status(200)
        .send(handleSuccess(`User ${user.username} logged out successfully`));
    });
  });
};

export const userController: RequestHandler = async (req, res) => {
  const user: Account = req.cookies.userCookie;

  if (!SELECT_ALL_USERS) {
    res.status(500).send(handleError("Sql request not defined"));
    return;
  } else if (!user) {
    res.status(401).send(handleError("User not found or session expired"));
    return;
  }

  try {
    const [users] = await pool.query(SELECT_ALL_USERS);

    loggedHandleSuccess("All user", users);
    res.status(200).json(handleSuccess("All user", users));
  } catch (error) {
    res.status(500).send(handleError(error, "Failed to fetch users"));
    return;
  }
};

export const googleLogin: RequestHandler = (req, res, next) => {
  passport.authenticate(
    "google",
    (
      error: any,
      user: Account,
      info: { success: boolean; message: string; error: any }
    ) => {
      if (error) return res.status(500).send(info);
      if (!user) return res.status(401).send(info);

      req.logIn(user, (loginErr) => {
        if (loginErr)
          return res.status(500).send(handleError(loginErr, "Error on login"));

        res.cookie("userCookie", user, { maxAge: 360000 });

        return res.status(200).json(handleSuccess("Loggin successful", user));
      });
    }
  )(req, res, next);
};
