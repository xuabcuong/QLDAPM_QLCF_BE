import pool from "../config/db";

export interface Payment {
  id?: number;
  totalAmount: number;
  created_at?: Date;
  orderid?: number;
}
const PaymentModle = {
  
  getByDateRange: async (
    fromDate: string,
    toDate: string
  ): Promise<Payment[]> => {
    const [rows] = await pool.query(
      "SELECT * FROM payments WHERE created_at BETWEEN ? AND ?",
      [fromDate, toDate]
    );
    return rows as Payment[];
  },

  getById: async (id: number): Promise<Payment | null> => {
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    const result = rows as Payment[];
    return result.length ? result[0] : null;
  },
};
export default PaymentModle;
