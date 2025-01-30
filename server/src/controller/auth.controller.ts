import { prisma } from "@/config/prisma";
import colors from "@/schema/colors.schema";
import apiReponse from "@/services/apiResponse";
import generator from "@/services/generator.services";
import { Account } from "@prisma/client";

import "@strategies/google-strategy";
import "@strategies/local-strategy";
import { RequestHandler } from "express";
import passport from "passport";

const {
  ADMIN_USERNAME,
  ADMIN_EMAIL,
  ADMIN_USERNAME_BACKUP,
  ADMIN_EMAIL_BACKUP,
  SUB_MANAGER_USERNAME,
  SUB_MANAGER_EMAIL,
  USER_ID,
  MODERATOR_ID,
  ADMIN_ID,
} = process.env;

export const register: RequestHandler<{}, {}, Account> = async (req, res) => {
  try {
    const { username, email, password, name, lastname } = req.body;

    if (
      !ADMIN_USERNAME ||
      !ADMIN_EMAIL ||
      !ADMIN_USERNAME_BACKUP ||
      !ADMIN_EMAIL_BACKUP ||
      !SUB_MANAGER_USERNAME ||
      !SUB_MANAGER_EMAIL ||
      !USER_ID ||
      !MODERATOR_ID ||
      !ADMIN_ID
    )
      return apiReponse.error(
        res,
        "Not Found",
        new Error(".env values not found")
      );

    if (!username || !email || !password || !name || !lastname)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Missing credential")
      );

    let existAccount: Account | null = null;

    console.log(colors.info("Checking if email is available..."));
    existAccount = await prisma.account.findUnique({
      where: { email },
    });

    if (existAccount) {
      console.log(colors.error("Email unavailable !"));
      apiReponse.error(
        res,
        "Internal Server Error",
        new Error("Email already exists")
      );
      return;
    }

    console.log(
      colors.info(
        "Email is availaible ! \n Checking if username is available..."
      )
    );
    existAccount = await prisma.account.findUnique({
      where: { username },
    });

    if (existAccount) {
      console.log(colors.error("Username unavailable !"));
      return apiReponse.error(
        res,
        "Internal Server Error",
        new Error("Username already exists")
      );
    }

    console.log(colors.success("Email and Username available !"));

    const hashedPassword = await generator.generateHashedPassword(password);

    let role: string;
    if (
      (username === ADMIN_USERNAME && email === ADMIN_EMAIL) ||
      (username === ADMIN_USERNAME_BACKUP && email === ADMIN_EMAIL_BACKUP)
    )
      role = ADMIN_ID;
    else if (username === SUB_MANAGER_USERNAME && email === SUB_MANAGER_EMAIL)
      role = MODERATOR_ID;
    else role = USER_ID;

    const account = await prisma.account.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name,
        lastname,
        roleId: role,
      },
    });

    console.log(colors.success("Account created !"));

    return apiReponse.success(res, "Created", account);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
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
      if (error)
        return apiReponse.error(res, "Internal Server Error", info.error);

      if (!user) return apiReponse.error(res, "Unauthorized", info.error);

      req.logIn(user, (loginErr) => {
        if (loginErr)
          return apiReponse.error(res, "Internal Server Error", loginErr);

        res.cookie("userCookie", user, { maxAge: 360000 });

        return apiReponse.success(res, "Ok", user);
      });
    }
  )(req, res, next);
};

export const passportLogout: RequestHandler = (req, res) => {
  req.logout((error) => {
    const user: Account = req.cookies.userCookie;
    if (error) return apiReponse.error(res, "Internal Server Error", error);
    else if (!user)
      return apiReponse.error(
        res,
        "Unauthorized",
        new Error("Unauthorized access")
      );

    req.session.destroy((sessionError) => {
      if (sessionError)
        return apiReponse.error(res, "Internal Server Error", sessionError);

      res.clearCookie("userCookie");
      console.log(
        colors.info(`User ${user.username} logged out successfully !`)
      );

      return apiReponse.success(
        res,
        "Ok",
        null,
        `User ${user.username} logged out successfully`
      );
    });
  });
};

export const userController: RequestHandler = async (req, res) => {
  try {
    const user: Account | undefined = req.cookies.userCookie;
    if (!user) {
      apiReponse.error(
        res,
        "Unauthorized",
        new Error("User not found or session expired")
      );
      return;
    }

    const accounts = await prisma.account.findMany({
      include: {
        reactions: true,
        letters: true,
      },
    });

    apiReponse.success(res, "Ok", accounts);
  } catch (error) {
    apiReponse.error(res, "Internal Server Error", error);
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
      if (error)
        return apiReponse.error(res, "Internal Server Error", info.error);

      if (!user) return apiReponse.error(res, "Unauthorized", info.error);

      req.logIn(user, (loginErr) => {
        if (loginErr)
          return apiReponse.error(res, "Internal Server Error", loginErr);

        res.cookie("userCookie", user, { maxAge: 360000 });

        return apiReponse.success(res, "Ok", user);
      });
    }
  )(req, res, next);
};
