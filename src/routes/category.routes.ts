import { Router } from "express";
import upload from "../middleware/upload";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/category.controller";

const router = Router();
router.get("/get_all", getCategories);
router.get("/:id", getCategoryById);
router.post("/categories", upload.single("image"), createCategory); // Thêm có upload ảnh
router.put("/:id", upload.single("image"), updateCategory); // Sửa có upload ảnh
router.delete("/:id", deleteCategory);

export default router;
