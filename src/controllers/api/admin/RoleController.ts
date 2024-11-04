import { Request, Response } from "express";
import Role from "../../../models/Role";
import Permission from "../../../models/Permission";
import RolePermission from "../../../models/RolePermission";
import {
  createRoleSchema,
  permissionIdsSchema,
} from "../../../validations/role.validation";

export default class RoleController {
  // List all roles with their permissions
  public async index(req: Request, res: Response): Promise<void> {
    try {
      const roles = await Role.find().populate({
        path: "permissions",
        populate: {
          path: "permission",
          model: "Permission",
        },
        match: { isDeleted: false },
        model: "RolePermission",
      });
      res.status(200).json({ success: true, data: roles });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve roles",
        error: err.message,
      });
    }
  }

  // Store a new role with permissions
  public async store(req: Request, res: Response): Promise<void> {
    try {
      const { error: roleError, value: roleValue } = createRoleSchema.validate(
        req.body
      );
      if (roleError) {
        res
          .status(400)
          .json({ success: false, message: roleError.details[0].message });
        return;
      }

      const {
        roleDisplayName,
        role,
        rolegroup,
        desc,
        isDeleted,
        status,
        permissions,
      } = roleValue;

      if (permissions) {
        const validPermissions = await Permission.find({
          permissionKey: { $in: permissions },
        });

        if (validPermissions.length !== permissions.length) {
          res.status(400).json({
            success: false,
            message: "One or more permissions are invalid",
          });
          return;
        }

        const permissionIds = validPermissions.map(
          (permission) => permission._id
        );

        const newRole = new Role({
          roleDisplayName,
          role,
          rolegroup,
          desc,
          isDeleted,
          status,
        });

        await newRole.save();

        const rolePermissions = permissionIds.map((permissionId) => ({
          role: newRole._id,
          permission: permissionId,
        }));

        await RolePermission.insertMany(rolePermissions);

        res.status(201).json({
          success: true,
          message: "Role created successfully",
          data: newRole,
        });
      } else {
        const newRole = new Role({
          roleDisplayName,
          role,
          rolegroup,
          desc,
          isDeleted,
          status,
        });

        await newRole.save();

        res.status(201).json({
          success: true,
          message: "Role created successfully",
          data: newRole,
        });
      }
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Failed to create role",
        error: err.message,
      });
    }
  }

  // Update an existing role by ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { error: roleError, value: roleValue } = createRoleSchema.validate(
        req.body
      );
      if (roleError) {
        res
          .status(400)
          .json({ success: false, message: roleError.details[0].message });
        return;
      }

      const {
        roleDisplayName,
        role,
        rolegroup,
        desc,
        isDeleted,
        status,
        permissions,
      } = roleValue;

      // Validate permissions if provided
      if (permissions) {
        const { error: permissionsError } =
          permissionIdsSchema.validate(permissions);
        if (permissionsError) {
          res.status(400).json({
            success: false,
            message: permissionsError.details[0].message,
          });
          return;
        }

        const validPermissions = await Permission.find({
          _id: { $in: permissions },
          isDeleted: false, // Optionally filter out deleted permissions
        });

        if (validPermissions.length !== permissions.length) {
          res.status(400).json({
            success: false,
            message: "One or more permissions are invalid",
          });
          return;
        }

        roleValue.permissions = validPermissions.map(
          (permission) => permission._id
        );
      }

      const updatedRole = await Role.findByIdAndUpdate(id, roleValue, {
        new: true,
      });

      if (updatedRole) {
        // Update RolePermission relationships
        await RolePermission.deleteMany({ role: id });
        if (roleValue.permissions) {
          const rolePermissions = roleValue.permissions.map(
            (permission: any) => ({
              role: updatedRole._id,
              permission,
            })
          );

          await RolePermission.insertMany(rolePermissions);
        }

        res.status(200).json({
          success: true,
          message: "Role updated successfully",
          data: updatedRole,
        });
      } else {
        res.status(404).json({ success: false, message: "Role not found" });
      }
    } catch (err: any) {
      console.log("Error: ", err);

      res.status(500).json({
        success: false,
        message: "Failed to update role",
        error: err.message,
      });
    }
  }

  // Delete a role by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ success: false, message: "Invalid role ID" });
        return;
      }

      const role = await Role.findByIdAndDelete(id);

      if (role) {
        await RolePermission.deleteMany({ role: id });
        res
          .status(200)
          .json({ success: true, message: "Role deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Role not found" });
      }
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Failed to delete role",
        error: err.message,
      });
    }
  }
}
