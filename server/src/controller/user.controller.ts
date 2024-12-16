import { Account } from "@/schema/account.schema";
import { handleError } from "@/utils/handleMessageError";
import { RequestHandler } from "express";

export const getUser: RequestHandler = async (req, res) => {
  const user: Account = req.cookies.userCookie;

  if (!user) {
    res
      .status(401)
      .send(
        handleError(
          "User not found or session expired",
          "You are not logged in !"
        )
      );
    return;
  }
  
};
