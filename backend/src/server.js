import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",   // SIMPLE & SAFE FOR DEV
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

app.get("/api/health", (_, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
