import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const isAuthenticated = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { authorization } = request.headers as { authorization: string };
  if (!authorization || !authorization.startsWith("Bearer")) {
    throw new Error("User not authenticated");
  }
  const token = authorization.split(" ")[1];
  if (!token) return response.status(500).json("No token provided");
  if (!process.env.JWT_SECRET) throw new Error("Env variable not loaded");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const { id } = decoded as { id: string };

    request.user = { id };
    return next();
  } catch (error) {
    throw new Error(error.message);
  }
};
export default isAuthenticated;
