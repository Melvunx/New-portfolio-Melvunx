import {
  ApiResponseError,
  ApiResponseSuccess,
} from "@schema/apiResponse.schema";

export function handleResponseSuccess(
  data?: any,
  message = "Request succeded"
): ApiResponseSuccess {
  return {
    success: true,
    message,
    data: data ? data : null,
  };
}

export function handleResponseError(
  error?: any,
  message = "Request failed"
): ApiResponseError {
  const isErrorObject = error instanceof Error;
  return {
    success: false,
    message,
    error: isErrorObject ? error.message : error ? error : "An error occured",
    stack: isErrorObject ? error.stack : undefined,
  };
}

export const LoggedResponseSuccess = (data?: any, message?: string) =>
  console.log(handleResponseSuccess(data, message));

export const LoggedResponseError = (error?: any) =>
  console.log(handleResponseError(error));
