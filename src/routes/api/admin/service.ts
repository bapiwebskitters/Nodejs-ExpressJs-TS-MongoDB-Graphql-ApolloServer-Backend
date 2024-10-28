// src/routes/web/auth.ts
import express from "express";
import ServiceController from "../../../controllers/api/admin/ServiceController";
import { requireJWTAuth } from "../../../middlewares/auth";

const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);

const ServiceCtl = new ServiceController();

// List all service
namedRouter.get("service.index", "/service", requireJWTAuth, ServiceCtl.index);
// Create a new service
namedRouter.post(
  "service.store",
  "/service/store",
  requireJWTAuth,
  ServiceCtl.store
);
// Show a service by ID
namedRouter.get(
  "service.details",
  "/service/details/:id",
  requireJWTAuth,
  ServiceCtl.show
);
// Update a service by ID
namedRouter.post(
  "service.update",
  "/service/update/:id",
  requireJWTAuth,
  ServiceCtl.update
);
// Change status a service by ID
namedRouter.get(
  "service.status-change",
  "/service/status-change/:id",
  requireJWTAuth,
  ServiceCtl.statusChange
);
// Delete a service by ID
namedRouter.delete(
  "service.delete",
  "/service/delete/:id",
  requireJWTAuth,
  ServiceCtl.delete
);
// List all service with pagination
namedRouter.post(
  "service.get-all",
  "/service/get-all",
  requireJWTAuth,
  ServiceCtl.serviceGetAll
);

export default router;
