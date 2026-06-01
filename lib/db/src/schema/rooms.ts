import { pgTable, serial, text, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { floorsTable } from "./floors";

export const roomsTable = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  floorId: integer("floor_id").notNull().references(() => floorsTable.id),
  roomType: text("room_type").notNull(),
  featureImageUrl: text("feature_image_url"),
  galleryImages: text("gallery_images").array().notNull().default([]),
  pricePerNight: real("price_per_night").notNull(),
  adultCapacity: integer("adult_capacity").notNull().default(2),
  childCapacity: integer("child_capacity").notNull().default(0),
  amenities: text("amenities").array().notNull().default([]),
  description: text("description").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  isPublished: boolean("is_published").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRoomSchema = createInsertSchema(roomsTable).omit({ id: true, createdAt: true });
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof roomsTable.$inferSelect;
