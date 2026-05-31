import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const amenitiesTable = pgTable("amenities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAmenitySchema = createInsertSchema(amenitiesTable).omit({ id: true, createdAt: true });
export type InsertAmenity = z.infer<typeof insertAmenitySchema>;
export type Amenity = typeof amenitiesTable.$inferSelect;
