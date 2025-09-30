import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
} from "../controller/order.controller";

const router = Router();

router.post("/create", createOrder);
router.get("/:id", getOrderById);
router.get("/", getAllOrders);
router.put("/:id", updateOrder);

export default router;
