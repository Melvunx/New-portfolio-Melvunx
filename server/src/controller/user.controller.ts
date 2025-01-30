import { prisma } from "@/config/prisma";
import apiReponse from "@/services/apiResponse";
import { Account } from "@prisma/client";
import { RequestHandler } from "express";

export const getUserProfile: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;

    if (!user)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    const account = await prisma.account.findUniqueOrThrow({
      where: { id: user.id },
      include: {
        _count: {
          select: {
            reactions: true,
          },
        },
        reactions: {
          include: {
            reaction: true,
          },
        },
      },
    });

    return apiReponse.success(res, "Ok", account);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};
