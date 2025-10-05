import { Router } from "express";
import PaymentController from "../controller/pament.controller";


const router = Router();

router.get("/", PaymentController.getByDateRange);
router.get("/:id", PaymentController.getById);
router.post("/create",  PaymentController.createPayment);

export default router;
