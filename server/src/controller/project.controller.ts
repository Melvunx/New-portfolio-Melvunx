import pool from "@config/database";
import { Account } from "@schema/account.schema";
import { Project } from "@schema/project.schema";
import { handleError, loggedHandleError } from "@utils/handleMessageError";
import {
  handleSuccess,
  loggedHandleSuccess,
} from "@utils/handleMessageSuccess";
import { RequestHandler } from "express";
import { OkPacketParams, RowDataPacket } from "mysql2";

const {
  GET_PROJECTS,
  GET_PROJECT_ID,
  CREATE_NEW_PROJECT,
  MODIFY_PROJECT,
  DELETE_PROJECT,
} = process.env;

export const getProjects: RequestHandler = async (req, res) => {
  try {
    if (!GET_PROJECTS) {
      res
        .status(500)
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
        .status(500)
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

export const createNewProject: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;

    if (!CREATE_NEW_PROJECT) {
      res
        .status(500)
        .send(
          handleError(
            new Error("Sql request is not defined"),
            "Undefined element"
          )
        );
      return;
    } else if (!user || user.id !== 2) {
      res
        .status(401)
        .send(
          handleError("Unauthorized or session expired", "Unauthorized access")
        );
      return;
    }

    const {
      title,
      description,
      project_status_id,
      github_url,
      production_url,
      image_url,
      video_url,
    } = req.body;

    if (!title || !description || !project_status_id || !github_url) {
      res.status(400).send(handleError(new Error("Missing required fields")));
      return;
    }

    const [newProject] = await pool.query<RowDataPacket[] & OkPacketParams>(
      CREATE_NEW_PROJECT,
      [
        title,
        description,
        project_status_id,
        github_url,
        production_url ? production_url : "NULL",
        image_url ? image_url : "NULL",
        video_url ? video_url : "NULL",
      ]
    );

    loggedHandleSuccess("New project !", {
      packets: newProject,
      project: {
        title,
        description,
        project_status_id,
        github_url,
        production_url,
        image_url,
        video_url,
      },
    });

    res.status(201).json(
      handleSuccess("New project created", {
        title,
        description,
        project_status_id,
        github_url,
        production_url,
        image_url,
        video_url,
      })
    );
  } catch (error) {
    loggedHandleError(error);
    res.status(500).send(handleError(error));
    return;
  }
};

export const projectModifier: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user: Account = req.cookies.userCookie;

    if (!MODIFY_PROJECT) {
      res
        .status(500)
        .send(
          handleError(
            new Error("Sql request is not defined"),
            "Undefined element"
          )
        );
      return;
    } else if (!user || user.id !== 2) {
      res
        .status(401)
        .send(handleError(new Error("Unauthorized"), "Unauthorized"));
    } else if (!id) {
      res.status(400).send(handleError(new Error("Missing id"), "Missing id"));
      return;
    }

    const {
      title,
      description,
      project_status_id,
      github_url,
      production_url,
      image_url,
      video_url,
    } = req.body;

    if (!title || !description || !project_status_id || !github_url) {
      res.status(400).send(handleError("Missing required fields"));
      return;
    }

    const [modifiedProject] = await pool.query<
      RowDataPacket[] & OkPacketParams[]
    >(MODIFY_PROJECT, [
      title,
      description,
      project_status_id,
      github_url,
      production_url ? production_url : "NULL",
      image_url ? image_url : "NULL",
      video_url ? video_url : "NULL",
      id,
    ]);

    loggedHandleSuccess("Modify project", {
      packet: modifiedProject,
      modifiedProject: {
        id,
        title,
        description,
        project_status_id,
        github_url,
        production_url,
        image_url,
        video_url,
      },
    });
    res.status(200).json(
      handleSuccess("Modified project", {
        id,
        title,
        description,
        project_status_id,
        github_url,
        production_url,
        image_url,
        video_url,
      })
    );
  } catch (error) {
    loggedHandleError(error);
    res.status(500).send(handleError(error));
    return;
  }
};

export const deleteProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user: Account = req.cookies.userCookie;

    if (!DELETE_PROJECT) {
      res
        .status(500)
        .send(
          handleError(new Error("Sql request not defined"), "Undefined element")
        );
      return;
    } else if (!user || user.id !== 2) {
      res
        .status(401)
        .send(
          handleError(
            new Error("Unauthorized or session expired"),
            "Unauthorized"
          )
        );
      return;
    } else if (!id) {
      res.status(400).send(handleError(new Error("Missing id"), "Missing id"));
      return;
    }

    await pool.query<RowDataPacket[] & OkPacketParams>(DELETE_PROJECT, [id]);

    loggedHandleSuccess(`Project with the id ${id} deleted`);
    res.status(200).send(handleSuccess("Project deleted successfully"));
  } catch (error) {
    loggedHandleError(error);
    res.status(500).send(handleError(error));
    return;
  }
};
