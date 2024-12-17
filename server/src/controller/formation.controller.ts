import { Formation } from "@/schema/aboutMe.schema";
import {
  handleSuccess,
  loggedHandleSuccess,
} from "@/utils/handleMessageSuccess";
import pool from "@config/database";
import { handleError } from "@utils/handleMessageError";
import { RequestHandler } from "express";
import { RowDataPacket } from "mysql2";
import { loggedHandleError } from "../utils/handleMessageError";

const { GET_FORMATION } = process.env;

export const getFormations: RequestHandler  = async (req, res) => {
  try {
    if(!GET_FORMATION){
    res
        .status(400)
        .send(handleError(new Error("Sql request is not defined")));
    return;
  }

  const [formations] = await pool.query<RowDataPacket[] & Formation[]>(GET_FORMATION);
  loggedHandleSucces("Get all formations", formations)
  res.status(200).json(handleSuccess("Get all formations", formations));
  } catch(error) {
    loggedHandleError(error);
    res.status(500).send(handleError(error));
    return;
  }
}
