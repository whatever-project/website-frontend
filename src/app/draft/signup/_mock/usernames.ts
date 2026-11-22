/**
 * Mock of the "is this username free?" API (the real one is a database lookup, see CONTEXT.md section 5). Names are compared
 * case-insensitively. Try one of these in the draft to see the "already taken" message.
 */
export const TAKEN_USERNAMES = ["admin", "test", "user", "whatever", "wanderer"]

/** Resolves true when the username is free. Fake 400 ms latency, like a network call. */
export function checkUsernameAvailable(name: string): Promise<boolean> {
  return new Promise((resolve) => setTimeout(() => resolve(!TAKEN_USERNAMES.includes(name.toLowerCase())), 400))
}
