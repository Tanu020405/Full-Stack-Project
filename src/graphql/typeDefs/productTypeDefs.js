import gql from "graphql-tag";

const productTypeDefs = gql`
  scalar DateTime

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    inStock: Boolean
    category: Category
    rating: Float
    popularity: Int
    image: String
    createdAt: DateTime
  }

  input ProductFilterInput {
    categoryIds: [ID!]
    minPrice: Float
    maxPrice: Float
    inStock: Boolean
    search: String
  }

  enum ProductSortField {
    price
    createdAt
    name
    popularity
  }

  enum SortOrder {
    asc
    desc
  }

  input ProductSortInput {
    field: ProductSortField! = createdAt
    order: SortOrder! = desc
  }

  type ProductPage {
    items: [Product!]!
    totalCount: Int!
  }

  type Query {
    products(
      filter: ProductFilterInput
      sort: ProductSortInput
      limit: Int = 10
      offset: Int = 0
    ): ProductPage!

    product(id: ID!): Product
  }

  input ProductInput {
    name: String!
    description: String
    price: Float!
    categoryId: ID
    inStock: Boolean
    image: String
  }

  type Mutation {
    addProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): Boolean
  }
`;

export default productTypeDefs;
