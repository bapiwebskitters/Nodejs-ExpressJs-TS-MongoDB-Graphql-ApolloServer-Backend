import express from "express";
import UserController from "../../../controllers/api/admin/UserController";
import { requireJWTAuth } from "../../../middlewares/auth";

const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);

const UserCtl = new UserController();

// List all users
namedRouter.get("users.index", "/users", requireJWTAuth, UserCtl.index);

// Create a new user
namedRouter.post("users.store", "/users/store", UserCtl.store);

// Show a user by ID
namedRouter.get("users", "/users/:id", requireJWTAuth, UserCtl.show);

// Update a user by ID
namedRouter.post("users.update", "/users/:id", requireJWTAuth, UserCtl.update);

// Delete a user by ID
namedRouter.delete("users.delete", "/users/:id", requireJWTAuth, UserCtl.delete);

export default router;
