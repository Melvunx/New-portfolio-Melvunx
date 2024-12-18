import pool from "@config/database";
import { Formation } from "@schema/aboutMe.schema";
import { handleError, loggedHandleError } from "@utils/handleMessageError";
import {
  handleSuccess,
  loggedHandleSuccess,
} from "@utils/handleMessageSuccess";
import { RequestHandler } from "express";
import { RowDataPacket } from "mysql2";

const { GET_FORMATION, GET_FORMATION_ID } = process.env;

export const getFormations: RequestHandler = async (req, res) => {
  try {
    if (!GET_FORMATION) {
      res
        .status(500)
        .send(handleError(new Error("Sql request is not defined")));
      return;
    }

    const [formations] = await pool.query<RowDataPacket[] & Formation[]>(
      GET_FORMATION
    );
    loggedHandleSuccess("Get all formations", formations);
    res.status(200).json(handleSuccess("Get all formations", formations));
  } catch (error) {
    loggedHandleError(error);
    res.status(500).send(handleError(error));
    return;
  }
};

export const getFormationId: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!GET_FORMATION_ID) {
      res
        .status(500)
        .send(handleError(new Error("Sql request is not defined")));
      return;
    } else if (!id) {
      res.status(400).send(handleError("Id required !", "Missing item !"));
      return;
    }

    const [formation] = await pool.query<RowDataPacket[] & Formation[]>(
      GET_FORMATION_ID
    );
    loggedHandleSuccess("Get formation by id", formation);
    res.status(200).json(handleSuccess("Get formation by id", formation));
  } catch (error) {
    loggedHandleError(error);
    res.status(500).send(handleError(error));
    return;
  }
};
