import express from "express";
import passport from "passport";
import logger from "../../utils/logger";
import { sendMail } from "../../utils/mail";

const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);

namedRouter.get("admin.auth.login", "/admin/login", (req: any, res: any) => {
  // Test the loggers
  logger.error("This is an error message");
  logger.warn("This is a warning message");
  logger.info("This is an informational message");
  logger.debug("This is a debug message");
  logger.verbose("This is a verbose message");
  logger.silly("This is a silly log message");

  // Test mail
  try {
    sendMail({
      to: "bapi@yopmail.com",
      subject: "Welcome to Our Service!",
      template: "welcome", // Refers to 'emails/welcome.ejs'
      variables: {
        firstName: "John",
        verificationUrl: "https://example.com/verify?token=abc123",
      },
    });
    console.log("Welcome email sent successfully!");
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }

  res.render("login", { title: "Admin Login", layout: "./layouts/authlayout" });
});

// Use passport.authenticate for handling the login POST request
namedRouter.post(
  "admin.auth.login",
  "/admin/login",
  passport.authenticate("local", {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin/login",
    failureFlash: true,
  })
);

export default router;
