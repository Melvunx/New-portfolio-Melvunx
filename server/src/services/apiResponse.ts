import {
  handleResponseError,
  handleResponseSuccess,
} from "@/utils/handleResponse";
import { Response } from "express";

class ApiResponse {
  constructor() {}

  success(
    response: Response,
    status: "Ok" | "Created",
    data?: any,
    message = "Request succeded"
  ) {
    let code: number;
    switch (status) {
      case "Created":
        code = 201;
        break;
      default:
        code = 200;
        break;
    }

    response.status(code).json(handleResponseSuccess(data, message));
  }

  error(
    response: Response,
    status:
      | "Internal Server Error"
      | "Unauthorized"
      | "Not Found"
      | "Bad Request"
      | "Forbidden",
    error?: any,
    message = "Request failed"
  ) {
    let code: number;
    switch (status) {
      case "Bad Request":
        code = 400;
        break;
      case "Not Found":
        code = 404;
        break;
      case "Unauthorized":
        code = 401;
        break;
      case "Forbidden":
        code = 403;
        break;
      default:
        code = 500;
        break;
    }

    response.status(code).json(handleResponseError(error, message));
  }
}

const apiReponse = new ApiResponse();

export default apiReponse;
