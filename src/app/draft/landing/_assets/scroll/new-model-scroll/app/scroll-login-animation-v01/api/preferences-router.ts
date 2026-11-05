import { z } from "zod";
import { authedQuery, createRouter } from "./middleware";
import { findScrollPreferences, upsertScrollPreferences } from "./queries/scroll-preferences";

const preferenceInput = z.object({
  openDuration: z.number().int().min(800).max(3000),
  closeDuration: z.number().int().min(700).max(3000),
  view: z.enum(["front", "elevated", "perspective", "side"]),
});

export const preferencesRouter = createRouter({
  get: authedQuery.query(({ ctx }) => findScrollPreferences(ctx.user.id)),
  update: authedQuery.input(preferenceInput).mutation(({ ctx, input }) =>
    upsertScrollPreferences({ ...input, userId: ctx.user.id }),
  ),
});
