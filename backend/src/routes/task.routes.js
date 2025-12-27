import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, createTask);
router.get("/", authenticate, getTasks);
router.put("/:id", authenticate, updateTask);
router.patch("/:id/status", authenticate, updateTaskStatus);
router.delete("/:id", authenticate, deleteTask);

export default router;
