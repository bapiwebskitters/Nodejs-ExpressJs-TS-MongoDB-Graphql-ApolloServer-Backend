import { Router } from 'express';
import authRoutes from './auth';

const router = Router();

router.use(authRoutes);
// Add more routes
// code ...

export default router;
