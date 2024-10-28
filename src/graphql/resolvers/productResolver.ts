import { GraphQLError } from "graphql";

export const productResolver = {
  Query: {
    getProduct: async (_: any, { id }: { id: string }, context: any) => {
      // Check if user is authenticated
      if (!context.user) {
        throw new GraphQLError("User is not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }

      // Replace with actual database query
      return { id, name: "Sample Product", price: 29.99 };
    },
    getAllProducts: async (_: any, __: any, context: any) => {
      // Check if user is authenticated
      if (!context.user) {
        throw new GraphQLError("User is not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }

      console.log("Getting all products", context);
      
      // Replace with actual database query
      return [
        { id: "1", name: "Sample Product", price: 29.99 },
        { id: "2", name: "Another Product", price: 49.99 },
      ];
    },
  },
  Mutation: {
    createProduct: async (
      _: any,
      { name, price }: { name: string; price: number },
      context: any
    ) => {
      // Check if user is authenticated
      if (!context.user) {
        throw new GraphQLError("User is not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }

      // Replace with actual database query to create a new product
      return { id: "3", name, price };
    },
  },
};
