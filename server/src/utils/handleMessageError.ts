import colors from "@/models/colors.models";

export const handleError = (error?: any, detail?: string) => {
  return {
    success: false,
    message: `An error occured ! ${detail ?? ""}`,
    error: error ?? "Error not filled in",
  };
};

export const loggedHandleError = (error?: any, detail?: string) =>
  console.log(colors.error(handleError(error, detail)));
