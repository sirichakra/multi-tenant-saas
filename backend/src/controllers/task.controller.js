import { logAudit } from "../utils/auditLogger.js";
import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createTask = async (req, res) => {
  try {
    const { tenantId, role } = req.user;

    if (role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Super admin cannot create tasks",
      });
    }

    const { project_id, title, description, priority } = req.body;

    if (!project_id || !title) {
      return res.status(400).json({
        success: false,
        message: "Project ID and title are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO tasks (
        id, project_id, tenant_id, title, description, priority
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [uuidv4(), project_id, tenantId, title, description, priority]
    );

    await logAudit({
        tenantId,
        userId: req.user.userId,
        action: "CREATE_TASK",
        entityType: "task",
        entityId: result.rows[0].id,
        ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { tenantId, role } = req.user;

    if (role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Super admin cannot view tasks",
      });
    }

    const result = await pool.query(
      `
      SELECT id, title, description, status, priority, created_at
      FROM tasks
      WHERE tenant_id = $1
      ORDER BY created_at DESC
      `,
      [tenantId]
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { tenantId, role } = req.user;
    const { id } = req.params;
    const { title, description, priority } = req.body;

    if (role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Super admin cannot update tasks",
      });
    }

    const result = await pool.query(
      `
      UPDATE tasks
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          priority = COALESCE($3, priority),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 AND tenant_id = $5
      RETURNING *
      `,
      [title, description, priority, id, tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { tenantId, role } = req.user;
    const { id } = req.params;
    const { status } = req.body;

    console.log("🔥 updateTaskStatus HIT", { id, status, tenantId });

    if (role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Super admin cannot update tasks",
      });
    }

    const allowedStatuses = ["todo", "in_progress", "done"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const result = await pool.query(
  `
  UPDATE tasks t
  SET status = $1
  FROM projects p
  WHERE t.project_id = p.id
    AND t.id = $2
    AND p.tenant_id = $3
  RETURNING t.*
  `,
  [status, id, tenantId]
);


    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update task status",
    });
  }
};



export const deleteTask = async (req, res) => {
  try {
    const { tenantId, role } = req.user;
    const { id } = req.params;

    if (role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Super admin cannot delete tasks",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM tasks
      WHERE id = $1 AND tenant_id = $2
      RETURNING id
      `,
      [id, tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};

