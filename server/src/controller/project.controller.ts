import { prisma } from "@/config/prisma";
import apiReponse from "@/services/apiResponse";
import isArrayOrIsEmpty from "@/utils/isArrayOrEmpty";
import { Account, Project } from "@prisma/client";
import { RequestHandler } from "express";

const { ADMIN_ID, TARGET_TYPE_ID_PROJECT } = process.env;

if (!ADMIN_ID || !TARGET_TYPE_ID_PROJECT) {
  throw new Error("Ids not found");
}

export const getProjects: RequestHandler = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
        projectStatus: true,
      },
    });

    const isNotEmptyProjects = isArrayOrIsEmpty(projects);

    return apiReponse.success(res, "Ok", isNotEmptyProjects ? projects : null);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const getProjectId: RequestHandler = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId)
      return apiReponse.error(res, "Not Found", new Error("Id not found"));

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
        projectStatus: true,
      },
    });

    return apiReponse.success(res, "Ok", project);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const searchedProject: RequestHandler<
  {},
  {},
  {},
  { search: string }
> = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search)
      return apiReponse.error(
        res,
        "Not Found",
        new Error("Search text not found")
      );

    const projects = await prisma.project.findMany({
      include: {
        technologies: {
          include: {
            technology: {
              include: {
                category: true,
              },
            },
          },
        },
      },

      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            technologies: {
              some: {
                technology: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        ],
      },
    });

    const isNotEmptyProject = isArrayOrIsEmpty(projects);

    return apiReponse.success(res, "Ok", isNotEmptyProject ? projects : null);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const createNewProject: RequestHandler<{}, {}, Project> = async (
  req,
  res
) => {
  try {
    const user: Account = req.cookies.userCookie;

    const {
      title,
      description,
      projectStatusId,
      productionUrl,
      githubUrl,
      imageUrl,
      videoUrl,
    } = req.body;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    if (!title || !description || !projectStatusId)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Missing required fields")
      );

    const project = await prisma.project.create({
      data: {
        title,
        description,
        productionUrl: productionUrl ?? "NULL",
        githubUrl: githubUrl ?? "NULL",
        imageUrl: imageUrl ?? "NULL",
        videoUrl: videoUrl ?? "NULL",
        targetTypeId: TARGET_TYPE_ID_PROJECT,
        projectStatusId,
      },
    });

    return apiReponse.success(res, "Created", project);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const updateProject: RequestHandler<
  { projectId: string },
  {},
  Project
> = async (req, res) => {
  try {
    const { projectId } = req.params;
    const user: Account = req.cookies.userCookie;

    const {
      title,
      description,
      projectStatusId,
      productionUrl,
      githubUrl,
      imageUrl,
      videoUrl,
    } = req.body;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    if (!projectId)
      return apiReponse.error(res, "Not Found", new Error("Id not found"));

    if (!title || !description || !projectStatusId)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Missing required fields")
      );

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        title,
        description,
        projectStatusId,
        productionUrl: productionUrl ?? "NULL",
        githubUrl: githubUrl ?? "NULL",
        imageUrl: imageUrl ?? "NULL",
        videoUrl: videoUrl ?? "NULL",
      },
    });

    return apiReponse.success(res, "Ok", project);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const deleteProject: RequestHandler = async (req, res) => {
  try {
    const { projectId } = req.params;
    const user: Account = req.cookies.userCookie;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    if (!projectId)
      return apiReponse.error(res, "Not Found", new Error("Id not found"));

    const project = await prisma.project.delete({
      where: { id: projectId },
    });

    return apiReponse.success(
      res,
      "Ok",
      null,
      `Project ${project.title} deleted`
    );
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const deleteManyProjects: RequestHandler<
  {},
  {},
  { ids: string[] }
> = async (req, res) => {
  try {
    const { ids } = req.body;
    const user: Account = req.cookies.userCookie;
    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    if (!isArrayOrIsEmpty(ids))
      return apiReponse.error(res, "Bad Request", new Error("Ids required"));

    const projects = await prisma.project.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return apiReponse.success(
      res,
      "Ok",
      null,
      `Number of project deleted ${projects.count}`
    );
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};
