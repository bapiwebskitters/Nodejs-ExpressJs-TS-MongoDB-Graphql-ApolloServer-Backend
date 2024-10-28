// src/graphql/resolvers/authResolver.ts
import AuthController from "../../controllers/AuthController";

export const authResolver = {
  Mutation: {
    login: async (_: any, args: { email: string; password: string }) => {
      return await AuthController.login(args);
    },
    register: async (
      _: any,
      args: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        password: string;
        role: string;
      }
    ) => {
      console.log("register", args);
      
      const resp = await AuthController.register(args);
      
      console.log("User registration resp", resp);
      return resp;

    },
    forgotPassword: async (_: any, args: { email: string }) => {
      return await AuthController.forgotPassword(args);
    },
    resetPassword: async (
      _: any,
      args: { token: string; password: string }
    ) => {
      return await AuthController.resetPassword(args);
    },
    logout: async (_: any, args: { userId: string }) => {
      return await AuthController.logout(args);
    },
  },
};
