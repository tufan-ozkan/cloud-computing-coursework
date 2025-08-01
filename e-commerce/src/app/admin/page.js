'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircleIcon, TrashIcon, UsersIcon } from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(stored.split('.')[1]));
      if (payload.role === "admin") {
        setIsAdmin(true);
        setToken(stored);
      } else {
        router.push("/");
      }
    } catch (err) {
      router.push("/");
    }
  }, []);

  if (!isAdmin) return <p className="p-6 text-center text-gray-600">Checking admin access...</p>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">🔧 Admin Dashboard</h1>

      <div className="grid sm:grid-cols-2 gap-6">
        <a href="/admin/items/new" className="group p-6 rounded-xl shadow hover:shadow-lg border hover:border-blue-500 transition duration-300 bg-white">
          <div className="flex items-center gap-4">
            <PlusCircleIcon className="h-8 w-8 text-blue-600 group-hover:scale-110 transition" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Add New Item</h2>
              <p className="text-sm text-gray-500">Create and list a new product.</p>
            </div>
          </div>
        </a>

        <a href="/admin/items" className="group p-6 rounded-xl shadow hover:shadow-lg border hover:border-red-500 transition duration-300 bg-white">
          <div className="flex items-center gap-4">
            <TrashIcon className="h-8 w-8 text-red-600 group-hover:scale-110 transition" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Manage Items</h2>
              <p className="text-sm text-gray-500">Edit or delete existing listings.</p>
            </div>
          </div>
        </a>

        <a href="/admin/users" className="group p-6 rounded-xl shadow hover:shadow-lg border hover:border-green-500 transition duration-300 bg-white">
          <div className="flex items-center gap-4">
            <UsersIcon className="h-8 w-8 text-green-600 group-hover:scale-110 transition" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Manage Users</h2>
              <p className="text-sm text-gray-500">View, add, or remove users.</p>
            </div>
          </div>
        </a>
      </div>
    </main>
  );
}
