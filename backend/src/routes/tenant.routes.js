import express from "express";
import {
  getMyTenant,
  updateMyTenant,
  listTenants,
} from "../controllers/tenant.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Tenant admin routes
router.get("/me", authenticate, getMyTenant);
router.put("/me", authenticate, updateMyTenant);

// Super admin route
router.get("/", authenticate, listTenants);

export default router;
