import { checkAffectedRow } from "@/services/handleAffectedRows.services";
import { handleError, loggedHandleError } from "@/utils/handleMessageError";
import {
  handleSuccess,
  loggedHandleSuccess,
} from "@/utils/handleMessageSuccess";
import { Account } from "@schema/account.schema";
import { Letter } from "@schema/letter.schema";
import { Generator } from "@services/generator.services";
import { RequestHandler } from "express";
import { OkPacketParams, RowDataPacket } from "mysql2";
import { Resend } from "resend";
import pool from "../config/database";

const { RESEND_API_KEY, MY_EMAIL, INSERT_LETTER } = process.env;

const resend = new Resend(RESEND_API_KEY);

export const postEmail: RequestHandler<{}, {}, { letter: Letter }> = async (
  req,
  res
) => {
  try {
    const user: Account = req.cookies.userCookie;

    if (!INSERT_LETTER || !MY_EMAIL) {
      res
        .status(500)
        .send(handleError("Sql request undefined", "Undefined element"));
      return;
    }

    const {
      letter: { sender, object, email, message },
    } = req.body;

    const generator = new Generator(14);
    const letterId = generator.generateIds();

    const [createdEmail] = await pool.query<RowDataPacket[] & OkPacketParams>(
      INSERT_LETTER,
      [letterId, sender, object, email, message, user ? user.id : undefined]
    );

    checkAffectedRow(createdEmail);

    const newEmail = await resend.emails.send({
      from: email,
      to: MY_EMAIL,
      subject: object,
      html: `<strong>${message}</strong>`,
    });

    loggedHandleSuccess("Email send !", {
      email: {
        id: letterId,
        sender,
        object,
        email,
        message,
        acountId: user ? user.id : undefined,
      },
      email_status: newEmail,
    });
    res.status(201).json(
      handleSuccess("Email send !", {
        email: {
          id: letterId,
          sender,
          object,
          email,
          message,
          acountId: user ? user.id : undefined,
        },
        email_status: newEmail,
      })
    );
  } catch (error) {
    loggedHandleError(error, "Caught error");
    res.status(500).json(handleError(error));
    return;
  }
};
