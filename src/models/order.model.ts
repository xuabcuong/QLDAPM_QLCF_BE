import pool from "../config/db";

export interface Order {
  id?: number;
  tableID: number;
  createdBy: number;
  createdAt?: Date;
}

const OrderModel = {
  create: async (order: Order): Promise<number> => {
    const [result]: any = await pool.query(
      "INSERT INTO orders (tableID, createdBy, createdAt) VALUES (?, ?, NOW())",
      [order.tableID, order.createdBy]
    );
    return result.insertId;
  },

  getById: async (id: number): Promise<Order | null> => {
    const [rows]: any = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);
    return rows.length ? (rows[0] as Order) : null;
  },

  getAll: async (): Promise<Order[]> => {
    const [rows] = await pool.query("SELECT * FROM orders ORDER BY createdAt DESC");
    return rows as Order[];
  },

  update: async (id: number, order: Partial<Order>): Promise<boolean> => {
    const [result]: any = await pool.query(
      "UPDATE orders SET tableID=?, createdBy=? WHERE id=?",
      [order.tableID, order.createdBy, id]
    );
    return result.affectedRows > 0;
  },
};

export default OrderModel;
