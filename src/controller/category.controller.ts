import { Request, Response } from "express";
import CategoryModel from "../models/categories.model";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.getAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const category = await CategoryModel.getById(id);
    if (!category) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name)
      return res.status(400).json({ message: "Tên không được bỏ trống" });

    // Nếu có upload ảnh
    const imageURL = req.file ? (req.file as any).path : null;

    const result = await CategoryModel.create({ name, description, imageURL });
    res.status(201).json({ message: "Thêm thành công", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    // Nếu có upload ảnh mới → lấy link Cloudinary
    const imageURL = req.file ? (req.file as any).path : undefined;

    const result = await CategoryModel.update(id, {
      name,
      description,
      imageURL,
    });
    res.json({ message: "Cập nhật thành công", result });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await CategoryModel.delete(id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};
