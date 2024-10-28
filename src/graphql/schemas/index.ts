import { userSchema } from "./userSchema";
import { productSchema } from "./productSchema";
import { authSchema } from "./authSchema";

export const typeDefs = [authSchema, userSchema, productSchema];
