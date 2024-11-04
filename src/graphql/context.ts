import { Request } from "express";
import passport from "passport";

// Define a proper User type
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

// Define the context interface with proper typing
export interface GraphQLContext {
  authScope?: string;
  user?: User | null;
  req?: Request;
}

// Update createContext with better error handling and typing
export const createContext = async ({
  req,
}: {
  req: Request;
}): Promise<GraphQLContext> => {
  return new Promise((resolve) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: Error | null, user: User | undefined) => {
        if (err) {
          console.error("Authentication Error:", err);
          return resolve({
            authScope: req.headers.authorization || "",
            user: null,
            req,
          });
        }

        // If no error but no user (invalid token)
        if (!user) {
          return resolve({
            authScope: req.headers.authorization || "",
            user: null,
            req,
          });
        }

        // Successfully authenticated
        return resolve({
          authScope: req.headers.authorization || "",
          user,
          req,
        });
      }
    )(req, null, () => {});
  });
};

// Example of how to use authentication in resolvers
export const isAuthenticated = (context: GraphQLContext) => {
  if (!context.user) {
    throw new Error("Not authenticated");
  }
};

// Example of how to check for specific user roles
export const hasRole = (context: GraphQLContext, role: string) => {
  if (!context.user) {
    throw new Error("Not authenticated");
  }

  // Add your role checking logic here
  if (context.user.role !== role) {
    throw new Error("Not authorized");
  }
};
