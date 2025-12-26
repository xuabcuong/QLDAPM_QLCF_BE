// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey123";

export interface AuthRequest extends Request {
  user?: { id: number; roleID: number }; // ⚡ Cập nhật lại theo payload thật
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Không có token xác thực" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(token, SECRET_KEY) as {
      id: number;
      roleID: number;
    };

    // Lưu thông tin user vào request
    req.user = decoded;

    next(); // Cho phép đi tiếp đến controller
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token đã hết hạn, vui lòng đăng nhập lại" });
    }
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};
