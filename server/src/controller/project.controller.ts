import pool from "@config/database";
import { Project } from "@schema/project.schema";
import { handleError, loggedHandleError } from "@utils/handleMessageError";
import {
  handleSuccess,
  loggedHandleSuccess,
} from "@utils/handleMessageSuccess";
import { RequestHandler } from "express";
import { RowDataPacket } from "mysql2";

const { GET_PROJECTS, GET_PROJECT_ID } = process.env;

export const getProjects: RequestHandler = async (req, res) => {
  try {
    if (!GET_PROJECTS) {
      res
        .status(400)
        .send(handleError(new Error("Sql request is not defined")));
      return;
    }

    const [projects] = await pool.query<RowDataPacket[] & Project[]>(
      GET_PROJECTS
    );

    loggedHandleSuccess("Get all projects", projects);
    res.status(200).json(handleSuccess("Get all projects", projects));
  } catch (error) {
    loggedHandleError(error);
    res.status(500).send(handleError(error));
    return;
  }
};

export const getProjectId: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!GET_PROJECT_ID) {
      res
        .status(400)
        .send(
          handleError(
            new Error("Sql request is not defined"),
            "Undefined element"
          )
        );
      return;
    } else if (!id) {
      res.status(400).send(handleError("Id required !", "Missing item !"));
      return;
    }

    const [project] = await pool.query<RowDataPacket[] & Project[]>(
      GET_PROJECT_ID
    );

    loggedHandleSuccess("Get project by id", project);
    res.status(200).json(handleSuccess("Get project by id", project));
  } catch (error) {
    loggedHandleError(error);
    res.status(500).send(handleError(error));
    return;
  }
};
