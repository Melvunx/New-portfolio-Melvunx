import { AboutMe } from "@/schema/aboutMe.schema";
import {
  handleSuccess,
  loggedHandleSuccess,
} from "@/utils/handleMessageSuccess";
import pool from "@config/database";
import { handleError } from "@utils/handleMessageError";
import { RequestHandler } from "express";
import { RowDataPacket } from "mysql2";
import { loggedHandleError } from "../utils/handleMessageError";

const { SELECT_ABOUTME } = process.env;

export const getInfoAboutMe: RequestHandler = async (req, res) => {
  try {
    if (!SELECT_ABOUTME) {
      res
        .status(500)
        .send(handleError(new Error("Sql request is not defined")));
      return;
    }

    const [info] = await pool.query<RowDataPacket[] & AboutMe[]>(
      SELECT_ABOUTME
    );
    loggedHandleSuccess("Get info", info);
    res.status(200).json(handleSuccess("", info));
  } catch (error) {
    loggedHandleError(error);
    res.status(500).send(handleError(error));
    return;
  }
};
