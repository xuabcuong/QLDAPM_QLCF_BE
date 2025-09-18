import { Router } from "express";
import { getRoles } from "../controller/roleController";

const router = Router();

router.get("/roles", getRoles);

export default router;
