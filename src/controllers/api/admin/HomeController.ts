import { Request, Response } from "express";
import User from "../../../models/User";
import Role from "../../../models/Role";
import Permission from "../../../models/Permission";

export default class HomeController {
  // List all users with their roles and permissions
  public async index(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find().populate({
        path: "role_data",
        populate: {
          path: "permissions",
          model: "Permission",
        },
      });
      res.status(200).json({ success: true, data: users });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error: err });
    }
  }

  // Create a new user with a role
  public async store(req: Request, res: Response): Promise<void> {
    try {
      const { first_name, last_name, username, role, email, password } =
        req.body;

      const user = new User({
        first_name,
        last_name,
        username,
        role,
        email,
        password,
      });

      await user.save();
      res
        .status(201)
        .json({
          success: true,
          message: "User created successfully",
          data: user,
        });
    } catch (err) {
      res
        .status(400)
        .json({ success: false, message: "Failed to create user", error: err });
    }
  }

  // Show a user by ID with their role and permissions
  public async show(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findById(id).populate({
        path: "role_data",
        populate: {
          path: "permissions",
          model: "Permission",
        },
      });

      if (user) {
        res.status(200).json({ success: true, data: user });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error: err });
    }
  }

  // Update a user by ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (updatedUser) {
        res
          .status(200)
          .json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
          });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (err) {
      res
        .status(400)
        .json({ success: false, message: "Failed to update user", error: err });
    }
  }

  // Delete a user by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);

      if (user) {
        res
          .status(200)
          .json({ success: true, message: "User deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error: err });
    }
  }
}
