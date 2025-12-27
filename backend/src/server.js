import userRoutes from "./routes/user.routes.js";
import tenantAuthRoutes from "./routes/tenant-auth.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import authRoutes from "./routes/auth.routes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",      // Docker frontend
      "http://localhost:5173",      // Local Vite (optional)
    ],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    // Simple DB check
    await (await import("./config/db.js")).default.query("SELECT 1");

    return res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

// Health Check (MANDATORY)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    database: "not_connected",
    timestamp: new Date().toISOString()
  });
});

// Default Route
app.get("/", (req, res) => {
  res.send("Multi-Tenant SaaS Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/auth", tenantAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api", healthRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
