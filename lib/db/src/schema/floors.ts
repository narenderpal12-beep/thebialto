import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const floorsTable = pgTable("floors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  floorNumber: integer("floor_number").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  galleryImages: text("gallery_images").array().notNull().default([]),
  isAvailable: boolean("is_available").notNull().default(true),
  hasKitchen: boolean("has_kitchen").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFloorSchema = createInsertSchema(floorsTable).omit({ id: true, createdAt: true });
export type InsertFloor = z.infer<typeof insertFloorSchema>;
export type Floor = typeof floorsTable.$inferSelect;
