import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export const createUser = async (req, res) => {
  try {
    const { tenantId, role } = req.user;

    if (role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Only tenant admin can create users",
      });
    }

    const { email, password, fullName, userRole } = req.body;

    if (!email || !password || !fullName || !userRole) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Enforce user limit
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM users WHERE tenant_id = $1",
      [tenantId]
    );

    const tenantResult = await pool.query(
      "SELECT max_users FROM tenants WHERE id = $1",
      [tenantId]
    );

    if (
      parseInt(countResult.rows[0].count, 10) >=
      tenantResult.rows[0].max_users
    ) {
      return res.status(403).json({
        success: false,
        message: "User limit reached for this subscription plan",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (
        id, tenant_id, email,
        password_hash, full_name, role
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, full_name, role, is_active
      `,
      [uuidv4(), tenantId, email, passwordHash, fullName, userRole]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

export const listUsers = async (req, res) => {
  try {
    const { tenantId, role } = req.user;

    if (role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Super admin cannot view tenant users",
      });
    }

    const result = await pool.query(
      `
      SELECT id, email, full_name, role, is_active, created_at
      FROM users
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
      message: "Failed to list users",
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { tenantId, role } = req.user;
    const { id } = req.params;
    const { isActive } = req.body;

    if (role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Only tenant admin can update user status",
      });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET is_active = $1
      WHERE id = $2 AND tenant_id = $3
      RETURNING id, email, is_active
      `,
      [isActive, id, tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};
