// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey123";

export interface AuthRequest extends Request {
  user?: { id: number; username: string };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Không có token xác thực" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number; username: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token không hợp lệ hoặc hết hạn" });
  }
};
