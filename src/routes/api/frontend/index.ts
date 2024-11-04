// src/routes/api/index.ts
import { Router } from "express";
import authRoutes from "../frontend/auth";

const router = Router();

router.use(authRoutes);
// Add more routes
// code ...

export default router;
