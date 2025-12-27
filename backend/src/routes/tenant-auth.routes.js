import express from "express";
import { registerTenant } from "../controllers/tenantAuth.controller.js";

const router = express.Router();

router.post("/register-tenant", registerTenant);

export default router;
