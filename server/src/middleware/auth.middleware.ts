import { Account } from "@/schema/account.schema";
import colors from "@/schema/colors.schema";
import { handleError, loggedHandleError } from "@utils/handleMessageError";
import { RequestHandler } from "express";

export const userAuthentification: RequestHandler = (req, res, next) => {
  const user: Account = req.cookies.userCookie;
  console.log("Authentification in progress...");
  if (!user) {
    loggedHandleError("User not found or session expired");
    res
      .status(401)
      .json(
        handleError(
          "User not found or session expired",
          "You are not logged in"
        )
      );
    return;
  } else if (!req.isAuthenticated()) {
    loggedHandleError("Unauthorized");
    res.status(401).json(handleError("Unauthorized", "You are not logged in"));
    return;
  }
  console.log(colors.info(`User ${user.username} is authentificated`));
  req.sessionStore.get(req.sessionID, (error, sessionData) => {
    if (error) {
      loggedHandleError("Error while getting session data");
      res
        .status(500)
        .send(
          handleError(
            "Error while getting session data",
            "Internal server error"
          )
        );
    }
    console.log(colors.info({ session: sessionData?.cookie }));
  });
  res.status(200);
  next();
};

export const moderatorAuthentification: RequestHandler = (req, res, next) => {
  const user: Account = req.cookies.userCookie;

  if (!user) {
    loggedHandleError("User not found or session expired");
    res
      .status(401)
      .json(
        handleError(
          "User not found or session expired",
          "You are not logged in"
        )
      );
    return;
  }
  switch (user.role_id) {
    case 1: // Utilisateur
      loggedHandleError("Unauthorized", "You aren't the right");
      res.status(403).send(handleError("Unauthorized", "You aren't the right"));
      return;
    case 2: // Administrateur
      console.log(`Administrator ${user.username} is authentificated !`);
      return next();
    case 3: // Modérateur
      console.log(`Moderator ${user.username} is authentificated !`);
      return next();
    default:
      loggedHandleError("Unknown user role");
      res
        .status(403)
        .json(
          handleError("Unauthorized", "Access forbidden, unknown user role")
        );
      return;
  }
};

export const adminAuthentification: RequestHandler = (req, res, next) => {
  const user: Account = req.cookies.userCookie;

  if (!user) {
    loggedHandleError("User not found or session expired");
    res
      .status(401)
      .json(
        handleError(
          "User not found or session expired",
          "You are not logged in"
        )
      );
    return;
  } else if (user.role_id !== 2) {
    loggedHandleError("Unauthorized", "You aren't the right");
    res.status(401).send(handleError("Unauthorized"));
    return;
  }

  console.log(colors.info(`Admin ${user.username} authentificated !`));
  res.status(200);
  next();
};
