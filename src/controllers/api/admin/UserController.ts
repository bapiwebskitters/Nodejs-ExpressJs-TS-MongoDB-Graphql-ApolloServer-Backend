// src/controllers/api/UserController.ts
import { Request, Response } from "express";
import User from "../../../models/User";
import Role from "../../../models/Role";
import {
  userCreateSchema,
  userUpdateSchema,
} from "../../../validations/user.validation";

export default class UserController {
  // List all users with their roles and permissions
  public async index(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find().populate({
        path: "role_data", // Populate role data
        populate: {
          path: "permissions", // Populate permissions through the RolePermission model
          populate: {
            path: "permission", // Populate the actual Permission data
            model: "Permission",
          },
          model: "RolePermission",
        },
      });

      res.status(200).json({ success: true, data: users });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  }

  // Create a new user
  public async store(req: Request, res: Response): Promise<void> {
    const { error, value } = userCreateSchema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ success: false, message: error.details[0].message });
      return;
    }

    try {
      const { first_name, last_name, username, email, password, role, status } =
        value;

      // Validate role existence
      const validRole = await Role.findById(role);
      if (!validRole) {
        res.status(400).json({ success: false, message: "Invalid role ID" });
        return;
      }

      const newUser = new User({
        first_name,
        last_name,
        username,
        email,
        password,
        role,
        status,
      });

      await newUser.save();

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    } catch (err: any) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: "Failed to create user",
        error: err.message,
      });
    }
  }

  // Show a user by ID
  public async show(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findById(id).populate("role_data");

      if (user) {
        res.status(200).json({ success: true, data: user });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  }

  // Update a user by ID
  public async update(req: Request, res: Response): Promise<void> {
    const { error, value } = userUpdateSchema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ success: false, message: error.details[0].message });
      return;
    }

    try {
      const { id } = req.params;
      const updateData = { ...value };

      if (value.role) {
        // Validate role existence
        const validRole = await Role.findById(value.role);
        if (!validRole) {
          res.status(400).json({ success: false, message: "Invalid role ID" });
          return;
        }
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      }).populate("role_data");

      if (updatedUser) {
        res.status(200).json({
          success: true,
          message: "User updated successfully",
          data: updatedUser,
        });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Failed to update user",
        error: err.message,
      });
    }
  }

  // Delete a user by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);

      if (deletedUser) {
        res
          .status(200)
          .json({ success: true, message: "User deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  }
}
