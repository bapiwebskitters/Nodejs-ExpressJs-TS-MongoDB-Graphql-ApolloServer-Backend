import { GraphQLError } from "graphql";
import { GraphQLContext, isAuthenticated, hasRole } from "../context";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
}

interface UpdateUserInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
}

interface QueryOptions {
  page?: number;
  limit?: number;
}

export const userResolver = {
  Query: {
    getUser: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      try {
        isAuthenticated(context);

        if (context.user?.id !== id) {
          hasRole(context, "ADMIN");
        }

        // Replace with actual database query
        const user: User = {
          id,
          name: "John Doe",
          email: "john@example.com",
          phone: "9865852210",
          role: "ADMIN",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return {
          success: true,
          message: "User fetched successfully",
          user,
        };
      } catch (error) {
        console.error("Error in getUser:", error);
        throw error instanceof GraphQLError
          ? error
          : new GraphQLError("Failed to fetch user", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
                http: { status: 500 },
              },
            });
      }
    },

    getAllUsers: async (
      _: any,
      { page = 1, limit = 10 }: QueryOptions,
      context: GraphQLContext
    ) => {
      try {
        isAuthenticated(context);
        hasRole(context, "ADMIN");

        // Replace with actual database query with pagination
        const users: User[] = [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            phone: "9865852210",
            role: "ADMIN",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Jane Doe",
            email: "jane@example.com",
            phone: "9865852210",
            role: "USER",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        return {
          success: true,
          message: "Users fetched successfully",
          users,
        };
      } catch (error) {
        console.error("Error in getAllUsers:", error);
        throw error instanceof GraphQLError
          ? error
          : new GraphQLError("Failed to fetch users", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
                http: { status: 500 },
              },
            });
      }
    },

    searchUsers: async (
      _: any,
      { query }: { query: string },
      context: GraphQLContext
    ) => {
      try {
        isAuthenticated(context);
        hasRole(context, "ADMIN");

        // Replace with actual database search query
        const users: User[] = [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            phone: "9865852210",
            role: "USER",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        return {
          success: true,
          message: `Found ${users.length} users matching "${query}"`,
          users,
        };
      } catch (error) {
        console.error("Error in searchUsers:", error);
        throw error instanceof GraphQLError
          ? error
          : new GraphQLError("Failed to search users", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
                http: { status: 500 },
              },
            });
      }
    },
  },

  Mutation: {
    createUser: async (
      _: any,
      { input }: { input: CreateUserInput },
      context: GraphQLContext
    ) => {
      try {
        isAuthenticated(context);
        hasRole(context, "ADMIN");

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.email)) {
          throw new GraphQLError("Invalid email format", {
            extensions: {
              code: "BAD_USER_INPUT",
              http: { status: 400 },
            },
          });
        }

        // Replace with actual database creation
        const user = {
          id: crypto.randomUUID(),
          ...input,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return {
          success: true,
          message: "User created successfully",
          user,
        };
      } catch (error) {
        console.error("Error in createUser:", error);
        throw error instanceof GraphQLError
          ? error
          : new GraphQLError("Failed to create user", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
                http: { status: 500 },
              },
            });
      }
    },

    updateUser: async (
      _: any,
      { input }: { input: UpdateUserInput },
      context: GraphQLContext
    ) => {
      try {
        isAuthenticated(context);

        if (context.user?.id !== input.id) {
          hasRole(context, "ADMIN");
        }

        if (input.email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.email)) {
            throw new GraphQLError("Invalid email format", {
              extensions: {
                code: "BAD_USER_INPUT",
                http: { status: 400 },
              },
            });
          }
        }

        // Replace with actual database update
        const user = {
          id: input.id,
          name: input.name || "Existing Name",
          email: input.email || "existing@email.com",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return {
          success: true,
          message: "User updated successfully",
          user,
        };
      } catch (error) {
        console.error("Error in updateUser:", error);
        throw error instanceof GraphQLError
          ? error
          : new GraphQLError("Failed to update user", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
                http: { status: 500 },
              },
            });
      }
    },

    deleteUser: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      try {
        isAuthenticated(context);
        hasRole(context, "ADMIN");

        // Replace with actual database deletion
        return {
          success: true,
          message: `User ${id} successfully deleted`,
        };
      } catch (error) {
        console.error("Error in deleteUser:", error);
        throw error instanceof GraphQLError
          ? error
          : new GraphQLError("Failed to delete user", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
                http: { status: 500 },
              },
            });
      }
    },
  },
};
