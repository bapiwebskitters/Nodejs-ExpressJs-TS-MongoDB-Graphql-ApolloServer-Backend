import express, { Request, Response, NextFunction } from "express";
import { requireAdminAuth } from "../../middlewares/auth";
import { HomeController } from "../../controllers/web/HomeController";

const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);

// Create an instance of HomeController class
const homeController = new HomeController();

// Middleware to check if the user is authenticated
function checkAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.isAuthenticated()) {
    // If user is authenticated, redirect to admin dashboard
    res.redirect("/admin/dashboard");
  } else {
    // If not authenticated, redirect to login page
    res.redirect("/admin/login");
  }
}

// Define route for the root URL
router.get("/", checkAuthentication);

// Define named route for dashboard
namedRouter.get(
  "admin.dashboard",
  "/admin/dashboard",
  requireAdminAuth,
  homeController.dashboard
);

export default router;
