import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const systemServices = pgTable("system_services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  size: text("size").notNull(),
  status: text("status").notNull(), // "stable" | "warning" | "critical" | "recovering" | "scanning"
  icon: text("icon").notNull(),
});

export const insertSystemServiceSchema = createInsertSchema(systemServices).omit({ id: true });

export type SystemService = typeof systemServices.$inferSelect;
export type InsertSystemService = z.infer<typeof insertSystemServiceSchema>;
