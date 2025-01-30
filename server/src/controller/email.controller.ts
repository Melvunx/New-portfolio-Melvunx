import sendMail from "@/config/email";
import { prisma } from "@/config/prisma";
import apiReponse from "@/services/apiResponse";
import { Account, Letter } from "@prisma/client";
import { RequestHandler } from "express";

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
