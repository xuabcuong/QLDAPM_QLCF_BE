// src/routes/authRoutes.ts
import { Router } from "express";
import {
  register,
  login,
  getAllAccount,
  getOneAccount,
  updateAccount,
} from "../controller/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get_all_account", getAllAccount);
router.get("/get_one_account/:id", getOneAccount);
router.put("/update_account/:id", updateAccount);

export default router;
