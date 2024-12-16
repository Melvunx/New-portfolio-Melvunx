import { getUserProfile } from "@/controller/user.controller";
import { Request, Response } from "express";

const mockRequest = {
  userCookie: {
    id: 1,
    username: "testUser",
    name: "test",
    lastname: "testln",
    email: "test@example.com",
    role_id: 1,
  },
} as unknown as Request;

const mockResponse = {
  send: jest.fn(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;

const mockNext = () => {};

describe("get user profile", () => {
  it("should return user profile", async () => {
    getUserProfile(mockRequest, mockResponse, mockNext);

  });
});
