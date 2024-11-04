import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../../models/User";
import { JWT_SECRET } from "../../../config/index";
import { UserRepository } from "../../../repository/UserRepository";
import { ApiBody, ApiOperation, ApiResponse, ApiTags, Post } from "../../../decorators/swagger.decorator";

// Initialize UserRepository
const userRepository = new UserRepository();

@ApiTags("Authentication")
export default class AuthController {
  @Post("/auth/register")
  @ApiOperation("Register a user")
  @ApiBody({
    type: "object",
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
  })
  @ApiResponse(200, "User registered successfully")
  @ApiResponse(401, "Invalid credentials")
  public async register(req: Request, res: Response) {
    const { email, password, first_name, last_name } = req.body;

    console.log("Register", email, password, first_name, last_name);

    try {
      // Check if user already exists
      const existingUser = await userRepository.getByField({ email });
      if (existingUser) {
        const response = {
          success: false,
          message: "User already exists",
          status: 409,
        };
        return res.status(409).json(response);
      }

      // Create a new user
      const newUser = await userRepository.save({
        email,
        password,
        first_name,
        last_name,
      });

      // Generate JWT token
      const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      // Send response with JWT token
      const response = {
        success: true,
        status: 201,
        message: "Registration successful",
        data: {
          user: newUser,
          token: token,
        },
      };
      return res.status(201).json(response);
    } catch (error) {
      console.error("Registration error:", error);
      const response = {
        success: false,
        status: 500,
        message: "An error occurred during registration",
      };
      return res.status(500).json(response);
    }
  }

  @Post("/auth/login")
  @ApiOperation("Login a user")
  @ApiResponse(200, "User logged in successfully")
  @ApiResponse(401, "Invalid credentials")
  @ApiBody({
    type: "object",
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
  })
  public async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      // Find user by email
      const user = await userRepository.getByField({ email });
      if (!user) {
        return {
          status: 404,
          message: "User not found",
          success: false,
        };
      }

      // Check if password is correct
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        const response = {
          status: 422,
          message: "Invalid password",
          success: false,
        };
        return res.status(422).json(response);
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

      const getUser = await User.findById(user?._id).populate({
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
      // Send JWT token
      const response = {
        status: 200,
        message: "Login success",
        success: true,
        userData: getUser,
        accessToken: token,
      };
      return res.status(200).json(response);
    } catch (error) {
      console.error("Login error:", error);
      const response = {
        status: 500,
        message: "An error occurred during login",
        success: false,
      };
      return res.status(500).json(response);
    }
  }
}
