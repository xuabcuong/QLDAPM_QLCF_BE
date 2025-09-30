// src/models/item.model.ts
import pool from "../config/db";

export interface Item {
  id?: number;
  name: string;
  categoryID: number;
  isvailable: number;
  price: number;
  imageURL?: string;
}

const ItemModel = {
  getAll: async (): Promise<Item[]> => {
    const [rows] = await pool.query("SELECT * FROM item");
    return rows as Item[];
  },

  getById: async (id: number): Promise<Item | null> => {
    const [rows] = await pool.query("SELECT * FROM item WHERE id = ?", [id]);
    const result = rows as Item[];
    return result.length ? result[0] : null;
  },

  create: async (item: Item): Promise<number> => {
    const [result]: any = await pool.query(
      "INSERT INTO item (name, categoryID, isvailable, price, imageURL) VALUES (?, ?, ?, ?, ?)",
      [item.name, item.categoryID, item.isvailable, item.price, item.imageURL]
    );
    return result.insertId;
  },

  update: async (id: number, item: Item): Promise<boolean> => {
    const [result]: any = await pool.query(
      "UPDATE item SET name=?, categoryID=?, isvailable=?, price=?, imageURL=? WHERE id=?",
      [
        item.name,
        item.categoryID,
        item.isvailable,
        item.price,
        item.imageURL,
        id,
      ]
    );
    return result.affectedRows > 0;
  },

  delete: async (id: number): Promise<boolean> => {
    const [result]: any = await pool.query("DELETE FROM item WHERE id=?", [id]);
    return result.affectedRows > 0;
  },
};

export default ItemModel;
