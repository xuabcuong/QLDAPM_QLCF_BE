// src/controller/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AccountModel from "../models/account.model";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Đăng ký
export const register = async (req: Request, res: Response) => {
  try {
    const { name, password, full_name, phoneNumber, roleID } = req.body;

    const existingUser = await AccountModel.findByName(name);
    if (existingUser) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await AccountModel.create({
      name,
      passwordHash: hashedPassword,
      full_name,
      phoneNumber,
      roleID,
    });

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};

// Đăng nhập
export const login = async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body;

    const user = await AccountModel.findByName(name);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
    }

    const token = jwt.sign({ id: user.id, roleID: user.roleID }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      message: "Đăng nhập thành công",
      token: token,
      roleID: user.roleID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};
