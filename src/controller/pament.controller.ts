import { Request, Response } from "express";
import PaymentModel from "../models/payment.model";
import TabelModel from "../models/table.model";
import OrderModel from "../models/order.model";

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

      // Lấy thông tin order kèm full_name của người tạo
      const data = await Promise.all(
        payments.map(async (item) => {
          const order = await OrderModel.getById(item.orderid!);
          return {
            ...item,
            order, // hoặc order?.createdByName nếu chỉ cần tên
          };
        })
      );

      console.log("🚀 ~ data:", data);

      res.json(data);
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

  createPayment: async (req: Request, res: Response) => {
    try {
      const { totalAmount, orderid, tableID } = req.body;

      if (!totalAmount || !orderid || !tableID) {
        return res
          .status(400)
          .json({ message: "Thiếu totalAmount, orderid hoặc tableID" });
      }

      // ✅ Tạo payment mới
      const newPaymentId = await PaymentModel.create({ totalAmount, orderid });

      // ✅ Cập nhật trạng thái: table -> '0' (trống), order -> '1' (đã thanh toán)
      const updateTable = await TabelModel.updateStatus(tableID, "0");
      const updateOrder = await OrderModel.updateStatus(orderid, "1");

      if (!updateTable || !updateOrder) {
        return res
          .status(500)
          .json({ message: "Không thể cập nhật trạng thái bàn hoặc đơn hàng" });
      }

      res.status(201).json({
        message: "✅ Tạo thanh toán thành công",
        paymentId: newPaymentId,
      });
    } catch (error: any) {
      console.error("❌ Lỗi khi tạo payment:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};

export default PaymentController;
