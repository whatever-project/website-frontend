"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ── Minimal inline fetch for the legacy /users endpoint ─────────────────────
// The new auth system uses @/lib/api.ts (session-based).
// This home page demo uses the legacy GET /users (read-only, no auth needed).
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function fetchUsers() {
  const res = await fetch(`${API}/users`, { credentials: "include" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

async function deleteUser(id) {
  const res = await fetch(`${API}/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Delete failed: ${res.status}`);
  }
  return res.json();
}

const ROLE_COLORS = {
  admin: "bg-yellow-900/60 text-yellow-300 border-yellow-800",
  moderator: "bg-blue-900/60 text-blue-300 border-blue-800",
  member: "bg-zinc-800 text-zinc-400 border-zinc-700",
  guest: "bg-zinc-800 text-zinc-500 border-zinc-700",
};

const STATUS_COLORS = {
  active: "text-green-400",
  suspended: "text-amber-400",
  banned: "text-red-500",
  deleted: "text-zinc-600",
};

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this user?")) return;
    setDeletingId(id);
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Users</h1>
            <p className="text-zinc-500 text-sm mt-1">
              Express + Drizzle + Supabase — read-only demo
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <Link
              href="/login"
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-white text-zinc-900 px-4 py-2 text-sm font-semibold hover:bg-zinc-100 transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-950/40 border border-red-800 px-4 py-3 text-red-400 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-300 ml-4">✕</button>
          </div>
        )}

        {/* User List */}
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-500 text-sm animate-pulse">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading users…
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 px-6 py-10 text-center text-zinc-600 text-sm">
            No users yet. <Link href="/signup" className="text-zinc-400 hover:text-white underline">Create one →</Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4"
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 font-semibold text-sm select-none">
                  {user.username?.charAt(0)?.toUpperCase() ?? "?"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white truncate">@{user.username}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${ROLE_COLORS[user.role] ?? ROLE_COLORS.member}`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">
                    {user.email} ·{" "}
                    <span className={STATUS_COLORS[user.status] ?? "text-zinc-500"}>
                      {user.status}
                    </span>
                    {" "}· #{user.id}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={deletingId === user.id}
                    className="rounded-lg bg-red-950/40 border border-red-900 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-950/70 disabled:opacity-50 transition-colors"
                  >
                    {deletingId === user.id ? "…" : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Footer nav */}
        <div className="pt-4 border-t border-zinc-800 flex flex-wrap gap-4 text-xs text-zinc-600">
          <Link href="/login" className="hover:text-zinc-400 transition-colors">Sign in</Link>
          <Link href="/signup" className="hover:text-zinc-400 transition-colors">Sign up</Link>
          <Link href="/forgot-password" className="hover:text-zinc-400 transition-colors">Forgot password</Link>
          <Link href="/dashboard" className="hover:text-zinc-400 transition-colors">Dashboard</Link>
          <Link href="/admin/logs" className="hover:text-zinc-400 transition-colors">Admin logs</Link>
        </div>
      </div>
    </div>
  );
}