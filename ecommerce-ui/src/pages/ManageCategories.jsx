import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import CategoryForm from "./CategoryForm";

const GET_CATEGORIES = gql`
  query GetCategories {
    categories(limit: 50) {
      totalCount
      items {
        id
        name
        description
      }
    }
  }
`;


const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!, $description: String) {
    addCategory(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export default function ManageCategories() {
  const { data, loading, refetch } = useQuery(GET_CATEGORIES);
  const [addCategory] = useMutation(ADD_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);
  const categories = data?.categories?.items ?? [];

  const [editing, setEditing] = useState(null);

  if (loading) return <p>Loading...</p>;

  const handleSave = async (form) => {
    await addCategory({ variables: form });
    setEditing(null);
    refetch();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete category?")) return;
    await deleteCategory({ variables: { id } });
    refetch();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-3">Manage Categories</h2>

      <button
        onClick={() => setEditing({})}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        + Add Category
      </button>

      {editing && (
        <CategoryForm
          category={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {categories.map((c) => (
        <div key={c.id} className="border p-3 mb-2 rounded flex justify-between">
          <div>
            <p className="font-bold">{c.name}</p>
            <p className="text-gray-600">{c.description}</p>
          </div>
          <button
            onClick={() => handleDelete(c.id)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
