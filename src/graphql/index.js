import productTypeDefs from "./typeDefs/productTypeDefs.js";
import categoryTypeDefs from "./typeDefs/categoryTypeDefs.js";
import orderTypeDefs from "./typeDefs/orderTypeDefs.js";
import userTypeDefs from "./typeDefs/userTypeDefs.js";

import productResolvers from "./resolvers/productResolvers.js";
import categoryResolvers from "./resolvers/categoryResolvers.js";
import orderResolvers from "./resolvers/orderResolvers.js";
import userResolvers from "./resolvers/userResolvers.js";

export const typeDefs = [
  productTypeDefs,
  categoryTypeDefs,
  orderTypeDefs,
  userTypeDefs,
];

export const resolvers = [
  productResolvers,
  categoryResolvers,
  orderResolvers,
  userResolvers,
];
