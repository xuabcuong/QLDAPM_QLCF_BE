import pool from "../config/db";

export interface OrderItem {
  id?: number;
  orderID: number;
  itemID: number;
  quantity: number;
  note?: string;
  // Thêm thông tin từ bảng item
  itemName?: string;
  price?: number;
  imageURI?: string;
}

const OrderItemModel = {
  createMany: async (items: OrderItem[]): Promise<void> => {
    const values = items.map((i) => [i.orderID, i.itemID, i.quantity, i.note]);

    await pool.query(
      "INSERT INTO orderItem (orderID, itemID, quantity, note) VALUES ?",
      [values]
    );
  },

  // ✅ Lấy order items kèm thông tin từ bảng item
  getByOrderId: async (orderID: number): Promise<OrderItem[]> => {
    const [rows] = await pool.query(
      `SELECT oi.id, oi.orderID, oi.itemID, oi.quantity, oi.note,
            i.name as itemName, i.price, i.imageURL
     FROM orderItem oi
     JOIN item i ON oi.itemID = i.id
     WHERE oi.orderID = ?`,
      [orderID]
    );
    return rows as OrderItem[];
  },

  deleteByOrderId: async (orderID: number): Promise<void> => {
    await pool.query("DELETE FROM orderItem WHERE orderID = ?", [orderID]);
  },
};

export default OrderItemModel;
