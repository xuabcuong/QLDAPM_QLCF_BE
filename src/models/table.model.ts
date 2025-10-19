// src/models/item.model.ts
import pool from "../config/db";

export interface Table {
  id?: number;
  tableNumber: string;
  status: string;
}

const TabelModel = {
  getAll: async (): Promise<Table[]> => {
    const [rows] = await pool.query("SELECT * FROM tables");
    return rows as Table[];
  },

  getById: async (id: number): Promise<Table | null> => {
    const [rows] = await pool.query("SELECT * FROM tables WHERE id = ?", [id]);
    const result = rows as Table[];
    return result.length ? result[0] : null;
  },

  create: async (item: Table): Promise<number> => {
    const [result]: any = await pool.query(
      "INSERT INTO tables (tableNumber) VALUES (?)",
      [item.tableNumber]
    );
    return result.insertId;
  },
  updateStatus: async (id: number, status: string): Promise<boolean> => {
    const [result]: any = await pool.query(
      "UPDATE tables SET status = ? WHERE id = ?",
      [status, id]
    );
    return result.affectedRows > 0;
  },
};

export default TabelModel;
