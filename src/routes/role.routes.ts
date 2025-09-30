import { Router } from "express";
import { getRoles } from "../controller/role.controller";

const router = Router();

router.get("/roles", getRoles);

export default router;
