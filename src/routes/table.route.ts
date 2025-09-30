// src/routes/table.route.ts
import { Router } from "express";
import {
  getTables,
  getTableById,
  createTable,
  updateTableStatus,
} from "../controller/table.controller";

const router = Router();

router.get("/", getTables);
router.get("/:id", getTableById);
router.post("/create", createTable);
router.put("/update_status/id=:id/status=:status", updateTableStatus);

export default router;
