import { prisma } from "@/config/prisma";
import apiReponse from "@/services/apiResponse";
import isArrayOrIsEmpty from "@/utils/isArrayOrEmpty";
import { Account, Reaction } from "@prisma/client";
import { RequestHandler } from "express";

const { ADMIN_ID } = process.env;

if (!ADMIN_ID) {
  throw new Error("Id not found");
}

export const getReactions: RequestHandler = async (req, res) => {
  try {
    const reactions = await prisma.reaction.findMany();
    const isNotEmptyReaction = isArrayOrIsEmpty(reactions);

    return apiReponse.success(res, "Ok", isNotEmptyReaction ? reactions : null);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const getReactionId: RequestHandler = async (req, res) => {
  try {
    const { reactionId } = req.params;

    if (!reactionId)
      return apiReponse.error(res, "Not Found", new Error("Id not found"));

    const reaction = await prisma.reaction.findUnique({
      where: {
        id: reactionId,
      },
    });

    return apiReponse.success(res, "Ok", reaction);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const createNewReaction: RequestHandler<{}, {}, Reaction> = async (
  req,
  res
) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { emoji, action, tooltip } = req.body;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    if (!emoji || !action || !tooltip)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Missing required fields")
      );

    const reaction = await prisma.reaction.create({
      data: {
        emoji,
        action,
        tooltip,
      },
    });

    return apiReponse.success(res, "Created", reaction);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const updateReaction: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { reactionId } = req.params;
    const {
      reaction: { emoji, action, tooltip },
    } = req.body;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    if (!reactionId)
      return apiReponse.error(res, "Not Found", new Error("Id not found"));

    if (!emoji || !action || !tooltip)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Missing required fields")
      );

    const reaction = await prisma.reaction.update({
      where: { id: reactionId },
      data: {
        emoji,
        action,
        tooltip,
      },
    });

    return apiReponse.success(res, "Ok", reaction);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const deleteReaction: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { reactionId } = req.params;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    if (!reactionId)
      return apiReponse.error(res, "Not Found", new Error("Id not found"));

    const reaction = await prisma.reaction.delete({
      where: { id: reactionId },
    });

    return apiReponse.success(
      res,
      "Ok",
      null,
      `Reaction ${reaction.emoji} deleted`
    );
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const deleteManyReactions: RequestHandler<
  {},
  {},
  { ids: string[] }
> = async (req, res) => {
  try {
    const { ids } = req.body;
    const user = req.cookies.userCookie;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    if (!isArrayOrIsEmpty(ids))
      return apiReponse.error(res, "Bad Request", new Error("Ids required"));

    const reaction = await prisma.reaction.deleteMany({
      where: { id: { in: ids } },
    });

    return apiReponse.success(
      res,
      "Ok",
      null,
      `Reactions deleted ${reaction.count}`
    );
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};
