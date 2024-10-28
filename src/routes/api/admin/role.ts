import express from "express";
import RoleController from "../../../controllers/api/admin/RoleController";
import { requireJWTAuth } from "../../../middlewares/auth";

const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);

const RoleCtl = new RoleController();

// List all roles
namedRouter.get("roles.index", "/roles", requireJWTAuth, RoleCtl.index);

// Create a new role with permissions
namedRouter.post("roles.store", "/roles/store", requireJWTAuth, RoleCtl.store);

// Update an existing role by ID
namedRouter.put("roles.update", "/roles/:id", requireJWTAuth, RoleCtl.update);

// Delete a role by ID
namedRouter.delete(
  "roles.delete",
  "/roles/:id",
  requireJWTAuth,
  RoleCtl.delete
);

export default router;
