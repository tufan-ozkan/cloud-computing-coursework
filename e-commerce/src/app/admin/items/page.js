'use client';

import { useEffect, useState } from "react";

export default function AdminItemsPage() {
  const [items, setItems] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);

    const fetchItems = async () => {
      const res = await fetch("/api/items");
      const data = await res.json();
      setItems(data);
    };

    fetchItems();
  }, []);

  const deleteItem = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this item?");
    if (!confirm) return;

    const res = await fetch(`/api/items/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setItems(items.filter((item) => item._id !== id));
    } else {
      alert("Failed to delete item.");
    }
  };

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-center">Manage Items</h1>

      {items.length === 0 ? (
        <p className="text-center text-gray-500">No items found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md border overflow-hidden flex flex-col"
            >
              {item.Image && (
                <img
                  src={item.Image}
                  alt={item.Name}
                  className="w-full h-48 object-contain border-b"
                />
              )}

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{item.Name}</h2>
                  <p className="text-sm text-gray-500 mb-2">{item.Category}</p>
                  <p className="text-green-600 font-semibold">${item.Price}</p>
                </div>

                <button
                  onClick={() => deleteItem(item._id)}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
