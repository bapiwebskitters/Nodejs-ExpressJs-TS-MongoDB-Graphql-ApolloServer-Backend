import { gql } from "graphql-tag";

export const userSchema = gql`
  # User type definition
  type User {
    id: ID!
    name: String!
    email: String!
    phone: String!
    role: String!
    createdAt: String!
    updatedAt: String!
  }

  # Input types for mutations
  input CreateUserInput {
    name: String!
    email: String!
    phone: String!
  }

  input UpdateUserInput {
    id: ID!
    name: String
    email: String
    phone: String
  }

  # Response types
  type DeleteUserResponse {
    success: Boolean!
    message: String!
  }

  type UserResponse {
    success: Boolean!
    message: String
    user: User
  }

  type UsersResponse {
    success: Boolean!
    message: String
    users: [User!]
  }

  # Queries
  type Query {
    getUser(id: ID!): UserResponse!
    getAllUsers(page: Int, limit: Int): UsersResponse!
    searchUsers(query: String!): UsersResponse!
  }

  # Mutations
  type Mutation {
    createUser(input: CreateUserInput!): UserResponse!
    updateUser(input: UpdateUserInput!): UserResponse!
    deleteUser(id: ID!): DeleteUserResponse!
  }
`;
