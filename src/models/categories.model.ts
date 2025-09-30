import pool from "../config/db";

export interface Category {
  id?: number;
  name: string;
  description?: string;
  imageURL?: string;
}

const CategoryModel = {
  // Lấy tất cả
  getAll: async (): Promise<Category[]> => {
    const [rows] = await pool.query("SELECT * FROM categories");
    return rows as Category[];
  },

  // Lấy theo id
  getById: async (id: number): Promise<Category | null> => {
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    const result = rows as Category[];
    return result.length ? result[0] : null;
  },

  // Thêm
  create: async (category: Category): Promise<any> => {
    const { name, description, imageURL } = category;
    const [result] = await pool.query(
      "INSERT INTO categories (name, description, imageURL) VALUES (?, ?, ?)",
      [name, description, imageURL]
    );
    return result;
  },

  // Sửa
  update: async (id: number, category: Category): Promise<any> => {
    const { name, description, imageURL } = category;
    const [result] = await pool.query(
      "UPDATE categories SET name = ?, description = ?, imageURL = ? WHERE id = ?",
      [name, description, imageURL, id]
    );
    return result;
  },

  // Xóa
  delete: async (id: number): Promise<any> => {
    const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [
      id,
    ]);
    return result;
  },
};

export default CategoryModel;
