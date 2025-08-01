'use client';

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ UserName: "", Password: "", Role: "user" });
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return;

    setToken(t);

    fetch("/api/users", {
      headers: {
        Authorization: `Bearer ${t}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addUser = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const newUser = await res.json();
      setForm({ UserName: "", Password: "", Role: "user" });

      const usersRes = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUsers = await usersRes.json();
      setUsers(updatedUsers);
    } else {
      alert("Failed to add user.");
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setUsers(users.filter((u) => u._id !== id));
    } else {
      alert("Failed to delete user.");
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-center">Manage Users</h1>

      {/* Add User Form */}
      <form onSubmit={addUser} className="space-y-4 bg-white border rounded-xl shadow-md p-6 mb-10">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Add New User</h2>

        <div>
          <label className="block font-medium mb-1">Username</label>
          <input
            name="UserName"
            value={form.UserName}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            name="Password"
            type="password"
            value={form.Password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Role</label>
          <select
            name="Role"
            value={form.Role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          Add User
        </button>
      </form>

      {/* User List */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Existing Users</h2>
      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white border rounded-lg shadow-sm px-4 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">{user.UserName}</p>
                <p className="text-sm text-gray-500">Role: {user.Role}</p>
              </div>

              <button
                onClick={() => deleteUser(user._id)}
                className="bg-red-100 hover:bg-red-200 text-red-700 font-medium px-4 py-2 rounded-md border border-red-300 transition-colors w-full sm:w-auto"
              >
                Delete User
              </button>
            </div>
          ))}

        </div>
      )}
    </main>
  );
}
