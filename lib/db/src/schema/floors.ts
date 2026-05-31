import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const floorsTable = pgTable("floors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  floorNumber: integer("floor_number").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFloorSchema = createInsertSchema(floorsTable).omit({ id: true, createdAt: true });
export type InsertFloor = z.infer<typeof insertFloorSchema>;
export type Floor = typeof floorsTable.$inferSelect;
