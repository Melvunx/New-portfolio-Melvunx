import { Experience } from "@/schema/aboutMe.schema";
import {
  handleSuccess,
  loggedHandleSuccess,
} from "@/utils/handleMessageSuccess";
import pool from "@config/database";
import { handleError } from "@utils/handleMessageError";
import { RequestHandler } from "express";
import { RowDataPacket } from "mysql2";
import { loggedHandleError } from "../utils/handleMessageError";

const { GET_EXPERIENCES } = process.env;

export const getFormations: RequestHandler  = async (req, res) => {
  try {
    if(!GET_EXPERIENCES){
    res
        .status(400)
        .send(handleError(new Error("Sql request is not defined")));
    return;
  }

  const [experiences] = await pool.query<RowDataPacket[] & Experience[]>(GET_EXPERIENCES);
  loggedHandleSucces("Get all experiences", experiences)
  res.status(200).json(handleSuccess("Get all experiences", experiences));
  } catch(error) {
    loggedHandleError(error);
    res.status(500).send(handleError(error));
    return;
  }
}

export const getExperienceId: RequestHandler = async (req, res) => {

  try{
    const { id } = req.params

    if(!GET_EXPERIENCE_ID){
        res
          .status(400)
          .send(handleError(new Error("Sql request is not defined")));
        return;
    } else if(!id) {
      res.status(400).send(handleError("Id required !", "Missing item !"));
      return;
    }

  const [experience] = await pool.query<RowDataPacket[] & Experience[]>(GET_EXPERIENCE_ID);
  loggedHandleSucces("Get experience by id", experience);
  res.status(200).json(handleSucces("Get experience by id", experience));
  } catch(error) {
    loggedHandleError(error);
    res.status(500).send(handleError(error));
    return;
  }
}
