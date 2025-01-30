import { prisma } from "@/config/prisma";
import apiReponse from "@/services/apiResponse";
import isArrayOrIsEmpty from "@/utils/isArrayOrEmpty";
import { Account } from "@prisma/client";
import { RequestHandler } from "express";

const { ADMIN_ID } = process.env;

if (!ADMIN_ID) {
  throw new Error("Id not found");
}

export const getUserReactionLog: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;

    if (!user)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    const reactionLogUser = await prisma.reactionLog.findMany({
      where: {
        accountId: user.id,
      },
      include: {
        reaction: true,
      },
    });

    const isNotEmptyReactionLog = isArrayOrIsEmpty(reactionLogUser);

    return apiReponse.success(
      res,
      "Ok",
      isNotEmptyReactionLog ? reactionLogUser : null
    );
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const getAllReactionLog: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    const reactionLog = await prisma.reactionLog.findMany({
      include: {
        targetType: true,
        account: {
          select: {
            username: true,
          },
          include: {
            reactions: {
              include: {
                reaction: {
                  select: {
                    emoji: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return apiReponse.success(res, "Ok", reactionLog);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const reactToElement: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { reactionId, targetId } = req.params;

    if (!user)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    let target_name: string | null = null;

    console.log(`Checking the id ${targetId} in the project table...`);

    const project = await prisma.project.findFirst({
      where: {
        targetTypeId: targetId,
      },
    });

    if (project) {
      target_name = project.targetTypeId;
      console.log("Project found !");
    }

    console.log("Project not found, checking the experience table...");

    const experience = await prisma.experience.findFirst({
      where: {
        targetTypeId: targetId,
      },
    });

    if (experience) {
      target_name = experience.targetTypeId;
      console.log("Experience found !");
    }
    console.log("Experience not found. Checking formation table...");

    const formation = await prisma.formation.findFirst({
      where: {
        targetTypeId: targetId,
      },
    });

    if (formation) {
      target_name = formation.targetTypeId;
      console.log("Formation found !");
    }

    if (!target_name)
      return apiReponse.error(res, "Not Found", new Error("No target found"));

    const reactionLog = await prisma.reactionLog.create({
      data: {
        accountId: user.id,
        targetTypeId: target_name,
        reactionId,
      },
    });

    return apiReponse.success(res, "Created", reactionLog);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const removeReactionFromElement: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { reactionLogId } = req.params;

    if (!user)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    if (!reactionLogId)
      return apiReponse.error(res, "Not Found", new Error("Id not found"));

    const reactionLog = await prisma.reactionLog.delete({
      where: {
        id: reactionLogId,
        accountId: user.id,
      },
      include: {
        reaction: {
          select: {
            emoji: true,
          },
        },
      },
    });

    return apiReponse.success(
      res,
      "Ok",
      null,
      `Reaction ${reactionLog.reaction?.emoji} removed`
    );
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};
