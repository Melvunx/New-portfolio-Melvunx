import pool from "@config/database";
import { Address, Formation } from "@schema/aboutMe.schema";
import { Account } from "@schema/account.schema";
import { handleError, loggedHandleError } from "@utils/handleMessageError";
import {
  handleSuccess,
  loggedHandleSuccess,
} from "@utils/handleMessageSuccess";
import { RequestHandler } from "express";
import { OkPacketParams, RowDataPacket } from "mysql2";

const {
  GET_FORMATION,
  GET_FORMATION_ID,
  CREATE_FORMATION,
  UPDATE_FORMATION,
  DELETE_FORMATION,
  CREATE_ADDRESS,
} = process.env;

export const getFormations: RequestHandler = async (req, res) => {
  try {
    if (!GET_FORMATION) {
      res.status(500).send(handleError("Sql request is not defined"));
      return;
    }

    const [formations] = await pool.query(GET_FORMATION);

    loggedHandleSuccess("Get all formations", formations);
    res.status(200).json(handleSuccess("Get all formations", formations));
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};

export const getFormationId: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!GET_FORMATION_ID) {
      res.status(500).send(handleError("Sql request is not defined"));
      return;
    } else if (!id) {
      res.status(400).send(handleError("Id required !", "Missing item !"));
      return;
    }

    const [formation] = await pool.query(GET_FORMATION_ID, [id]);

    loggedHandleSuccess("Get formation by id", formation);
    res.status(200).json(handleSuccess("Get formation by id", formation));
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};

export const createNewFormation: RequestHandler<
  {},
  {},
  { formation: Formation; address: Address }
> = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const {
      address: { city, department, country },
      formation: { title, description, level, start_date, end_date },
    } = req.body;

    if (!CREATE_FORMATION || !CREATE_ADDRESS) {
      res.status(500).send(handleError("Sql request is not defined"));
      return;
    } else if (!user || user.role_id !== 2) {
      res
        .status(401)
        .send(
          handleError("Unauthorized or session expired", "Unauthorized access")
        );
      return;
    }

    const [newAddress] = await pool.query<RowDataPacket[] & OkPacketParams>(
      CREATE_ADDRESS,
      [city, department, country]
    );

    const address_id = newAddress.insertId;

    const [newFormation] = await pool.query<RowDataPacket[] & OkPacketParams>(
      CREATE_FORMATION,
      [title, description, level, start_date, end_date, address_id]
    );

    const formation_id = newFormation.insertId;

    loggedHandleSuccess("New formation added !", {
      formation: {
        id: formation_id,
        title,
        description,
        level,
        start_date,
        end_date,
      },
      address: {
        id: address_id,
        city,
        department,
        country,
      },
    });

    res.status(201).json(
      handleSuccess("New formation added !", {
        formation: {
          id: formation_id,
          title,
          description,
          level,
          start_date,
          end_date,
        },
        address: {
          id: address_id,
          city,
          department,
          country,
        },
      })
    );
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};

export const updateFormation: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;

    const { id } = req.params;

    if (!UPDATE_FORMATION) {
      res.status(500).send(handleError("Sql request is not defined"));
      return;
    } else if (!user || user.role_id !== 2) {
      res
        .status(401)
        .send(
          handleError("Unauthorized or session expired", "Unauthorized access")
        );
      return;
    } else if (!id) {
      res.status(400).send(handleError("Id required !", "Missing item !"));
      return;
    }
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};

export const deleteFormation: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;

    if (!DELETE_FORMATION) {
      res.status(500).send(handleError("Sql request is not defined"));
      return;
    } else if (!user || user.role_id !== 2) {
      res
        .status(401)
        .send(
          handleError("Unauthorized or session expired", "Unauthorized access")
        );
      return;
    }
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};
