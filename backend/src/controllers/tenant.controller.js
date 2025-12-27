import pool from "../config/db.js";

export const getMyTenant = async (req, res) => {
  try {
    const { tenantId, role } = req.user;

    if (role === "super_admin") {
      return res.status(400).json({
        success: false,
        message: "Super admin does not belong to a tenant",
      });
    }

    const result = await pool.query(
      `
      SELECT id, name, subdomain, status, subscription_plan,
             max_users, max_projects, created_at
      FROM tenants
      WHERE id = $1
      `,
      [tenantId]
    );

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tenant",
    });
  }
};

export const updateMyTenant = async (req, res) => {
  try {
    const { tenantId, role } = req.user;

    if (role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Only tenant admin can update tenant",
      });
    }

    const { name, subscription_plan, max_users, max_projects } = req.body;

    const result = await pool.query(
      `
      UPDATE tenants
      SET name = COALESCE($1, name),
          subscription_plan = COALESCE($2, subscription_plan),
          max_users = COALESCE($3, max_users),
          max_projects = COALESCE($4, max_projects),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
      `,
      [name, subscription_plan, max_users, max_projects, tenantId]
    );

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update tenant",
    });
  }
};

export const listTenants = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const result = await pool.query(
      `
      SELECT id, name, subdomain, status,
             subscription_plan, max_users, max_projects
      FROM tenants
      ORDER BY created_at DESC
      `
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to list tenants",
    });
  }
};
