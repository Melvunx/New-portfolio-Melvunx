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
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
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
    const { add_id, form_id } = req.params;

    const {
      address: { city, department, country },
      formation: { title, description, level, start_date, end_date },
    } = req.body;

    if (!UPDATE_FORMATION || !UPDATE_ADDRESS) {
      res.status(500).send(handleError("Sql request is not defined"));
      return;
    } else if (!user || user.role_id !== 2) {
      res
        .status(401)
        .send(
          handleError("Unauthorized or session expired", "Unauthorized access")
        );
      return;
    } else if (!add_id || !form_id) {
      res.status(400).send(handleError("Id required !", "Missing item !"));
      return;
    } else if (
      !city ||
      !department ||
      !country ||
      !title ||
      !description ||
      !level ||
      !start_date ||
      !end_date
    ) {
      res
        .status(400)
        .send(handleError("Missing credentials", "Undefined element !"));
      return;
    }

    await pool.query(UPDATE_ADDRESS, [city, department, country, add_id]);

    await pool.query(UPDATE_FORMATION, [
      title,
      description,
      level,
      start_date,
      end_date,
      form_id,
    ]);

    loggedHandleSuccess("Formation modified", {
      address: { id: add_id, city, department, country },
      formation: {
        id: form_id,
        title,
        description,
        level,
        start_date,
        end_date,
      },
    });

    res.status(200).json(
      handleSuccess("Formation modified", {
        address: { id: add_id, city, department, country },
        formation: {
          id: form_id,
          title,
          description,
          level,
          start_date,
          end_date,
        },
      })
    );
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};

export const deleteFormation: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;

    const { add_id, form_id } = req.params;

    if (!DELETE_FORMATION || !DELETE_ADDRESS || !GET_FORMATION_ID) {
      res.status(500).send(handleError("Sql request is not defined"));
      return;
    } else if (!user || user.role_id !== 2) {
      res
        .status(401)
        .send(
          handleError("Unauthorized or session expired", "Unauthorized access")
        );
      return;
    } else if (!add_id || !form_id) {
      res.status(400).send(handleError("Missing id", "Missing parameters !"));
      return;
    }

    const [deletedAddress] = await pool.query<RowDataPacket[] & OkPacketParams>(
      DELETE_ADDRESS,
      [add_id]
    );

    if (deletedAddress.affectedRows === 0) {
      res.status(500).send(handleError("failed to deleted this address"));
      return;
    }

    console.log("Address deleted! Check experience in progress...");

    const [checkFormDeleted] = await pool.query<RowDataPacket[] & Formation>(
      GET_FORMATION_ID,
      [form_id]
    );

    console.log("Address deleted! Check formation in progress...");

    if (checkFormDeleted.length > 0) {
      console.log("Experience not deleted ! suppression in progress...");
      const [deletedForm] = await pool.query<RowDataPacket[] & OkPacketParams>(
        DELETE_FORMATION,
        [form_id]
      );
      if (deletedForm.affectedRows === 0) {
        res.status(500).send(handleError("failed to deleted this experience"));
        return;
      }
      console.log("Formation deleted !");
    }

    console.log("Address and Formation deleted !");

    loggedHandleSuccess(
      "Formation deleted !",
      `Formation with the id ${form_id}`
    );
    res
      .status(200)
      .json(
        handleSuccess("Formation deleted !", `Formation with the id ${form_id}`)
      );
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};
