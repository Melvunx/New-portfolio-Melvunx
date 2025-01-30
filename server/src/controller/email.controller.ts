import { prisma } from "@/config/prisma";
import apiReponse from "@/services/apiResponse";
import isArrayOrIsEmpty from "@/utils/isArrayOrEmpty";
import { Account, Letter } from "@prisma/client";
import { RequestHandler } from "express";

const { ADMIN_ID } = process.env;

if (!ADMIN_ID) {
  throw new Error("Ids not found");
}

export const getAllLetters: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    const letters = await prisma.letter.findMany();

    const isNotEmptyLetter = isArrayOrIsEmpty(letters);

    return apiReponse.success(res, "Ok", isNotEmptyLetter ? letters : null);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const postEmail: RequestHandler<{}, {}, Letter> = async (req, res) => {
  try {
    const user: Account | undefined = req.cookies.userCookie;

    const { sender, email, objet, message } = req.body;

    if (!sender || !email || !objet || !message)
      return apiReponse.error(res, "Bad Request", new Error("Missing fiels"));

    const letter = await prisma.letter.create({
      data: {
        sender,
        email,
        objet,
        message,
        accountId: user ? user.id : null,
      },
    });

    // await sendMail(email, objet, message);

    return apiReponse.success(res, "Created", letter);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};
