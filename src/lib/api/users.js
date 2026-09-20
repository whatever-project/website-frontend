const BASE_URL = process.env.NEXT_PUBLIC_API_URL

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Request failed: ${res.status}`)
  }
  return res.json()
}

export const usersApi = {
  /** Fetch all users */
  getAll: () => request("/users"),

  /** Create a new user */
  create: (data) =>
    request("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Update an existing user by id */
  update: (id, data) =>
    request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  /** Delete a user by id */
  delete: (id) =>
    request(`/users/${id}`, { method: "DELETE" }),
}
