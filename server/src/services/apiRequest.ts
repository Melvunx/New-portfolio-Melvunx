import isArrayOrIsEmpty from "@/utils/isArrayOrEmpty";
import { Request, Response } from "express";
import apiReponse from "./apiResponse";

class ApiRequest {
  constructor() {}

  async getAll(prismaRequest: Promise<unknown[]>) {
    return async (request: Request, response: Response) => {
      try {
        const data = await prismaRequest;
        const isNotEmpty = isArrayOrIsEmpty(data);

        return apiReponse.success(response, "Ok", isNotEmpty ? data : null);
      } catch (error) {
        return apiReponse.error(response, "Internal Server Error", error);
      }
    };
  }
}

const apiRequest = new ApiRequest();

export default apiRequest;
