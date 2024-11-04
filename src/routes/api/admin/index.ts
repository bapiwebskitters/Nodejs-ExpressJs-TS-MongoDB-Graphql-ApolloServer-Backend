import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import PermissionRoutes from "./permission";
import roleRoutes from "./role";
import brunchRoutes from "./branch";
import serviceRoutes from "./service";
import clientRoutes  from './client';

const router = Router();

router.use(authRoutes);
router.use(userRoutes);
router.use(PermissionRoutes);
router.use(roleRoutes);
router.use(brunchRoutes);
router.use(serviceRoutes);
router.use(brunchRoutes)
router.use(clientRoutes)

export default router;
