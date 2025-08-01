'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const baseFields = ["Name", "Description", "Price", "Image"];

const categoryOptions = [
  "Vinyls",
  "Antique Furniture",
  "GPS Sport Watches",
  "Running Shoes",
];

export default function AddItemPage() {
  const [form, setForm] = useState({
    Name: "",
    Category: "",
    Price: "",
    Description: "",
    Image: "",
    Age: "",
    Material: "",
    BatteryLife: "",
    Size: "",
  });

  const [token, setToken] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      router.push("/login");
      return;
    }

    const payload = JSON.parse(atob(stored.split(".")[1]));
    if (payload.role !== "admin") {
      router.push("/");
    }

    setToken(stored);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/items");
    } else {
      const data = await res.json();
      setError(data.message || "Error adding item");
    }
  };

  const getRelevantFields = () => {
    const category = form.Category;
    let fields = [...baseFields];

    if (category) {
      if (["Vinyls", "Antique Furniture"].includes(category)) fields.push("Age");
      if (["Antique Furniture", "Running Shoes"].includes(category)) fields.push("Material");
      if (category === "GPS Sport Watches") fields.push("BatteryLife");
      if (category === "Running Shoes") fields.push("Size");
    }

    return fields;
  };

  const relevantFields = getRelevantFields();

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-center">Add New Item</h1>
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md border">
        {/* Category Dropdown */}
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            name="Category"
            value={form.Category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Relevant Inputs */}
        {relevantFields.map((field) => (
          <div key={field}>
            <label className="block font-semibold mb-1">{field}</label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={["Name", "Price", "Description", "Image", "Category"].includes(field)}
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Add Item
        </button>
      </form>
    </main>
  );
}
