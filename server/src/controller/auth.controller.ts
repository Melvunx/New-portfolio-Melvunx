import { Account } from "@models/account.models";
import colors from "@models/colors.models";
import { errorMessage } from "@utils/handleMessageError";
import { RequestHandler } from "express";

const { CREATE_NEW_ACCOUNT } = process.env;

export const register: RequestHandler<{}, {}, Account> = async (req, res) => {
  const { username, email, password, name, lastname, role_id } = req.body;

  if (!CREATE_NEW_ACCOUNT) {
    res
      .status(500)
      .send({ error: errorMessage("Sql request: request not defined") });
    return;
  } else if (!username || !email || !password || !name || !lastname) {
    res.status(400).send({ error: errorMessage("Missing required fields") });
    return;
  }

  try {
  } catch (error) {
    console.log(colors.error(errorMessage(), error));
    res.status(500).send({ message: errorMessage(), error });
  }
};
