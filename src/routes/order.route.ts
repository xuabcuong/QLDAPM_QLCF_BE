import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  getOrderByTableAndStatus,
} from "../controller/order.controller";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/create", verifyToken, createOrder);
router.get("/:id", getOrderById);
router.get("/", getAllOrders);
router.put("/:id", verifyToken, updateOrder);
router.get("/table/:tableID", getOrderByTableAndStatus);
export default router;
