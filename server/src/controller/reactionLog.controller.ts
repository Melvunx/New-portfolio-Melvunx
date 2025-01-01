import pool from "@/config/database";
import { Experience, Formation } from "@/schema/aboutMe.schema";
import { Project } from "@/schema/project.schema";
import { Generator } from "@/services/generator.services";
import { checkAffectedRow } from "@/services/handleAffectedRows.services";
import { displayReactionCount } from "@/utils/handleIds";
import {
  Account,
  Reaction,
  ReactionLog,
  ReactionTarget,
} from "@schema/account.schema";
import { handleError, loggedHandleError } from "@utils/handleMessageError";
import {
  handleSuccess,
  loggedHandleSuccess,
} from "@utils/handleMessageSuccess";
import { RequestHandler } from "express";
import { OkPacketParams, RowDataPacket } from "mysql2";

const {
  ADMIN_ID,
  GET_USER_REACTION_LOG,
  GET_ALL_REACTION_LOG_PANELS,
  GET_REACTION_COUNTS_BY_ACCOUNT,
  ADD_REACTION_LOG,
  REMOVE_REACTION_LOG,
  SELECT_TARGET_PROJECT,
  SELECT_TARGET_EXPERIENCE,
  SELECT_TARGET_FORMATION,
} = process.env;

const generator = new Generator(14);

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

export const reactToElement: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { reaction_id, target_id } = req.params;

    if (
      !ADD_REACTION_LOG ||
      !SELECT_TARGET_PROJECT ||
      !SELECT_TARGET_EXPERIENCE ||
      !SELECT_TARGET_FORMATION
    ) {
      res
        .status(500)
        .send(handleError("Sql request not defined", "Undefined element"));
      return;
    } else if (!user) {
      res.status(401).send(handleError("Unauthorized", "Unauthorized user"));
      return;
    }

    let target_name: string | null = null;

    console.log(`Checking the id ${target_id} in the project table...`);
    const [checkProjectId] = await pool.query<RowDataPacket[] & Project[]>(
      SELECT_TARGET_PROJECT,
      [target_id]
    );

    if (checkProjectId.length > 0) {
      target_name = checkProjectId[0].target_type_id;
      console.log("Project found !");
    }

    console.log("Project not found, checking the experience table...");
    const [checkExperienceId] = await pool.query<RowDataPacket[] & Experience>(
      SELECT_TARGET_EXPERIENCE,
      [target_id]
    );

    if (checkExperienceId.length > 0) {
      target_name = checkExperienceId[0].target_type_id;
      console.log("Experience found !");
    }
    console.log("Experience not found. Checking formation table...");
    const [checkFormationId] = await pool.query<RowDataPacket[] & Formation>(
      SELECT_TARGET_FORMATION,
      [target_id]
    );

    if (checkFormationId.length > 0) {
      target_name = checkFormationId[0].target_type_id;
      console.log("Formation found !");
    }

    if (target_name === null) {
      loggedHandleError("Target name not found", "Target name is null");
      res
        .status(404)
        .send(handleError("Target name not found", "Target name is null"));
      return;
    }

    const reactionLogId = generator.generateIds();

    const [newReactionLog] = await pool.query<RowDataPacket[] & OkPacketParams>(
      ADD_REACTION_LOG,
      [reactionLogId, user.id, target_name, reaction_id, target_id]
    );

    checkAffectedRow(newReactionLog);

    loggedHandleSuccess("Reaction added !", {
      reactionLog: {
        id: reactionLogId,
        account_id: user.id,
        target_name,
        reaction_id,
        target_id,
      },
    });

    res.status(201).json(
      handleSuccess("Reaction added !", {
        reactionLog: {
          id: reactionLogId,
          account_id: user.id,
          target_name,
          reaction_id,
          target_id,
        },
      })
    );
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};

export const removeReactionFromElement: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { id } = req.params;

    if (!REMOVE_REACTION_LOG) {
      res
        .status(500)
        .send(handleError("Sql request not defined", "Undefined element"));
      return;
    } else if (!user) {
      res.status(401).send(handleError("Unauthorized", "Unauthorized"));
      return;
    } else if (!id) {
      res.status(400).send(handleError("Missing id", "Missing id"));
      return;
    }

    const [removeReaction] = await pool.query<RowDataPacket[] & OkPacketParams>(
      REMOVE_REACTION_LOG,
      [id]
    );

    checkAffectedRow(removeReaction);

    loggedHandleSuccess("Reaction removed !", { reactionLogId: id });
    res
      .status(200)
      .json(handleSuccess("Reaction removed !", { reactionLogId: id }));
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};
