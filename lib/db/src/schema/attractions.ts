import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const attractionsTable = pgTable("attractions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  distance: text("distance").notNull(),
  travelTime: text("travel_time").notNull(),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAttractionSchema = createInsertSchema(attractionsTable).omit({ id: true, createdAt: true });
export type InsertAttraction = z.infer<typeof insertAttractionSchema>;
export type Attraction = typeof attractionsTable.$inferSelect;
