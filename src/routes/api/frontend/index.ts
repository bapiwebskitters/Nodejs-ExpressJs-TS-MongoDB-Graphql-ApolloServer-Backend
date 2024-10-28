// src/routes/api/index.ts
import { Router } from 'express';
import authRoutes from '../admin/auth';

const router = Router();

router.use(authRoutes);

export default router;
