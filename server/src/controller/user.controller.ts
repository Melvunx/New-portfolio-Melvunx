import {
  handleSuccess,
  loggedHandleSuccess,
} from "@/utils/handleMessageSuccess";
import pool from "@config/database";
import { Account } from "@schema/account.schema";
import { handleError } from "@utils/handleMessageError";
import { RequestHandler } from "express";
import { RowDataPacket } from "mysql2";

const { SELECT_USER_ID } = process.env;

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
  } else if (!SELECT_USER_ID) {
    res.status(400).send(handleError("Sql request not defined"));
    return;
  }

  const [userProfile] = await pool.query<RowDataPacket[] & Account[]>(
    SELECT_USER_ID,
    [user.id]
  );

  loggedHandleSuccess("Display user's profile", userProfile);
  res.status(200).json(handleSuccess("User profile", userProfile));
};
