import express from "express";
import { getAuditLogs } from "../controllers/audit.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getAuditLogs);

export default router;
