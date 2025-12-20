import { Router } from "express";
import { MonthlyStatistics, predictRevenue } from "../controller/statistical.controller";

const router = Router();
router.get("/statistics/monthly", MonthlyStatistics);
router.get("/predict-revenue", predictRevenue);

export default router;
