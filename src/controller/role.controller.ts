import { Request, Response } from "express";
import { getAllRoles } from "../models/role.model";

export async function getRoles(req: Request, res: Response) {
  try {
    const roles = await getAllRoles();
    res.json({
      success: true,
      data: roles,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy roles",
      error: (err as Error).message,
    });
  }
}
