// Legacy compatibility shim — the home page (page.js) previously imported from here.
// Now page.js fetches directly; this file is kept in case other code imports it.

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export const usersApi = {
  /** Fetch all users (returns id, username, email, role, status) */
  getAll: () => request("/users"),

  /** Hard-delete a user by id */
  delete: (id) => request(`/users/${id}`, { method: "DELETE" }),
};
