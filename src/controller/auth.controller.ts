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
export const getAllAccount = async (req: Request, res: Response) => {
  try {
    const accounts = await AccountModel.getAllAccount();

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({ message: "Không có tài khoản nào." });
    }

    return res.status(200).json({
      message: "Lấy danh sách tài khoản thành công.",
      data: accounts,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tài khoản:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};
export const getOneAccount = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const accounts = await AccountModel.getOneAccount(id);

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản ." });
    }

    return res.status(200).json({
      message: "Lấy tài khoản thành công.",
      data: accounts,
    });
  } catch (error) {
    console.error("Lỗi khi lấy tài khoản:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};

export const updateAccount = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, full_name, phoneNumber, roleID, status } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Thiếu ID nhân viên." });
    }

    await AccountModel.updateAccount(id, {
      name,
      full_name,
      phoneNumber,
      roleID,
      status,
    });

    const updated = await AccountModel.getOneAccount(id);
    res.status(200).json({
      message: "Cập nhật tài khoản thành công.",
      data: updated[0],
    });
  } catch (error) {
    console.error("❌ Lỗi updateAccount:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật tài khoản." });
  }
};
