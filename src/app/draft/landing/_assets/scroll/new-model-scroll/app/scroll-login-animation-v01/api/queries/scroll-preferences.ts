import { eq } from "drizzle-orm";
import { scrollPreferences } from "@db/schema";
import type { InsertScrollPreferences } from "@db/schema";
import { getDb } from "./connection";

export async function findScrollPreferences(userId: number) {
  const rows = await getDb()
    .select()
    .from(scrollPreferences)
    .where(eq(scrollPreferences.userId, userId))
    .limit(1);
  return rows.at(0) ?? null;
}

export async function upsertScrollPreferences(data: InsertScrollPreferences) {
  await getDb()
    .insert(scrollPreferences)
    .values(data)
    .onDuplicateKeyUpdate({
      set: {
        openDuration: data.openDuration,
        closeDuration: data.closeDuration,
        view: data.view,
        updatedAt: new Date(),
      },
    });
  return findScrollPreferences(data.userId);
}
