// src/controllers/table.controller.ts
import { Request, Response } from "express";
import TableModel from "../models/table.model";

// Lấy tất cả bàn
export const getTables = async (req: Request, res: Response) => {
  try {
    const tables = await TableModel.getAll();
    res.json(tables);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bàn:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy bàn theo ID
export const getTableById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const table = await TableModel.getById(id);

    if (!table) {
      return res.status(404).json({ message: "Không tìm thấy bàn" });
    }

    res.json(table);
  } catch (error) {
    console.error("Lỗi khi lấy bàn:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tạo bàn mới
export const createTable = async (req: Request, res: Response) => {
  try {
    const newTable = req.body;

    if (!newTable.tableNumber) {
      return res.status(400).json({ message: "Thiếu số bàn (tableNumber)" });
    }

    const id = await TableModel.create(newTable);
    res.status(201).json({ id, ...newTable });
  } catch (error) {
    console.error("Lỗi khi tạo bàn:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
export const updateTableStatus = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.params;

    if (!status) {
      return res.status(400).json({ message: "Thiếu trạng thái (status)" });
    }

    const updated = await TableModel.updateStatus(Number(id), status);

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy bàn" });
    }

    res.json({ message: "Cập nhật trạng thái thành công", id, status });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái bàn:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
