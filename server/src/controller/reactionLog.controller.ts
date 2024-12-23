import pool from "@/config/database";
import { displayReactionCount } from "@/utils/handleIds";
import {
  handleSuccess,
  loggedHandleSuccess,
} from "@/utils/handleMessageSuccess";
import {
  Account,
  Reaction,
  ReactionLog,
  ReactionTarget,
} from "@schema/account.schema";
import { handleError, loggedHandleError } from "@utils/handleMessageError";
import { RequestHandler } from "express";
import { RowDataPacket } from "mysql2";

const {
  GET_USER_REACTION_LOG,
  GET_ALL_REACTION_LOG_PANELS,
  GET_REACTION_COUNTS_BY_ACCOUNT,
  ADMIN_ID,
} = process.env;

export const getUserReactionLog: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;

    if (!GET_USER_REACTION_LOG || !GET_REACTION_COUNTS_BY_ACCOUNT) {
      res.status(500).send(handleError("Sql request is not defined"));
      return;
    } else if (!user) {
      res
        .status(401)
        .send(
          handleError("Unauthorized or session expired", "Unauthorized access")
        );
      return;
    }

    const [userReactionLog] = await pool.query(GET_USER_REACTION_LOG, [
      user.id,
    ]);

    loggedHandleSuccess("Get reaction log User", { userReactionLog });
    res
      .status(200)
      .json(handleSuccess("Get reaction log User", { userReactionLog }));
  } catch (error) {
    loggedHandleError(error);
    res.status(500).send(handleError(error));
    return;
  }
};

export const getAllReactionLog: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    if (
      !GET_ALL_REACTION_LOG_PANELS ||
      !GET_REACTION_COUNTS_BY_ACCOUNT ||
      !ADMIN_ID
    ) {
      res.status(500).send(handleError("Sql request is not defined"));
      return;
    } else if (!user || user.role_id !== ADMIN_ID) {
      res
        .status(401)
        .send(
          handleError("Unauthorized or session expired", "Unauthorized access")
        );
      return;
    }

    const [getReactionLogPanels] = await pool.query<
      RowDataPacket[] & Account & ReactionLog & Reaction & ReactionTarget
    >(GET_ALL_REACTION_LOG_PANELS);
    const {
      username,
      email,
      name,
      lastname,
      lastlogin,
      emoji,
      target_name,
      account_id,
    } = getReactionLogPanels;

    loggedHandleSuccess("Get all reaction log", { getReactionLogPanels });

    const countedReaction = await displayReactionCount(account_id);

    res.status(200).json(
      handleSuccess("Get all reaction log", {
        reationPanels: {
          user_account: { username, email, name, lastname, lastlogin },
          reactions: {
            emoji,
            target_name,
            reaction_panel: {
              panel: countedReaction,
            },
          },
        },
      })
    );
  } catch (error) {
    loggedHandleError(error);
    res.status(500).send(handleError(error));
    return;
  }
};
