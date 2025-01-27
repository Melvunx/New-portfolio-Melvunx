import { prisma } from "@/config/prisma";
import apiReponse from "@/services/apiResponse";
import { Account, Address, Experience } from "@prisma/client";

import generator from "@services/generator.services";
import { RequestHandler } from "express";

const { ADMIN_ID } = process.env;

export const getExperiences: RequestHandler = async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany();

    return apiReponse.success(res, "Ok", experiences);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const getExperienceId: RequestHandler<{ experienceId: string }> = async (
  req,
  res
) => {
  try {
    const { experienceId } = req.params;

    if (!experienceId)
      return apiReponse.error(res, "Not Found", new Error("Id not found"));

    const experience = await prisma.experience.findUnique({
      where: {
        id: experienceId,
      },
    });

    if (!experience)
      return apiReponse.error(
        res,
        "Not Found",
        new Error("Experience not found")
      );

    return apiReponse.success(res, "Ok", experience);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
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

    if (!user || user.role_id !== ADMIN_ID) {
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

    await updateDateTime("experience", exp_id);

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
