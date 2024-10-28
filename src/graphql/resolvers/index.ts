import { userResolver } from "./userResolver";
import { productResolver } from "./productResolver";
import { authResolver } from "./authResolver";

export const resolvers = {
  Query: {
    ...userResolver.Query,
    ...productResolver.Query,
  },
  Mutation: {
    ...authResolver.Mutation,
    ...userResolver.Mutation,
    ...productResolver.Mutation,
  },
};
