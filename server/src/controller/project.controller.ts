import pool from "@config/database";
import { Account } from "@schema/account.schema";
import { handleError, loggedHandleError } from "@utils/handleMessageError";
import {
  handleSuccess,
  loggedHandleSuccess,
} from "@utils/handleMessageSuccess";
import { RequestHandler } from "express";

const {
  GET_PROJECTS,
  GET_PROJECT_ID,
  CREATE_NEW_PROJECT,
  MODIFY_PROJECT,
  UPDATE_DATE,
  DELETE_PROJECT,
} = process.env;

export const getProjects: RequestHandler = async (req, res) => {
  try {
    if (!GET_PROJECTS) {
      res
        .status(500)
        .send(handleError("Sql request is not defined", "Undefined element"));
      return;
    }

    const [projects] = await pool.query(GET_PROJECTS);

    loggedHandleSuccess("Get all projects", projects);
    res.status(200).json(handleSuccess("Get all projects", projects));
  } catch (error) {
    loggedHandleError(error, "Catched error");
    res.status(500).send(handleError(error, "Catched error"));
    return;
  }
};

export const getProjectId: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!GET_PROJECT_ID) {
      res
        .status(500)
        .send(handleError("Sql request is not defined", "Undefined element"));
      return;
    } else if (!id) {
      res.status(400).send(handleError("Id required !", "Missing item !"));
      return;
    }

    const [project] = await pool.query(GET_PROJECT_ID);

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
        .send(handleError("Sql request is not defined", "Undefined element"));
      return;
    } else if (!user || user.role_id !== 2) {
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
      res.status(400).send(handleError("Missing required fields"));
      return;
    }

    const [newProject] = await pool.query(CREATE_NEW_PROJECT, [
      title,
      description,
      project_status_id,
      github_url,
      production_url ? production_url : "NULL",
      image_url ? image_url : "NULL",
      video_url ? video_url : "NULL",
    ]);

    loggedHandleSuccess("New project !", {
      packets: newProject,
      project: {
        title,
        description,
        project_status_id,
        github_url,
        production_url: production_url ? production_url : "NULL",
        image_url: image_url ? image_url : "NULL",
        video_url: video_url ? video_url : "NULL",
      },
    });

    res.status(201).json(
      handleSuccess("New project created", {
        title,
        description,
        project_status_id,
        github_url,
        production_url: production_url ? production_url : "NULL",
        image_url: image_url ? image_url : "NULL",
        video_url: video_url ? video_url : "NULL",
      })
    );
  } catch (error) {
    loggedHandleError(error, "Catched error");
    res.status(500).send(handleError(error, "Catched error"));
    return;
  }
};

export const updateProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user: Account = req.cookies.userCookie;

    if (!MODIFY_PROJECT || !UPDATE_DATE) {
      res
        .status(500)
        .send(
          handleError(
            new Error("Sql request is not defined"),
            "Undefined element"
          )
        );
      return;
    } else if (!user || user.role_id !== 2) {
      res.status(401).send(handleError("Unauthorized", "Unauthorized"));
    } else if (!id) {
      res.status(400).send(handleError("Missing id", "Missing id"));
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

    const [modifiedProject] = await pool.query(MODIFY_PROJECT, [
      title,
      description,
      project_status_id,
      github_url,
      production_url ? production_url : "NULL",
      image_url ? image_url : "NULL",
      video_url ? video_url : "NULL",
      id,
    ]);

    await pool.query(UPDATE_DATE, [id]);

    loggedHandleSuccess("Modify project", {
      packet: modifiedProject,
      modifiedProject: {
        id,
        title,
        description,
        project_status_id,
        github_url,
        production_url: production_url ? production_url : "NULL",
        image_url: image_url ? image_url : "NULL",
        video_url: video_url ? video_url : "NULL",
      },
    });
    res.status(200).json(
      handleSuccess("Modified project", {
        id,
        title,
        description,
        project_status_id,
        github_url,
        production_url: production_url ? production_url : "NULL",
        image_url: image_url ? image_url : "NULL",
        video_url: video_url ? video_url : "NULL",
      })
    );
  } catch (error) {
    loggedHandleError(error, "Catched error");
    res.status(500).send(handleError(error, "Catched error"));
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
        .send(handleError("Sql request not defined", "Undefined element"));
      return;
    } else if (!user || user.role_id !== 2) {
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
      res.status(400).send(handleError("Missing id", "Missing id"));
      return;
    }

    await pool.query(DELETE_PROJECT, [id]);

    loggedHandleSuccess(`Project with the id ${id} deleted`);
    res.status(200).send(handleSuccess("Project deleted successfully"));
  } catch (error) {
    loggedHandleError(error, "Catched error");
    res.status(500).send(handleError(error, "Catched error"));
    return;
  }
};
