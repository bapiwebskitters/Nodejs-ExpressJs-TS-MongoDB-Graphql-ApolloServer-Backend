// src/routes/web/auth.ts
import express from "express";
import AuthController from "../../../controllers/frontend/AuthController";
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);

// Admin Login
namedRouter.post("auth.login", "/auth/login", AuthController.login);

// Admin Register
namedRouter.post("auth.register", "/auth/register", AuthController.register);

export default router;
