import colors from "@/schema/colors.schema";
import apiReponse from "@/services/apiResponse";
import { Account } from "@prisma/client";
import { RequestHandler } from "express";

const { MODERATOR_ID, ADMIN_ID } = process.env;

if (!MODERATOR_ID || !ADMIN_ID) {
  throw new Error("MODERATOR_ID or ADMIN_ID is not set");
}

const checkAuthentication: RequestHandler = (req, res, next) => {
  const user: Account = req.cookies.userCookie;

  if (!user)
    return apiReponse.error(res, "Not Found", new Error("User not found"));
  else if (!req.isAuthenticated())
    return apiReponse.error(
      res,
      "Unauthorized",
      new Error("You are not authorized")
    );

  console.log(colors.info(`User ${user.username} is authenticated`));
  next();
};

const roleBasedAuthentication = (allowedRoles: string[]): RequestHandler => {
  return (req, res, next) => {
    const user: Account = req.cookies.userCookie;

    if (!user) {
      apiReponse.error(res, "Not Found", new Error("User not found"));
      return;
    } else if (!allowedRoles.includes(user.roleId))
      return apiReponse.error(
        res,
        "Unauthorized",
        new Error("You aren't authorized")
      );

    console.log(colors.info(`${user.username} is authenticated!`));
    next();
  };
};

export const userAuthentication = checkAuthentication;

export const moderatorAuthentication = roleBasedAuthentication([
  MODERATOR_ID,
  ADMIN_ID,
]);

export const adminAuthentication = roleBasedAuthentication([ADMIN_ID]);
