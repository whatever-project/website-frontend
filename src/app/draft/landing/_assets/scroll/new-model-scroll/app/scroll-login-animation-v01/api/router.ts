import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { preferencesRouter } from "./preferences-router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  preferences: preferencesRouter,
});

export type AppRouter = typeof appRouter;
