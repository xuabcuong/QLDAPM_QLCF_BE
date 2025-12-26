// src/routes/authRoutes.ts
import { Router } from "express";
import {
  register,
  login,
  getAllAccount,
  getOneAccount,
  updateAccount,
  getProfile,
} from "../controller/auth.controller";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get_all_account", getAllAccount);
router.get("/get_one_account/:id", getOneAccount);
router.put("/update_account/:id", updateAccount);
router.get("/get_profile", verifyToken, getProfile);

export default router;
