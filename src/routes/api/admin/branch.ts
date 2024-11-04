// src/routes/web/auth.ts
import express from "express";
import BranchController from "../../../controllers/api/admin/BranchController";
import { requireJWTAuth } from "../../../middlewares/auth";

const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);

const BranchCtl = new BranchController();


namedRouter.get("branch.index", "/branch", requireJWTAuth, BranchCtl.index);

namedRouter.post("branch.store", "/branch/create",requireJWTAuth,BranchCtl.store);

namedRouter.get("branch.id", "/branch/:id", requireJWTAuth, BranchCtl.show);

namedRouter.put("branch.update", "/branch/:id", requireJWTAuth, BranchCtl.update);

namedRouter.delete("branch.delete", "/branch/:id", requireJWTAuth, BranchCtl.delete);

export default router;
 