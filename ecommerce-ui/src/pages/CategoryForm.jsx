import { useState, useEffect } from "react";

export default function CategoryForm({ category, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(category?.name ?? "");
    setDescription(category?.description ?? "");
  }, [category]);

  const submit = () => {
    if (!name.trim()) return alert("Name is required");
    onSave({ name, description });
  };

  return (
    <div className="border p-4 rounded mb-4">
      <h3 className="font-semibold mb-2">
        {category ? "Edit Category" : "Add Category"}
      </h3>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex gap-3">
        <button onClick={submit} className="bg-green-600 text-white px-3 py-1 rounded">
          Save
        </button>
        <button onClick={onCancel} className="bg-gray-400 px-3 py-1 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}
