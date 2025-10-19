import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import OrderModel from "../models/order.model";
import OrderItemModel, { OrderItem } from "../models/orderItem.model";
import TabelModel from "../models/table.model";
import AccountModel from "../models/account.model";

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { tableID, items } = req.body;
    const createdBy = req.user?.id; // ✅ Lấy userID từ token

    if (!createdBy) {
      return res.status(401).json({ message: "Không xác định được người tạo" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách món không được để trống" });
    }

    // ✅ 1. Tạo order mới
    const orderID = await OrderModel.create({ tableID, createdBy });

    // ✅ 2. Thêm danh sách món
    const orderItems = items.map((i: any) => ({
      orderID,
      itemID: i.itemID,
      quantity: i.quantity,
      note: i.note || null,
    }));

    await OrderItemModel.createMany(orderItems);

    // ✅ 3. Cập nhật trạng thái bàn => "2" (đang có khách)
    const updateSuccess = await TabelModel.updateStatus(tableID, "1");

    if (!updateSuccess) {
      console.warn(`⚠️ Không thể cập nhật trạng thái bàn ID ${tableID}`);
    }

    // ✅ 4. Trả kết quả về client
    res.status(201).json({
      message: "Tạo order thành công",
      orderID,
      createdBy,
      tableID,
      items: orderItems,
      tableStatus: updateSuccess ? "2" : "Giữ nguyên",
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
        const table = await TabelModel.getById(order.tableID);
        const staff = await AccountModel.getnameStaff(order.createdBy);
        console.log("🚀 ~ getAllOrders ~ staff:", staff);
        return { ...order, items, table, staff };
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
export const getOrderByTableAndStatus = async (req: Request, res: Response) => {
  try {
    const tableID = Number(req.params.tableID);
    if (isNaN(tableID)) {
      return res.status(400).json({ message: "tableID không hợp lệ" });
    }

    // ✅ 1. Lấy order có status = 0 theo tableID
    const order = await OrderModel.getOrderByTableAndStatus(tableID);
    if (!order) {
      return res
        .status(404)
        .json({ message: "Không có order nào đang hoạt động cho bàn này" });
    }

    // ✅ 2. Lấy danh sách món theo orderID
    const items = await OrderItemModel.getByOrderId(order.id!);

    // ✅ 3. Trả kết quả
    res.json({
      order,
      items,
    });
  } catch (error) {
    console.error("❌ Lỗi getOrderByTableAndStatus:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
export const updatestatusOdrder = async (req: Request, res: Response) => {
  try {
    const orderID = Number(req.params.orderID);
    const status = req.params.status;
    await OrderModel.updateStatus(orderID, status);

    res.status(200).json({ message: "cập nhật trạng thái thành công" });
  } catch (error) {
    console.error("❌ Lỗi :", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
