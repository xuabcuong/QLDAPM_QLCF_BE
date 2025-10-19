import { Router } from "express";
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../controller/item.controller";
import upload from "../middleware/upload";

const router = Router();

router.get("/getAll", getItems);
router.get("/:id", getItemById);
router.post("/create", upload.single("image"), createItem);

router.put("/update/:id", upload.single("imageURL"), updateItem);

router.delete("/delete/:id", deleteItem);

export default router;
