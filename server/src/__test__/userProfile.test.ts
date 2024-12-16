import { getUserProfile } from "@/controller/user.controller";
import { handleSuccess } from "@/utils/handleMessageSuccess";
import { handleError } from "@utils/handleMessageError";
import { Request, Response } from "express";

// Mock des objets Request et Response
const mockRequest = (cookies: any) => {
  return {
    cookies,
  } as unknown as Request;
};

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn();
  res.json = jest.fn();
  return res as Response;
};

const mockNext = jest.fn();

describe("getUserProfile", () => {
  it("should return user profile when user cookie is present", async () => {
    // Mock des cookies avec un utilisateur
    const userCookie = {
      id: 1,
      username: "testUser",
      name: "test",
      lastname: "testln",
      email: "test@example.com",
      role_id: 1,
    };

    const req = mockRequest({ userCookie }); // Ajouter le cookie
    const res = mockResponse();

    // Appel de la fonction à tester
    await getUserProfile(req, res, mockNext);

    // Vérifications
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      handleSuccess("User profile", expect.any(Object))
    );
  });

  it("should return 401 when no user cookie is present", async () => {
    const req = mockRequest({}); // Pas de cookie
    const res = mockResponse();

    await getUserProfile(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith(
      handleError(
        "User not found or session expired",
        "You are not logged in !"
      )
    );
  });
});
