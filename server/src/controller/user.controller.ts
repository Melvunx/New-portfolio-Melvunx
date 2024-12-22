import pool from "@config/database";
import { Account } from "@schema/account.schema";
import { handleError, loggedHandleError } from "@utils/handleMessageError";
import {
  handleSuccess,
  loggedHandleSuccess,
} from "@utils/handleMessageSuccess";
import { RequestHandler } from "express";
import { RowDataPacket } from "mysql2";

const { SELECT_USER_ID } = process.env;

export const getUserProfile: RequestHandler = async (req, res) => {
  try {
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
      res.status(500).send(handleError("Sql request not defined"));
      return;
    }

    const [userProfile] = await pool.query<RowDataPacket[] & Account[]>(
      SELECT_USER_ID,
      [user.id]
    );

    loggedHandleSuccess("Display user's profile", userProfile);
    res.status(200).json(handleSuccess("User profile", userProfile));
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};
