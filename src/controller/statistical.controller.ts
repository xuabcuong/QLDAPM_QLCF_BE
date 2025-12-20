import { Request, Response } from "express";
import PaymentModel from "../models/payment.model";
import axios from "axios";

export const MonthlyStatistics = async (req: Request, res: Response) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({
        message: "Vui lòng nhập năm",
      });
    }

    const data = await PaymentModel.getMonthlyStatisticsByYear(Number(year));

    // Tạo mảng 12 tháng mặc định = 0
    const result = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      totalAmount: 0,
    }));

    // Gán dữ liệu từ DB vào
    data.forEach((item) => {
      result[item.month - 1].totalAmount = Number(item.totalAmount);
    });

    return res.json({
      year,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

export const predictRevenue = async (req: Request, res: Response) => {
  try {
    const year = req.query.year || 2025;

    // Gọi sang Flask ML API
    const flaskResponse = await axios.get(
      "http://127.0.0.1:5000/api/predict-revenue",

      {
        params: { year },
      }
    );

    return res.json({
      year,
      predicted: flaskResponse.data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Lỗi dự đoán doanh thu",
      error,
    });
  }
};
