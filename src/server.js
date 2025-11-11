import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs, resolvers } from "./graphql/index.js";
import cors from "cors";
import bodyParser from "body-parser";
import createCategoryLoader from "./loaders/categoryLoaders.js";
import createProductLoader from "./loaders/productLoaders.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/products", productRoutes);

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });

  await server.start();

  app.use(
    "/graphql",
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.split(" ")[1];

        let user = null;
        if (token) {
          try {
            user = jwt.verify(token, process.env.JWT_SECRET);
          } catch (err) {
            user = null;
          }
        }

        const loaders = {
          categoryLoader: createCategoryLoader(),
          productLoader: createProductLoader(),
        };

        return { user, loaders, reqId: req.headers["x-request-id"] || null };
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
