import { prisma } from "@/config/prisma";
import apiReponse from "@/services/apiResponse";
import { LoggedResponseSuccess } from "@/utils/handleResponse";
import isArrayOrIsEmpty from "@/utils/isArrayOrEmpty";
import { Account } from "@prisma/client";
import { RequestHandler } from "express";

export const getUserProfile: RequestHandler = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;

    if (!user)
      return apiReponse.error(
        res,
        "Bad Request",
        new Error("Unauthorized or session expired")
      );

    const account = await prisma.account.findUniqueOrThrow({
      where: { id: user.id },
      include: {
        _count: {
          select: {
            reactions: true,
          },
        },
        reactions: {
          include: {
            reaction: true,
          },
        },
      },
    });

    return apiReponse.success(res, "Ok", account);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};

export const getUserSearch: RequestHandler<
  {},
  {},
  {},
  { search: string }
> = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search)
      return apiReponse.error(
        res,
        "Not Found",
        new Error("Search text not found")
      );

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            technologies: {
              some: {
                technology: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        ],
      },
    });

    const experiences = await prisma.experience.findMany({
      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            tasks: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            skills: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    const formations = await prisma.formation.findMany({
      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            level: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    const aboutMe = await prisma.aboutMe.findMany({
      where: {
        OR: [
          {
            linkedInUrl: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            githubUrl: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    const searchArray = [
      ...aboutMe,
      ...projects,
      ...formations,
      ...experiences,
    ];

    LoggedResponseSuccess(searchArray);

    const isNotEmpty = isArrayOrIsEmpty(searchArray);

    return apiReponse.success(res, "Ok", isNotEmpty ? searchArray : null);
  } catch (error) {
    return apiReponse.error(res, "Internal Server Error", error);
  }
};
