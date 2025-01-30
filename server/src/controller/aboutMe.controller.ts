import apiReponse from "@/services/apiResponse";
import { prisma } from "@config/prisma";
import { AboutMe, Account, Address, OngoingFormation } from "@prisma/client";
import { RequestHandler } from "express";

export const getInfoAboutMe: RequestHandler = async (req, res) => {
  try {
    const info = await prisma.aboutMe.findFirst({
      include: {
        address: true,
        ongoingFormation: true,
      },
    });

    if (!info)
      return apiReponse.error(
        res,
        "Not Found",
        new Error("Info about me not found")
      );

    return apiReponse.success(res, "Ok", info);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const createNewInfoAboutMe: RequestHandler<
  {},
  {},
  {
    aboutMe: AboutMe;
    onGoingFormation: OngoingFormation;
    aboutMe_address: Address;
    onGoingFormation_Address: Address;
  }
> = async (req, res) => {
  try {
    const user: Account | undefined = req.cookies.userCookie;

    const {
      aboutMe_address: {
        city: aboutMe_city,
        department: aboutMe_department,
        country: aboutMe_country,
        postalCode: aboutMe_postalCode,
      },
      onGoingFormation_Address: {
        city: onGoingFormation_city,
        department: onGoingFormation_department,
        country: onGoingFormation_country,
        postalCode: OnGoingFormation_postalCode,
      },
      aboutMe: { linkedInUrl, githubUrl, introductionText },
      onGoingFormation: { name, description, rythme, sector, duration },
    } = req.body;

    if (!user) return apiReponse.error(res, "Unauthorized");
    else if (
      !aboutMe_city ||
      !aboutMe_department ||
      !aboutMe_country ||
      !onGoingFormation_city ||
      !onGoingFormation_department ||
      !onGoingFormation_country ||
      !name ||
      !description ||
      !rythme ||
      !sector ||
      !duration ||
      !introductionText ||
      !githubUrl ||
      !linkedInUrl
    )
      return apiReponse.error(res, "Bad Request", new Error("Missing fiels"));

    const infoAboutMe = await prisma.aboutMe.create({
      data: {
        introductionText,
        githubUrl,
        linkedInUrl,
        address: {
          create: {
            city: aboutMe_city,
            department: aboutMe_department,
            country: aboutMe_country,
            postalCode: aboutMe_postalCode ?? null,
          },
        },
        ongoingFormation: {
          create: {
            name,
            description,
            rythme,
            sector,
            duration,
            address: {
              create: {
                city: onGoingFormation_city,
                department: onGoingFormation_department,
                country: onGoingFormation_country,
                postalCode: OnGoingFormation_postalCode ?? null,
              },
            },
          },
        },
      },
    });

    return apiReponse.success(res, "Created", infoAboutMe);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const editAboutMe: RequestHandler<
  { about_meId: string },
  {},
  {
    aboutMe: AboutMe;
    onGoingFormation: OngoingFormation;
    aboutMe_address: Address;
    onGoingFormation_Address: Address;
  }
> = async (req, res) => {
  try {
    const { about_meId } = req.params;
    const user: Account | undefined = req.cookies.userCookie;
    const {
      aboutMe_address: {
        city: aboutMe_city,
        department: aboutMe_department,
        country: aboutMe_country,
        postalCode: aboutMe_postalCode,
      },
      onGoingFormation_Address: {
        city: onGoingFormation_city,
        department: onGoingFormation_department,
        country: onGoingFormation_country,
        postalCode: OnGoingFormation_postalCode,
      },
      aboutMe: { linkedInUrl, githubUrl, introductionText },
      onGoingFormation: { name, description, rythme, sector, duration },
    } = req.body;

    if (!user) return apiReponse.error(res, "Unauthorized");
    else if (!about_meId)
      return apiReponse.error(res, "Not Found", new Error("Id not found"));
    else if (
      !aboutMe_city ||
      !aboutMe_department ||
      !aboutMe_country ||
      !onGoingFormation_city ||
      !onGoingFormation_department ||
      !onGoingFormation_country ||
      !name ||
      !description ||
      !rythme ||
      !sector ||
      !duration ||
      !introductionText ||
      !githubUrl ||
      !linkedInUrl
    )
      return apiReponse.error(res, "Bad Request", new Error("Missing fiels"));

    const updatedInfo = await prisma.aboutMe.update({
      where: { id: about_meId },
      data: {
        introductionText,
        githubUrl,
        linkedInUrl,
        address: {
          create: {
            city: aboutMe_city,
            department: aboutMe_department,
            country: aboutMe_country,
            postalCode: aboutMe_postalCode ?? null,
          },
        },
        ongoingFormation: {
          create: {
            name,
            description,
            rythme,
            sector,
            duration,
            address: {
              create: {
                city: onGoingFormation_city,
                department: onGoingFormation_department,
                country: onGoingFormation_country,
                postalCode: OnGoingFormation_postalCode ?? null,
              },
            },
          },
        },
      },
    });

    return apiReponse.success(res, "Ok", updatedInfo);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const deleteAboutMe: RequestHandler<{ about_meId: string }> = async (
  req,
  res
) => {
  try {
    const { about_meId } = req.params;
    const user: Account | undefined = req.cookies.userCookie;
    if (!user) return apiReponse.error(res, "Unauthorized");
    else if (!about_meId)
      return apiReponse.error(res, "Not Found", new Error("Id not found"));

    const info = await prisma.aboutMe.delete({
      where: {
        id: about_meId,
      },
    });

    return apiReponse.success(
      res,
      "Ok",
      null,
      `The info ${info.githubUrl} is deleted`
    );
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};


