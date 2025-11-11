import gql from "graphql-tag";

const categoryTypeDefs = gql`
  scalar DateTime

  type Category {
    id: ID!
    name: String!
    description: String
    createdAt: DateTime
  }

  input CategorySortInput {
    field: String = "createdAt"
    order: Int = -1
  }

  type CategoryPage {
    items: [Category!]!
    totalCount: Int!
  }

  type Query {
    categories(
      limit: Int = 20
      offset: Int = 0
      sort: CategorySortInput
    ): CategoryPage!

    category(id: ID!): Category
  }

  type Mutation {
    addCategory(name: String!, description: String): Category
    deleteCategory(id: ID!): Boolean
  }
`;

export default categoryTypeDefs;
