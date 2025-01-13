import colors from "@/schema/colors.schema";
import { z } from "zod";

export const handleError = (error?: any, detail?: string) => {
  const isErrorObject = error instanceof Error;
  return {
    success: false,
    message: `An error occured ! ${detail ?? ""}`,
    error: isErrorObject
      ? error.message
      : error
        ? error
        : "Error not filled in",
    stack: isErrorObject ? error.stack : undefined,
  };
};

export const loggedHandleError = (error?: any, detail?: string) =>
  console.log(colors.error(handleError(error, detail)));

