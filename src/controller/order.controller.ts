import { Request, Response } from "express";
import OrderModel from "../models/order.model";
import OrderItemModel, { OrderItem } from "../models/orderItem.model";
import pool from "../config/db";
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { tableID, createdBy, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách món không được để trống" });
    }

    const orderID = await OrderModel.create({ tableID, createdBy });

    // 2. Thêm danh sách món
    const orderItems: OrderItem[] = items.map((i: any) => ({
      orderID,
      itemID: i.itemID,
      quantity: i.quantity,
      note: i.note || null,
    }));

    await OrderItemModel.createMany(orderItems);

    res.status(201).json({
      message: "Tạo order thành công",
      orderID,
      items: orderItems,
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo order:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
// ✅ Lấy order theo ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const order = await OrderModel.getById(id);

    if (!order)
      return res.status(404).json({ message: "Không tìm thấy order" });

    const items = await OrderItemModel.getByOrderId(id);
    res.json({ ...order, items });
  } catch (error) {
    console.error("❌ Lỗi getOrderById:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ✅ Lấy tất cả orders kèm items
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await OrderModel.getAll();

    const result = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItemModel.getByOrderId(order.id!);
        return { ...order, items };
      })
    );

    res.json(result);
  } catch (error) {
    console.error("❌ Lỗi getAllOrders:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ✅ Sửa order + items
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { tableID, createdBy, items } = req.body;

    const exists = await OrderModel.getById(id);
    if (!exists)
      return res.status(404).json({ message: "Order không tồn tại" });

    // 1. Update order
    await OrderModel.update(id, { tableID, createdBy });

    // 2. Xoá hết items cũ
    await OrderItemModel.deleteByOrderId(id);

    // 3. Thêm items mới
    if (items && Array.isArray(items) && items.length > 0) {
      const newItems: OrderItem[] = items.map((i: any) => ({
        orderID: id,
        itemID: i.itemID,
        quantity: i.quantity,
        note: i.note || null,
      }));
      await OrderItemModel.createMany(newItems);
    }

    res.json({ message: "Cập nhật order thành công" });
  } catch (error) {
    console.error("❌ Lỗi updateOrder:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
