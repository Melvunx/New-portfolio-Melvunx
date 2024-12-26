import { Generator } from "@/services/generator.services";
import { checkAffectedRow } from "@/services/handleAffectedRows.services";
import pool from "@config/database";
import { AboutMe, Address, OnGoingFormation } from "@schema/aboutMe.schema";
import { Account } from "@schema/account.schema";
import { handleError, loggedHandleError } from "@utils/handleMessageError";
import {
  handleSuccess,
  loggedHandleSuccess,
} from "@utils/handleMessageSuccess";
import { RequestHandler } from "express";
import { OkPacketParams, RowDataPacket } from "mysql2";

const {
  SELECT_ABOUT_ME,
  CREATE_ABOUT_ME,
  CREATE_ON_GOING_FORMATION,
  CREATE_ADDRESS,
} = process.env;

export const getInfoAboutMe: RequestHandler<{}, {}, {}> = async (req, res) => {
  try {
    if (!SELECT_ABOUT_ME) {
      res
        .status(500)
        .send(handleError(new Error("Sql request is not defined")));
      return;
    }

    const [info] = await pool.query<RowDataPacket[] & AboutMe>(SELECT_ABOUT_ME);
    loggedHandleSuccess("Get info", info[0]);
    res.status(200).json(handleSuccess("Get info", info[0]));
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};

export const createNewInfoAboutMe: RequestHandler<
  {},
  {},
  {
    aboutMe: AboutMe;
    onGoingFormation: OnGoingFormation;
    aboutMe_address: Address;
    onGoingFormation_Address: Address;
  }
> = async (req, res) => {
  try {
    const user: Account = req.cookies.userCookie;

    const {
      aboutMe_address: {
        city: aboutMe_city,
        department: aboutMe_department,
        country: aboutMe_country,
      },
      onGoingFormation_Address: {
        city: onGoingFormation_city,
        department: onGoingFormation_department,
        country: onGoingFormation_country,
      },
      aboutMe: { linkedIn_url, introduction_text, github_url },
      onGoingFormation: { name, description, rythme, sector, duration },
    } = req.body;

    if (!CREATE_ADDRESS || !CREATE_ON_GOING_FORMATION || !CREATE_ABOUT_ME) {
      res
        .status(500)
        .send(handleError(new Error("Sql request is not defined")));
      return;
    } else if (!user) {
      res.status(401).send(handleError("User not found or session expired"));
      return;
    } else if (
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
      !introduction_text ||
      !github_url ||
      !linkedIn_url
    ) {
      res.status(400).send(handleError("Missing fields", "Undefined element"));
      return;
    }

    const generator = new Generator(14);
    const onGoingFormation_addressId = generator.generateIds();
    const aboutMe_addressId = generator.generateIds();
    const aboutMeId = generator.generateIds();
    const onGoingFormationId = generator.generateIds();

    const [newAddressOng] = await pool.query<RowDataPacket[] & OkPacketParams>(
      CREATE_ADDRESS,
      [
        onGoingFormation_addressId,
        onGoingFormation_city,
        onGoingFormation_department,
        onGoingFormation_country,
      ]
    );

    checkAffectedRow(newAddressOng);

    const [newAddressAbout] = await pool.query<
      RowDataPacket[] & OkPacketParams
    >(CREATE_ADDRESS, [
      aboutMe_addressId,
      aboutMe_city,
      aboutMe_department,
      aboutMe_country,
    ]);

    checkAffectedRow(newAddressAbout);

    const [newFormation] = await pool.query<RowDataPacket[] & OkPacketParams>(
      CREATE_ON_GOING_FORMATION,
      [
        onGoingFormationId,
        name,
        description,
        rythme,
        sector,
        duration,
        onGoingFormation_addressId,
      ]
    );

    checkAffectedRow(newFormation);

    const [newAboutMe] = await pool.query<RowDataPacket[] & OkPacketParams>(
      CREATE_ABOUT_ME,
      [
        aboutMeId,
        linkedIn_url,
        introduction_text,
        github_url,
        onGoingFormationId,
        aboutMe_addressId,
      ]
    );

    checkAffectedRow(newAboutMe);

    loggedHandleSuccess("AboutMe added !", {
      aboutMe_address: {
        id: aboutMe_addressId,
        city: aboutMe_city,
        department: aboutMe_department,
        country: aboutMe_country,
      },
      onGoingFormation_Address: {
        id: onGoingFormation_addressId,
        city: onGoingFormation_city,
        department: onGoingFormation_department,
        country: onGoingFormation_country,
      },
      onGoingFormation: {
        id: onGoingFormationId,
        name,
        description,
        rythme,
        sector,
        duration,
      },
      aboutMe: { id: aboutMeId, linkedIn_url, introduction_text, github_url },
    });
    res.status(201).send(
      handleSuccess("AboutMe added !", {
        aboutMe_address: {
          id: aboutMe_addressId,
          city: aboutMe_city,
          department: aboutMe_department,
          country: aboutMe_country,
        },
        onGoingFormation_Address: {
          id: onGoingFormation_addressId,
          city: onGoingFormation_city,
          department: onGoingFormation_department,
          country: onGoingFormation_country,
        },
        onGoingFormation: {
          id: onGoingFormationId,
          name,
          description,
          rythme,
          sector,
          duration,
        },
        aboutMe: { id: aboutMeId, linkedIn_url, introduction_text, github_url },
      })
    );
  } catch (error) {
    loggedHandleError(error, "Error caught");
    res.status(500).send(handleError(error, "Error caught"));
    return;
  }
};
