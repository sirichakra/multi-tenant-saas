import { logAudit } from "../utils/auditLogger.js";
import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createProject = async (req, res) => {
  try {
    const { tenantId, role, userId } = req.user;

    if (role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Super admin cannot create projects",
      });
    }

    const { name, description } = req.body;

    // Check subscription project limit
const countResult = await pool.query(
  "SELECT COUNT(*) FROM projects WHERE tenant_id = $1",
  [tenantId]
);

const projectCount = parseInt(countResult.rows[0].count, 10);

const tenantResult = await pool.query(
  "SELECT max_projects FROM tenants WHERE id = $1",
  [tenantId]
);

if (projectCount >= tenantResult.rows[0].max_projects) {
  return res.status(403).json({
    success: false,
    message: "Project limit reached for this subscription plan",
  });
}

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO projects (
        id, tenant_id, name, description, created_by
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [uuidv4(), tenantId, name, description, userId]
    );
    await logAudit({
        tenantId,
        userId,
        action: "CREATE_PROJECT",
        entityType: "project",
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
      message: "Failed to create project",
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const { tenantId, role } = req.user;

    if (role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Super admin cannot view projects",
      });
    }

    const result = await pool.query(
      `
      SELECT id, name, description, status, created_at
      FROM projects
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
      message: "Failed to fetch projects",
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { tenantId, role } = req.user;
    const { id } = req.params;
    const { name, description, status } = req.body;

    if (role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Super admin cannot update projects",
      });
    }

    const result = await pool.query(
      `
      UPDATE projects
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          status = COALESCE($3, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 AND tenant_id = $5
      RETURNING *
      `,
      [name, description, status, id, tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { tenantId, role } = req.user;
    const { id } = req.params;

    if (role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Super admin cannot delete projects",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM projects
      WHERE id = $1 AND tenant_id = $2
      RETURNING id
      `,
      [id, tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};
