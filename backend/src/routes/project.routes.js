import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, createProject);
router.get("/", authenticate, getProjects);
router.put("/:id", authenticate, updateProject);
router.delete("/:id", authenticate, deleteProject);

export default router;
