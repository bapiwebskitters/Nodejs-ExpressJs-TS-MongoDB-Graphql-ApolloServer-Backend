import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "../graphql/schemas";
import { resolvers } from "../graphql/resolvers";
import { createContext, GraphQLContext } from "../graphql/context";
import { json } from "body-parser";
import cors from "cors";
import { Request, Response } from "express";

export const createApolloServer = async () => {
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    introspection: true,
    formatError: (error) => {
      console.error("GraphQL Error:", error);
      return error;
    },
  });

  await server.start();

  const middleware = expressMiddleware(server, {
    context: async ({ req }: { req: Request }) => {
      const context = await createContext({ req });
      return {
        ...context,
        req,
      };
    },
  });

  return {
    middleware: [cors(), json(), middleware],
  };
};
