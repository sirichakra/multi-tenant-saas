import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

/**
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  const { email, password, tenantSubdomain } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT 
        u.id,
        u.email,
        u.password_hash,
        u.full_name,
        u.role,
        u.tenant_id,
        u.is_active,
        t.name AS tenant_name,
        t.subdomain,
        t.status
      FROM users u
      LEFT JOIN tenants t ON u.tenant_id = t.id
      WHERE u.email = $1
      `,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Tenant validation (skip for super_admin)
    if (user.role !== "super_admin") {
      if (!tenantSubdomain || tenantSubdomain !== user.subdomain) {
        return res.status(404).json({
          success: false,
          message: "Tenant not found",
        });
      }

      if (user.status !== "active") {
        return res.status(403).json({
          success: false,
          message: "Tenant is not active",
        });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenant_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          tenantId: user.tenant_id,
        },
        token,
        expiresIn: 86400,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/**
 * GET /api/auth/me
 */
export const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await pool.query(
      `
      SELECT 
        u.id,
        u.email,
        u.full_name,
        u.role,
        u.is_active,
        t.id AS tenant_id,
        t.name,
        t.subdomain,
        t.subscription_plan,
        t.max_users,
        t.max_projects
      FROM users u
      LEFT JOIN tenants t ON u.tenant_id = t.id
      WHERE u.id = $1
      `,
      [userId]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        isActive: user.is_active,
        tenant: user.tenant_id
          ? {
              id: user.tenant_id,
              name: user.name,
              subdomain: user.subdomain,
              subscriptionPlan: user.subscription_plan,
              maxUsers: user.max_users,
              maxProjects: user.max_projects,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("GET CURRENT USER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};
