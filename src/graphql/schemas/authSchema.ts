import { gql } from "graphql-tag";

export const authSchema = gql`
  # Base User Type Definition
  type User {
    _id: String!
    first_name: String!
    last_name: String!
    email: String!
    phone: String
    role: String
  }

  # General Response Type
  type Response {
    status: String!
    message: String!
  }

  # Auth-specific Response Types
  type AuthPayload {
    status: String!
    message: String!
    data: User
  }

  # Payload including Token for Login
  type AuthLoginPayload {
    status: String!
    message: String!
    data: AuthLoginData
  }

  type AuthLoginData {
    user: User
    token: String!
  }

  # Mutations for Authentication Actions
  type Mutation {
    # Register Mutation, returns AuthPayload (without token)
    register(
      first_name: String!
      last_name: String!
      email: String!
      phone: String
      password: String!
      role: String!
    ): AuthPayload!

    # Login Mutation, returns AuthLoginPayload with token and user
    login(email: String!, password: String!): AuthLoginPayload!

    # Logout, Forgot Password, and Reset Password Mutations, each returns Response
    logout: Response!
    forgotPassword(email: String!): Response!
    resetPassword(token: String!, password: String!): Response!
  }
`;
