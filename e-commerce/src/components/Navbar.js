'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const categories = [
  "Vinyls",
  "Antique Furniture",
  "GPS Sport Watches",
  "Running Shoes"
];

export default function Navbar() {
  const { token, role, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    router.push("/");
  };

  return (
    <nav className="flex flex-wrap items-center justify-between px-6 py-4 border-b shadow-sm bg-white">
      <Link href="/" className="text-xl font-bold text-blue-700">
        🛍️ Tufan&apos;s E-Commerce
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <Link href="/items" className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">
          Products
        </Link>

        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/items/category/${encodeURIComponent(cat)}`}
            className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
          >
            {cat}
          </Link>
        ))}

        {role === "admin" && (
          <Link
            href="/admin"
            className="px-3 py-1 border border-purple-500 text-purple-700 rounded text-sm hover:bg-purple-50"
          >
            Admin Dashboard
          </Link>
        )}
      </div>

      <div className="relative">
        {token ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="px-3 py-1 border rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
            >
              My Account ▾
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow text-sm z-50">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    router.push("/account");
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="px-3 py-1 border rounded text-sm text-blue-600 hover:bg-blue-50"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
