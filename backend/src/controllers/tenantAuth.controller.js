import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export const registerTenant = async (req, res) => {
  const {
    companyName,
    subdomain,
    adminEmail,
    adminPassword,
  } = req.body;

  if (!companyName || !subdomain || !adminEmail || !adminPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    // Check subdomain uniqueness
    const existingTenant = await pool.query(
      "SELECT id FROM tenants WHERE subdomain = $1",
      [subdomain]
    );

    if (existingTenant.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Subdomain already exists",
      });
    }

    const tenantId = uuidv4();
    const adminId = uuidv4();
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Create tenant
    await pool.query(
      `
      INSERT INTO tenants (
        id, name, subdomain,
        subscription_plan, max_users, max_projects
      )
      VALUES ($1, $2, $3, 'free', 5, 3)
      `,
      [tenantId, companyName, subdomain]
    );

    // Create tenant admin
    await pool.query(
      `
      INSERT INTO users (
        id, tenant_id, email,
        password_hash, full_name, role
      )
      VALUES ($1, $2, $3, $4, $5, 'tenant_admin')
      `,
      [adminId, tenantId, adminEmail, passwordHash, "Tenant Admin"]
    );

    return res.status(201).json({
      success: true,
      message: "Tenant registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Tenant registration failed",
    });
  }
};
