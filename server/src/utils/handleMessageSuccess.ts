import colors from "@schema/colors.schema";

export const handleSuccess = (detail?: string, data?: any) => {
  return {
    success: true,
    message: `Request succeded ! ${detail ?? ""}`,
    data: data ?? "No data resend",
  };
};

export const loggedHandleSuccess = (detail?: string, data?: any) =>
  console.log(colors.success(handleSuccess(detail, data)));
