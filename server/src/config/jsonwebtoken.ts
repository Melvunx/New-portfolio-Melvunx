import colors from "@/schema/colors.schema";
import jwt, { JwtPayload } from "jsonwebtoken";

const { SECRETKEY, EXPIREDATE } = process.env;

if (!SECRETKEY || !EXPIREDATE) {
  throw new Error("SECRETKEY or EXPIREDATE is not defined");
}

export const generateToken = (email: string) => {
  return jwt.sign({ email }, SECRETKEY, {
    expiresIn: Number(EXPIREDATE) || 3600,
  });
};

export const verifyToken = async <T>(token: string) => {
  try {
    const decoded = await jwt.verify(token, SECRETKEY);

    console.log(colors.info("Decoded value : ", decoded));

    return decoded as JwtPayload & T;
  } catch (error) {
    console.log(colors.error(error));
    return null;
  }
};
