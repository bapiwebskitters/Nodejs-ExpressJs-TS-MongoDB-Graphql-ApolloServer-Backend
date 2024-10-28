import { Request } from "express";
import passport from "passport";

// Define the context interface
export interface GraphQLContext {
  authScope?: string;
  user?: any;
}

// Update createContext to include authenticated user
export const createContext = async ({
  req,
}: {
  req: Request;
}): Promise<GraphQLContext> => {
  return new Promise((resolve) => {
    passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
      if (err) {
        console.error(err);
        resolve({ authScope: req.headers.authorization || "", user: null });
      }
      resolve({
        authScope: req.headers.authorization || "",
        user,
      });
    })(req, null, () => {});
  });
};
