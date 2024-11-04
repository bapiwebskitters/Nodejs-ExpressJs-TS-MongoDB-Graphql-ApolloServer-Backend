// src/routes/web/permission.ts
import express from "express";
import PermissionController from "../../../controllers/api/admin/PermissionController";
import { requireJWTAuth } from "../../../middlewares/auth";

const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);

const PermissionCtl = new PermissionController();

namedRouter.get(
  "permissions.index",
  "/permissions",
  requireJWTAuth,
  PermissionCtl.index
);

namedRouter.post(
  "permissions.store",
  "/permissions/store",
  requireJWTAuth,
  PermissionCtl.store
);

namedRouter.delete(
  "permissions.delete",
  "/permissions/:id",
  requireJWTAuth,
  PermissionCtl.delete
);

export default router;
