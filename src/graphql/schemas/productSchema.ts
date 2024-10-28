import { gql } from "graphql-tag";

export const productSchema = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
  }

  type Query {
    getProduct(id: ID!): Product
    getAllProducts: [Product]
  }

  type Mutation {
    createProduct(name: String!, price: Float!): Product
  }
`;
