import { Account, Reaction } from "@/schema/account.schema";
import { Generator } from "@/services/generator.services";
import { checkAffectedRow } from "@/services/handleAffectedRows.services";
import pool from "@config/database";
import { handleError, loggedHandleError } from "@utils/handleMessageError";
import {
  handleSuccess,
  loggedHandleSuccess,
} from "@utils/handleMessageSuccess";
import { RequestHandler } from "express";
import { OkPacketParams, RowDataPacket } from "mysql2";

const {
  GET_REACTIONS,
  GET_REACTION_ID,
  CREATE_REACTION,
  UPDATE_REACTION,
  DELETE_REACTION,
  ADMIN_ID,
} = process.env;

const generator = new Generator(14);

export const getReactions: RequestHandler = async (req, res) => {
  try {
    if (!GET_REACTIONS) {
      res.status(500).send(handleError("Sql request not defined"));
      return;
    }

    const [reactions] = await pool.query<RowDataPacket[] & Reaction>(
      GET_REACTIONS
    );

    loggedHandleSuccess("Get all reactions", {
      number_reaction: reactions.length,
      reactions,
    });
    res.status(200).json(
      handleSuccess("Get all reactions", {
        number_reaction: reactions.length,
        reactions,
      })
    );
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};

export const getReactionId: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!GET_REACTION_ID) {
      res.status(500).send(handleError("Sql request not defined"));
      return;
    }
    const [reaction] = await pool.query(GET_REACTION_ID, [id]);
    loggedHandleSuccess("Get reaction by id", reaction);
    res.status(200).json(handleSuccess("Get reaction by id", { reaction }));
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};

export const createNewReaction: RequestHandler<
  {},
  {},
  { reaction: Reaction }
> = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const {
      reaction: { emoji, action, tooltip },
    } = req.body;

    if (!CREATE_REACTION || !ADMIN_ID) {
      res.status(500).send(handleError("Sql request not defined"));
      return;
    } else if (!user || user.role_id !== ADMIN_ID) {
      res
        .status(401)
        .send(
          handleError("Unauthorized or session expired", "Unauthorized access")
        );
      return;
    }

    
    const reactionId = generator.generateIds();

    await pool.query(CREATE_REACTION, [reactionId, emoji, action, tooltip]);

    loggedHandleSuccess("Create new reaction", {
      reaction: { id: reactionId, emoji, action, tooltip },
    });
    res.status(201).json(
      handleSuccess("Create new reaction", {
        reaction: { id: reactionId, emoji, action, tooltip },
      })
    );
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};

export const updateReaction: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { id } = req.params;
    const {
      reaction: { emoji, action, tooltip },
    } = req.body;

    if (!UPDATE_REACTION || !ADMIN_ID) {
      res.status(500).send(handleError("Sql request not defined"));
      return;
    } else if (!user || user.role_id !== ADMIN_ID) {
      res
        .status(401)
        .send(
          handleError("Unauthorized or session expired", "Unauthorized access")
        );
      return;
    } else if (!id) {
      res.status(400).send(handleError("Id required !", "Element undefined"));
    }

    await pool.query(UPDATE_REACTION, [emoji, action, tooltip, id]);
    loggedHandleSuccess("Update reaction", {
      reaction: { emoji, action, tooltip },
    });

    res.status(200).json(
      handleSuccess("Update reaction", {
        reaction: { emoji, action, tooltip },
      })
    );
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};

export const deleteReaction: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { id } = req.params;

    if (!DELETE_REACTION || !ADMIN_ID) {
      res.status(500).send(handleError("Sql request not defined"));
      return;
    }
    if (!user || user.role_id !== ADMIN_ID) {
      res
        .status(401)
        .send(
          handleError("Unauthorized or session expired", "Unauthorized access")
        );
      return;
    } else if (!id) {
      res.status(400).send(handleError("Id required !", "Element undefined"));
    }

    const [deletedReaction] = await pool.query<
      RowDataPacket[] & OkPacketParams
    >(DELETE_REACTION, [id]);

    checkAffectedRow(deletedReaction);

    loggedHandleSuccess(`Delete reaction with the id ${id}`);
    res.status(200).json(handleSuccess(`Delete reaction with the id ${id}`));
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};
