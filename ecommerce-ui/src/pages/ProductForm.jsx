import { useState, useEffect } from "react";

export default function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    inStock: true,
    image: "",
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name ?? "",
        price: product.price ?? "",
        inStock: product.inStock ?? true,
        image: product.image ?? "",
      });
    } else {
      setForm({
        name: "",
        price: "",
        inStock: true,
        image: "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="bg-white border p-5 my-4 rounded-lg shadow-md max-w-lg mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {product?.id ? "Edit Product" : "Add Product"}
      </h3>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Product Name</label>
        <input
          name="name"
          className="border p-2 w-full rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      {/* Price */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Price (₹)</label>
        <input
          name="price"
          type="number"
          className="border p-2 w-full rounded"
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>

      {/* Image URL */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Image URL</label>
        <input
          name="image"
          className="border p-2 w-full rounded"
          placeholder="https://example.com/image.jpg"
          value={form.image}
          onChange={handleChange}
        />
      </div>

      {/* Preview */}
      {form.image && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Preview:</p>
          <img
            src={form.image}
            alt="preview"
            className="h-32 w-32 object-cover rounded border"
          />
        </div>
      )}

      {/* Stock Toggle */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="inStock"
            checked={form.inStock}
            onChange={handleChange}
          />
          In Stock
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onSave(form)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
