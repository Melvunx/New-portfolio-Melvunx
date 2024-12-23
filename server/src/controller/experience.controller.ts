import pool from "@config/database";
import { Address, Experience } from "@schema/aboutMe.schema";
import { Account } from "@schema/account.schema";
import { Generator } from "@services/generator.services";
import { checkAffectedRow } from "@services/handleAffectedRows.services";
import { handleError, loggedHandleError } from "@utils/handleMessageError";
import {
  handleSuccess,
  loggedHandleSuccess,
} from "@utils/handleMessageSuccess";
import { RequestHandler } from "express";
import { OkPacketParams, RowDataPacket } from "mysql2";

const {
  GET_EXPERIENCES,
  GET_EXPERIENCE_ID,
  CREATE_EXPERIENCE,
  UPDATE_EXPERIENCE,
  DELETE_EXPERIENCE,
  CREATE_ADDRESS,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
  ADMIN_ID,
} = process.env;

export const getExperiences: RequestHandler = async (req, res) => {
  try {
    if (!GET_EXPERIENCES) {
      res.status(500).send(handleError("Sql request is not defined"));
      return;
    }

    const [experiences] = await pool.query(GET_EXPERIENCES);
    loggedHandleSuccess("Get all experiences", experiences);
    res.status(200).json(handleSuccess("Get all experiences", experiences));
  } catch (error) {
    loggedHandleError(error);
    res.status(500).send(handleError(error));
    return;
  }
};

export const getExperienceId: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!GET_EXPERIENCE_ID) {
      res.status(500).send(handleError("Sql request is not defined"));
      return;
    } else if (!id) {
      res.status(400).send(handleError("Id required !", "Missing item !"));
      return;
    }

    const [experience] = await pool.query(GET_EXPERIENCE_ID, [id]);

    loggedHandleSuccess("Get experience by id", experience);
    res.status(200).json(handleSuccess("Get experience by id", experience));
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};

export const createNewExperience: RequestHandler<
  {},
  {},
  { experience: Experience; address: Address }
> = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const {
      address: { city, department, country },
      experience: { title, task, skills },
    } = req.body;

    if (!CREATE_EXPERIENCE || !CREATE_ADDRESS || !ADMIN_ID) {
      res.status(500).send(handleError("Sql request is not defined"));
      return;
    } else if (!user || user.role_id !== ADMIN_ID) {
      res
        .status(401)
        .send(
          handleError("Unauthorized or session expired", "Unauthorized access")
        );
      return;
    } else if (!city || !department || !country || !title || !task || !skills) {
      res.status(400).send(handleError("Missing required fields"));
      return;
    }

    const generator = new Generator(14);
    const addressId = generator.generateIds();
    const experienceId = generator.generateIds();

    const [newAddress] = await pool.query<RowDataPacket[] & OkPacketParams>(
      CREATE_ADDRESS,
      [addressId, city, department, country]
    );

    checkAffectedRow(newAddress);

    const [newExperience] = await pool.query<RowDataPacket[] & OkPacketParams>(
      CREATE_EXPERIENCE,
      [experienceId, title, task, skills, addressId]
    );

    if (newExperience.affectedRows === 0) {
      res.status(500).send(handleError("Error creating experience"));
      return;
    }

    loggedHandleSuccess("New experience added!", {
      experience: { id: experienceId, title, task, skills },
      address: { id: addressId, city, department, country },
    });
    res.status(201).json(
      handleSuccess("New experience added!", {
        experience: { id: experienceId, title, task, skills },
        address: { id: addressId, city, department, country },
      })
    );
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};

export const updateExperience: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { add_id, exp_id } = req.params;

    const {
      address: { city, department, country },
      experience: { title, task, skills },
    } = req.body;

    if (!UPDATE_EXPERIENCE || !UPDATE_ADDRESS || !ADMIN_ID) {
      res.status(500).send(handleError("Sql request is not defined"));
      return;
    } else if (!user || user.role_id !== ADMIN_ID) {
      res
        .status(401)
        .send(
          handleError("Unauthorized or session expired", "Unauthorized access")
        );
      return;
    } else if (!exp_id || !add_id) {
      res.status(400).send(handleError("Id required !", "Missing item !"));
      return;
    } else if (!city || !department || !country || !title || !task || !skills) {
      res
        .status(400)
        .send(handleError("Missing credentials", "Undefined element !"));
      return;
    }

    const [updateAddress] = await pool.query<RowDataPacket[] & OkPacketParams>(
      UPDATE_ADDRESS,
      [city, department, country, add_id]
    );

    checkAffectedRow(updateAddress);

    const [updateExp] = await pool.query<RowDataPacket[] & OkPacketParams>(
      UPDATE_EXPERIENCE,
      [title, task, skills, exp_id]
    );

    checkAffectedRow(updateExp);

    loggedHandleSuccess("Experience modified !", {
      address: { id: add_id, city, department, country },
      experience: { id: exp_id, title, task, skills },
    });

    res.status(200).json(
      handleSuccess("Experience modified !", {
        address: { id: add_id, city, department, country },
        experience: { id: exp_id, title, task, skills },
      })
    );
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};

export const deleteExperience: RequestHandler = async (req, res) => {
  try {
    const { exp_id, add_id } = req.params;
    const user: Account = req.cookies.userCookie;

    if (
      !DELETE_EXPERIENCE ||
      !DELETE_ADDRESS ||
      !GET_EXPERIENCE_ID ||
      !ADMIN_ID
    ) {
      res.status(500).send(handleError("Sql request is not defined"));
      return;
    } else if (!user || user.role_id !== ADMIN_ID) {
      res
        .status(401)
        .send(
          handleError("Unauthorized or session expired", "Unauthorized access")
        );
      return;
    } else if (!exp_id || !add_id) {
      res.status(400).send(handleError("Id required !", "Missing item !"));
      return;
    }

    const [deletedAddress] = await pool.query<RowDataPacket[] & OkPacketParams>(
      DELETE_ADDRESS,
      [add_id]
    );

    checkAffectedRow(deletedAddress);

    console.log("Address deleted! Check experience in progress...");

    const [checkExpDeleted] = await pool.query<RowDataPacket[] & Experience>(
      GET_EXPERIENCE_ID,
      [exp_id]
    );

    if (checkExpDeleted.length > 0) {
      console.log("Experience not deleted ! suppression in progress...");
      const [deletedExp] = await pool.query<RowDataPacket[] & OkPacketParams>(
        DELETE_EXPERIENCE,
        [exp_id]
      );

      checkAffectedRow(deletedExp);

      console.log("Experience deleted !");
    }

    console.log("Address and Experience deleted !");

    loggedHandleSuccess("Experience deleted !", `Exp with the id ${exp_id}`);
    res
      .status(200)
      .json(handleSuccess("Experience deleted !", `Exp with the id ${exp_id}`));
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};
