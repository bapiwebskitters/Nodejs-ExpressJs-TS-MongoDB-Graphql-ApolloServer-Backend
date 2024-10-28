// src/routes/web/auth.ts
import express from "express";
import BranchController from "../../../controllers/api/admin/BranchController";
import { requireJWTAuth } from "../../../middlewares/auth";
import ClientController from "../../../controllers/api/admin/ClientController";
import { upload } from "../../../middlewares/upload";

const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);

const ClientCtl = new ClientController();


namedRouter.get("client.index", "/client", requireJWTAuth, ClientCtl.index);

namedRouter.post("client.create", "/client/create",upload.any(),requireJWTAuth,ClientCtl.store);

// Show a client by ID
namedRouter.get("client.id", "/client/:id", requireJWTAuth, ClientCtl.show);

// Update a client by ID
namedRouter.put("client.update", "/client/:id", requireJWTAuth, ClientCtl.update);

// Update  by ID
namedRouter.put("client.update", "/client/status/:id", requireJWTAuth, ClientCtl.statusUpdate);

namedRouter.delete("client.delete", "/client/:id", requireJWTAuth, ClientCtl.delete);


export default router;
 