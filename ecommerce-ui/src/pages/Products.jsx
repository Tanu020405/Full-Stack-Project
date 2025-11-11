import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const GET_PRODUCTS = gql`
  query GetProducts($search: String, $sort: ProductSortInput) {
    products(filter: { search: $search }, sort: $sort) {
      items {
        id
        name
        price
        inStock
        image
      }
    }
  }
`;

export default function Products() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ field: "createdAt", order: "desc" });

  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
    variables: { search: "", sort },
    fetchPolicy: "cache-and-network",
  });

  // Debounced Search
  useEffect(() => {
    const delay = setTimeout(() => {
      refetch({ search, sort });
    }, 300);

    return () => clearTimeout(delay);
  }, [search, sort, refetch]);

  const products = data?.products?.items ?? [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-700 mb-6">Products</h2>

      {/* Search + Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 border rounded outline-none focus:ring-2 focus:ring-slate-400"
        />

        <select
          value={`${sort.field}-${sort.order}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split("-");
            setSort({ field, order });
          }}
          className="p-3 border rounded cursor-pointer bg-white"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Product List */}
      {loading && !data ? (
        <p className="p-6">Loading...</p>
      ) : error ? (
        <p className="p-6 text-red-500">Error: {error.message}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition p-4"
            >
              <img
                src={p.image || "https://via.placeholder.com/200"}
                alt={p.name}
                className="w-full h-40 object-cover rounded"
              />

              <h3 className="text-lg font-semibold text-slate-800 mt-3">
                {p.name}
              </h3>

              <p className="text-slate-600 mb-2">₹{p.price}</p>

              <p className="text-sm mb-3">
                {p.inStock ? (
                  <span className="text-green-600">In Stock</span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </p>

              <Link
                to={`/order/${p.id}`}
                className="bg-slate-600 hover:bg-slate-700 text-white text-center block py-2 rounded"
              >
                Order Now
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
