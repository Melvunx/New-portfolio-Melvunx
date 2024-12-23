import pool from "@/config/database";
import { Generator } from "@/services/generator.services";
import { checkAffectedRow } from "@/services/handleAffectedRows.services";
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
import { OkPacketParams, RowDataPacket } from "mysql2";

const {
  ADMIN_ID,
  GET_USER_REACTION_LOG,
  GET_ALL_REACTION_LOG_PANELS,
  GET_REACTION_COUNTS_BY_ACCOUNT,
  ADD_REACTION_LOG,
  REMOVE_REACTION_LOG,
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

export const reactToElement: RequestHandler<
  { reaction_id: string; target_id: string },
  {},
  { reactionlog: ReactionLog }
> = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { reaction_id, target_id } = req.params;
    const {
      reactionlog: { target_type_id },
    } = req.body;

    if (!ADD_REACTION_LOG) {
      res
        .status(500)
        .send(handleError("Sql request not defined", "Undefined element"));
      return;
    } else if (!user) {
      res.status(401).send(handleError("Unauthorized", "Unauthorized user"));
      return;
    }

    const generator = new Generator(14);
    const reactionLogId = generator.generateIds();

    const [newReactionLog] = await pool.query<RowDataPacket[] & OkPacketParams>(
      ADD_REACTION_LOG,
      [reactionLogId, user.id, target_type_id, reaction_id, target_id]
    );

    checkAffectedRow(newReactionLog);
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};

export const removeReactionFromElement: RequestHandler = async (req, res) => {
  try {
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};
