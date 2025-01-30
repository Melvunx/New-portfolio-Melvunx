import { prisma } from "@/config/prisma";
import apiReponse from "@/services/apiResponse";
import isArrayOrIsEmpty from "@/utils/isArrayOrEmpty";
import { Account, Address, Formation } from "@prisma/client";

import { RequestHandler } from "express";

const { ADMIN_ID, TARGET_TYPE_ID_FORMATION } = process.env;

if (!ADMIN_ID || !TARGET_TYPE_ID_FORMATION) {
  throw new Error("Ids not found");
}

export const getFormations: RequestHandler = async (req, res) => {
  try {
    const formations = await prisma.formation.findMany();

    const isEmptyFormations = isArrayOrIsEmpty(formations);

    return apiReponse.success(res, "Ok", isEmptyFormations ? formations : null);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const getFormationId: RequestHandler<{ formationId: string }> = async (
  req,
  res
) => {
  try {
    const { formationId } = req.params;

    if (!formationId)
      return apiReponse.error(res, "Not Found", new Error("Id not found"));

    const formation = await prisma.formation.findUnique({
      where: {
        id: formationId,
      },
    });

    if (!formation)
      return apiReponse.error(
        res,
        "Not Found",
        new Error("Experience not found")
      );

    return apiReponse.success(res, "Ok", formation);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
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
      formation: { title, description, level, startDate, endDate },
    } = req.body;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );
    else if (
      !city ||
      !department ||
      !country ||
      !title ||
      !description ||
      !level ||
      !startDate ||
      !endDate
    )
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

    const formation = await prisma.formation.create({
      data: {
        title,
        description,
        level,
        startDate,
        endDate,
        targetTypeId: TARGET_TYPE_ID_FORMATION,
        addressId: address.id,
      },
    });

    return apiReponse.success(res, "Created", formation);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const updateFormation: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { addressId, formationId } = req.params;

    const {
      address: { city, department, country },
      formation: { title, description, level, startDate, endDate },
    } = req.body;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );
    else if (!formationId || !addressId)
      return apiReponse.error(res, "Not Found", new Error("Id not found"));
    else if (
      !city ||
      !department ||
      !country ||
      !title ||
      !description ||
      !level ||
      !startDate ||
      !endDate
    )
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Missing required fields")
      );

    const formation = await prisma.formation.update({
      where: {
        id: formationId,
        addressId,
      },
      data: {
        title,
        description,
        level,
        startDate,
        endDate,
        address: {
          create: {
            city,
            department,
            country,
          },
        },
      },
    });

    return apiReponse.success(res, "Ok", formation);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const deleteFormation: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { addressId, formationId } = req.params;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    if (!formationId || !addressId)
      return apiReponse.error(res, "Not Found", new Error("Id not found"));

    const formation = await prisma.formation.delete({
      where: {
        id: formationId,
        addressId,
      },
    });

    return apiReponse.success(
      res,
      "Ok",
      null,
      `Formation with the id ${formation.id} has been deleted`
    );
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const deletedManyFormations: RequestHandler<
  {},
  {},
  { addressIds: string[]; formationIds: string[] }
> = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;
    const { addressIds, formationIds } = req.body;

    if (!user || user.roleId !== ADMIN_ID)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    if (!isArrayOrIsEmpty(addressIds) || !isArrayOrIsEmpty(formationIds))
      return apiReponse.error(res, "Unauthorized", new Error("Ids required"));

    const formations = await prisma.formation.deleteMany({
      where: {
        id: { in: formationIds },
        addressId: { in: addressIds },
      },
    });

    return apiReponse.success(
      res,
      "Ok",
      null,
      `Experiences deleted ${formations.count}`
    );
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};
