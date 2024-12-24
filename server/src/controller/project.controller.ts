import { Project } from "@/schema/project.schema";
import { Generator } from "@/services/generator.services";
import { checkAffectedRow } from "@/services/handleAffectedRows.services";
import { updateDateTime } from "@/services/handleDateTime.services";
import pool from "@config/database";
import { Account } from "@schema/account.schema";
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
  ADMIN_ID,
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

export const createNewProject: RequestHandler<
  {},
  {},
  { project: Project }
> = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;

    const {
      project: {
        title,
        description,
        project_status_id,
        github_url,
        production_url,
        image_url,
        video_url,
      },
    } = req.body;

    if (!CREATE_NEW_PROJECT || !ADMIN_ID) {
      res
        .status(500)
        .send(handleError("Sql request is not defined", "Undefined element"));
      return;
    } else if (!user || user.role_id !== ADMIN_ID) {
      res
        .status(401)
        .send(
          handleError("Unauthorized or session expired", "Unauthorized access")
        );
      return;
    }

    if (!title || !description || !project_status_id || !github_url) {
      res.status(400).send(handleError("Missing required fields"));
      return;
    }

    const generator = new Generator(14);
    const projectId = generator.generateIds();

    const [newProject] = await pool.query<RowDataPacket[] & OkPacketParams>(
      CREATE_NEW_PROJECT,
      [
        projectId,
        title,
        description,
        project_status_id,
        github_url,
        production_url ? production_url : "NULL",
        image_url ? image_url : "NULL",
        video_url ? video_url : "NULL",
      ]
    );

    checkAffectedRow(newProject);

    loggedHandleSuccess("New project !", {
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
        project: {
          title,
          description,
          project_status_id,
          github_url,
          production_url: production_url ? production_url : "NULL",
          image_url: image_url ? image_url : "NULL",
          video_url: video_url ? video_url : "NULL",
        },
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

    if (!MODIFY_PROJECT || !ADMIN_ID) {
      res
        .status(500)
        .send(
          handleError(
            new Error("Sql request is not defined"),
            "Undefined element"
          )
        );
      return;
    } else if (!user || user.role_id !== ADMIN_ID) {
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

    const [modifiedProject] = await pool.query<
      RowDataPacket[] & OkPacketParams
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

    checkAffectedRow(modifiedProject);

    await updateDateTime("project", id);

    loggedHandleSuccess("Modify project", {
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

    if (!DELETE_PROJECT || !ADMIN_ID) {
      res
        .status(500)
        .send(handleError("Sql request not defined", "Undefined element"));
      return;
    } else if (!user || user.role_id !== ADMIN_ID) {
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

    const [deletedProject] = await pool.query<RowDataPacket[] & OkPacketParams>(
      DELETE_PROJECT,
      [id]
    );

    checkAffectedRow(deletedProject);

    loggedHandleSuccess(`Project with the id ${id} deleted`);

    res.status(200).send(handleSuccess("Project deleted successfully"));
  } catch (error) {
    loggedHandleError(error, "Catched error");
    res.status(500).send(handleError(error, "Catched error"));
    return;
  }
};
