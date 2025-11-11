import gql from "graphql-tag";

const userTypeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: DateTime
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type UserPage {
    items: [User!]!
    totalCount: Int!
  }

  type Query {
    # ✅ Admin-only (we enforce this in resolver)
    users(limit: Int = 20, offset: Int = 0): UserPage!

    # ✅ Logged-in user fetches their own profile
    me: User
  }

  type Mutation {
    registerUser(input: RegisterInput!): AuthPayload!
    loginUser(input: LoginInput!): AuthPayload!
  }
`;

export default userTypeDefs;
