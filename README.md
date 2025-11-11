# Full Stack GraphQL E‑Commerce

Modern e‑commerce demo that pairs an Express/Apollo GraphQL API with a React (Vite) client. The backend exposes product, category, user, and order operations backed by MongoDB + DataLoader caching, while the frontend offers customer flows (catalog, checkout, order history) and an admin dashboard for managing the catalog.

> This project currently targets local development. Feel free to adapt the instructions below for your own hosting environment.

## Features
- GraphQL API powered by Apollo Server 5 with schema modules for products, categories, orders, and users.
- JWT authentication with role-based guards (customer vs. admin) exposed to resolvers through the request context.
- Dataloader-powered batching for category/product lookups to minimize N+1 database access.
- MongoDB models (Mongoose) with lean virtuals for performant reads.
- React 19 + Apollo Client UI scaffolded with Vite, Tailwind styling, and React Router for customer and admin views.
- REST fallbacks (e.g., `/api/products`) alongside the GraphQL endpoint for quick health checks or integrations.

## Tech Stack
- **Backend:** Node.js, Express 5, Apollo Server, Mongoose, JWT, Joi, DataLoader.
- **Frontend:** React 19, Vite, Apollo Client, React Router, Tailwind CSS.
- **Database:** MongoDB Atlas (or any MongoDB instance reachable via connection string).

## Getting Started

### Prerequisites
| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | 18+ | Aligns with Vite and Apollo requirements. |
| npm | 9+ | Installed with Node. |
| MongoDB URI | — | Atlas cluster or local instance. |

### Clone & Install
```bash
git clone https://github.com/Tanu020405/Full-Stack-Project.git
cd Full-Stack-Project
npm install
cd ecommerce-ui
npm install
```

### Environment Variables
Create a `.env` file in the project root (never commit secrets):
```dotenv
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
PORT=4000
JWT_SECRET=replace-with-strong-secret
```

The frontend currently points to `http://localhost:4000/graphql`. If you deploy the API elsewhere, update `ecommerce-ui/src/apollo.js` (or introduce a `VITE_API_URL` env var) before building.

### Run Locally
In two terminals:
```bash
# Backend (port 4000 by default)
npm run dev

# Frontend (inside ecommerce-ui, Vite dev server on port 5173)
cd ecommerce-ui
npm run dev
```
Visit `http://localhost:5173` for the UI and `http://localhost:4000/graphql` for the Apollo Sandbox/GraphQL Playground.

## Available Scripts

| Location | Script | Purpose |
| --- | --- | --- |
| root | `npm run dev` | Starts Express + Apollo Server with Nodemon watching `src/server.js`. |
| ecommerce-ui | `npm run dev` | Runs the Vite dev server with React Fast Refresh. |
| ecommerce-ui | `npm run build` | Produces a production build of the React client. |
| ecommerce-ui | `npm run preview` | Serves the built client locally for verification. |
| ecommerce-ui | `npm run lint` | Runs ESLint against the frontend sources. |

## GraphQL Overview
- **Endpoint:** `POST http://localhost:4000/graphql`
- **Auth:** Pass `Authorization: Bearer <JWT>` header; admin role required for mutations that manage products/categories.
- **Notable queries/mutations:**
  - `products(filter, sort, limit, offset)` returns paginated catalog data with category lookups via DataLoader.
  - `product(id)` fetches a single product.
  - `addProduct`, `updateProduct`, `deleteProduct` enforce admin authorization.
  - Additional modules handle categories, orders, and users (see `src/graphql/typeDefs` & `src/graphql/resolvers`).

## Project Structure
```
.
├── src/                # Express server, Mongo config, GraphQL schema/resolvers, loaders, models
├── ecommerce-ui/       # React/Vite client (pages, Apollo client, routing, Tailwind styles)
├── package.json        # Backend scripts and dependencies
├── ecommerce-ui/package.json
└── .env.example?       # Create locally per instructions above
```

## Deployment Notes
1. Provision a MongoDB database and update `MONGO_URI`.
2. Build the frontend (`npm run build` inside `ecommerce-ui`) and serve the static assets (e.g., from an S3 bucket, Vercel, or behind Express if you integrate the dist folder).
3. Deploy the backend (Render, Railway, Fly.io, etc.). Ensure `PORT` and `JWT_SECRET` are set via environment variables and that the GraphQL URL matches what the frontend expects.

Feel free to open issues or PRs in the GitHub repo if you extend the schema, add tests, or harden auth flows.
