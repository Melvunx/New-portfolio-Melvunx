import { prisma } from "@/config/prisma";
import apiReponse from "@/services/apiResponse";
import isArrayOrIsEmpty from "@/utils/isArrayOrEmpty";
import { Account, Address, Experience } from "@prisma/client";

import { RequestHandler } from "express";

const { ADMIN_ID, TARGET_TYPE_ID } = process.env;

if (!ADMIN_ID || !TARGET_TYPE_ID) {
  throw new Error("Ids not found");
}

export const getExperiences: RequestHandler = async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany();

    const isEmptyExperiences = isArrayOrIsEmpty(experiences);

    return apiReponse.success(
      res,
      "Ok",
      isEmptyExperiences ? experiences : null
    );
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
      experience: { title, tasks, skills },
    } = req.body;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );
    else if (!city || !department || !country || !title || !tasks || !skills)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Missing required fields")
      );

    const address = await prisma.address.create({
      data: {
        city,
        department,
        country,
      },
    });

    const experience = await prisma.experience.create({
      data: {
        title,
        tasks,
        skills,
        targetTypeId: TARGET_TYPE_ID,
        addressId: address.id,
      },
    });

    return apiReponse.success(res, "Created", experience);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const updateExperience: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { addressId, experienceId } = req.params;

    const {
      address: { city, department, country },
      experience: { title, tasks, skills },
    } = req.body;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );
    else if (!experienceId || !addressId)
      return apiReponse.error(res, "Not Found", new Error("Id not found"));
    else if (!city || !department || !country || !title || !tasks || !skills)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Missing required fields")
      );

    const experience = await prisma.experience.update({
      where: {
        id: experienceId,
        addressId,
      },
      data: {
        title,
        tasks,
        skills,
        address: {
          create: {
            city,
            department,
            country,
          },
        },
      },
    });

    return apiReponse.success(res, "Ok", experience);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const deleteExperience: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { addressId, experienceId } = req.params;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );
    else if (!experienceId || !addressId)
      return apiReponse.error(res, "Not Found", new Error("Id not found"));

    const experience = await prisma.experience.delete({
      where: {
        id: experienceId,
        addressId,
      },
    });

    return apiReponse.success(
      res,
      "Ok",
      null,
      `Experience with the id ${experience.id} has been deleted`
    );
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const deletedManyExperiences: RequestHandler<
  {},
  {},
  { addressIds: string[]; experienceIds: string[] }
> = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { addressIds, experienceIds } = req.body;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    if (!isArrayOrIsEmpty(addressIds) || !isArrayOrIsEmpty(experienceIds))
      return apiReponse.error(res, "Unauthorized", new Error("Ids required"));

    const experiences = await prisma.experience.deleteMany({
      where: {
        id: { in: experienceIds },
        addressId: { in: addressIds },
      },
    });

    return apiReponse.success(
      res,
      "Ok",
      null,
      `Experiences deleted ${experiences.count}`
    );
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};
