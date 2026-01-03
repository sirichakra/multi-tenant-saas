import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
