import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  propertyName: text("property_name").notNull().default("The Bialto by Asemont Estate"),
  tagline: text("tagline").notNull().default("Experience Luxury in the Hills of Kasauli"),
  address: text("address").notNull().default("Dochi Road, Kasauli, Himachal Pradesh, India"),
  phone: text("phone").notNull().default("+91 77176 02625"),
  email: text("email").notNull().default("TheBialto@gmail.com"),
  whatsapp: text("whatsapp").notNull().default("+91 77176 02625"),
  logoUrl: text("logo_url"),
  heroImages: text("hero_images").array().notNull().default([]),
  facebook: text("facebook"),
  instagram: text("instagram"),
  twitter: text("twitter"),
  googleMapsEmbed: text("google_maps_embed"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSettingsSchema = createInsertSchema(settingsTable).omit({ id: true, updatedAt: true });
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settingsTable.$inferSelect;
