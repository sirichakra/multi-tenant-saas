import pool from "../config/db.js";

export const getAuditLogs = async (req, res) => {
  try {
    const { role, tenantId } = req.user;

    let query = `
      SELECT a.id, a.action, a.entity_type, a.entity_id,
             a.ip_address, a.created_at,
             u.email
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
    `;

    const params = [];

    if (role !== "super_admin") {
      query += " WHERE a.tenant_id = $1";
      params.push(tenantId);
    }

    query += " ORDER BY a.created_at DESC LIMIT 100";

    const result = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
    });
  }
};
