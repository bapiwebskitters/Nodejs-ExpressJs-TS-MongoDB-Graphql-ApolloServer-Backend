import { Router } from "express";
import adminRoutes from "../api/admin";
import frontRoutes from "./frontend";

const router = Router();

router.use("admin", adminRoutes);
router.use(frontRoutes);

export default router;
