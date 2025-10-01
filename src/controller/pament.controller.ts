import { Request, Response } from "express";
import PaymentModel from "../models/payment.model";

const PaymentController = {
  // Lấy danh sách theo khoảng ngày
  getByDateRange: async (req: Request, res: Response) => {
    try {
      const { fromDate, toDate } = req.query;

      if (!fromDate || !toDate) {
        return res.status(400).json({
          message:
            "fromDate và toDate là bắt buộc. Ví dụ: /payments?fromDate=2025-09-01&toDate=2025-09-30",
        });
      }

      const payments = await PaymentModel.getByDateRange(
        fromDate as string,
        toDate as string
      );

      res.json(payments);
    } catch (error: any) {
      console.error("Error in getByDateRange:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Lấy theo ID
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Thiếu id" });
      }

      const payment = await PaymentModel.getById(Number(id));
      if (!payment) {
        return res.status(404).json({ message: "Không tìm thấy payment" });
      }

      res.json(payment);
    } catch (error: any) {
      console.error("Error in getById:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};

export default PaymentController;
