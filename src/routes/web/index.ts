import { Router } from 'express';
import authRoutes from './auth';
import adminRoutes from './admin';

const router = Router();

// Mount auth routes
router.use(authRoutes);

// Mount admin routes
router.use(adminRoutes);

export default router;

