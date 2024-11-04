import { Request, Response } from "express";
import { BaseController } from "../api/BaseController";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/index";

export default class AuthController {
  public async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.redirect("/admin/login");
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.redirect("/admin/login");
      }

      // Passport will handle session management; no need for manual JWT handling
      req.login(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.redirect("/admin/login");
        }
        // Redirect to the dashboard after successful login
        return res.redirect("/admin/dashboard");
      });

    } catch (error) {
      console.error("Login error:", error);
      res.redirect("/admin/login");
    }
  }
}
