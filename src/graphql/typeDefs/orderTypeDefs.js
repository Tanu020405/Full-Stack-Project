import gql from "graphql-tag";

const orderTypeDefs = gql`
  scalar DateTime
  scalar Decimal

  type OrderItem {
    product: Product
    quantity: Int!
    price: Float!
  }

  type Order {
    id: ID!
    user: User!
    items: [OrderItem!]!
    totalAmount: Float!
    status: String!
    createdAt: DateTime
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  input OrderSortInput {
    field: String = "createdAt"
    order: Int = -1   # -1 = DESC, 1 = ASC
  }

  type OrderPage {
    items: [Order!]!
    totalCount: Int!
  }

  type Query {
    orders(
      limit: Int = 10
      offset: Int = 0
      sort: OrderSortInput
    ): OrderPage!                 
    order(id: ID!): Order
  }

  type Mutation {
    placeOrder(items: [OrderItemInput!]!): Order!        # Auth: customer
    updateOrderStatus(id: ID!, status: String!): Order!  # Auth: admin only
    cancelMyOrder(id: ID!): Order! 
    deleteMyOrder(id: ID!): Boolean
    deleteOrder(id: ID!): Boolean
  }
`;

export default orderTypeDefs;
