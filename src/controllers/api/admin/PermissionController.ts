// src/controllers/api/PermissionController.ts
import { Request, Response } from "express";
import Permission from "../../../models/Permission";
import { createPermissionSchema } from "../../../validations/permission.validation";
import { ValidationError } from "joi";

export default class PermissionController {
  // List all permissions
  public async index(req: Request, res: Response): Promise<void> {
    try {
      const permissions = await Permission.find({ isDeleted: false });
      res.status(200).json({ success: true, data: permissions });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error: err });
    }
  }

  // Store a new permission
  public async store(req: Request, res: Response){
    try {
      const { error } = createPermissionSchema.validate(req.body);
      if (error) {
        return res.status(422).json({
          success: false,
          message: "Validation Error",
          errors: error.details,
        });
      }

      const { permissionName, permissionKey, desc } = req.body;

      // Check if a permission with the same key already exists
      const existingPermission = await Permission.findOne({ permissionKey });
      if (existingPermission) {
        return res.status(400).json({
          success: false,
          message: "Permission with this key already exists",
        });
      }

      const permission = new Permission({
        permissionName,
        permissionKey,
        desc,
      });
      await permission.save();
      res.status(201).json({
        success: true,
        message: "Permission created successfully",
        data: permission,
      });
    } catch (err:any) {
      res.status(500).json({
        success: false,
        message: "Failed to create permission",
        error: err.message,
      });
    }
  }

  // Delete a permission by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const permission = await Permission.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );

      if (permission) {
        res.status(200).json({
          success: true,
          message: "Permission deleted successfully",
        });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Permission not found" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error: err });
    }
  }
}
