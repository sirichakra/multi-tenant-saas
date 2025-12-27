import express from "express";
import {
  createUser,
  listUsers,
  updateUserStatus,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, createUser);
router.get("/", authenticate, listUsers);
router.patch("/:id/status", authenticate, updateUserStatus);

export default router;
