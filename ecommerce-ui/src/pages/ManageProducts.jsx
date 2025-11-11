import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import ProductForm from "./ProductForm";

const GET_PRODUCTS = gql`
  query GetProducts {
    products(limit: 50) {
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

const ADD_PRODUCT = gql`
  mutation AddProduct($input: ProductInput!) {
    addProduct(input: $input) {
      id
      name
      price
      inStock
      image
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      price
      inStock
      image
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export default function ManageProducts() {
  const { data, loading, refetch } = useQuery(GET_PRODUCTS);
  const [addProduct] = useMutation(ADD_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const [editingProduct, setEditingProduct] = useState(null);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  const handleSave = async (form) => {
    const input = {
      name: form.name || "",
      description: form.description || "",
      price: parseFloat(form.price) || 0,
      inStock: form.inStock,
      image: form.image || "",
    };

    if (editingProduct && editingProduct.id) {
      await updateProduct({ variables: { id: editingProduct.id, input } });
    } else {
      await addProduct({ variables: { input } });
    }

    setEditingProduct(null);
    refetch();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete product?")) return;
    await deleteProduct({ variables: { id } });
    refetch();
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">📦 Manage Products</h2>

        <button
          onClick={() =>
            setEditingProduct({ name: "", price: "", inStock: true, image: "" })
          }
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm transition"
        >
          + Add Product
        </button>
      </div>

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {/* Products List */}
      <div className="grid gap-4">
        {data.products.items.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-16 w-16 object-cover rounded-md border"
                />
              ) : (
                <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div>
                <p className="text-lg font-medium text-gray-900">{p.name}</p>
                <p className="text-gray-600 text-sm">₹{p.price}</p>
                <p className="text-sm mt-1">
                  {p.inStock ? (
                    <span className="text-green-600">In Stock ✅</span>
                  ) : (
                    <span className="text-red-500">Out of Stock ❌</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingProduct(p)}
                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
