import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),

  // General
  propertyName: text("property_name").notNull().default("The Bialto by Asemont Estate"),
  tagline: text("tagline").notNull().default("Experience Luxury in the Hills of Kasauli"),
  address: text("address").notNull().default("Dochi Road, Kasauli, Himachal Pradesh, India"),
  phone: text("phone").notNull().default("+91 77176 02625"),
  email: text("email").notNull().default("TheBialto@gmail.com"),
  whatsapp: text("whatsapp").notNull().default("+91 77176 02625"),

  // Brand
  logoUrl: text("logo_url"),
  heroImages: text("hero_images").array().notNull().default([]),

  // Social / SEO
  facebook: text("facebook"),
  instagram: text("instagram"),
  twitter: text("twitter"),
  googleMapsEmbed: text("google_maps_embed"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),

  // Theme
  primaryColor: text("primary_color"),
  secondaryColor: text("secondary_color"),
  accentColor: text("accent_color"),
  darkMode: boolean("dark_mode").notNull().default(true),

  // Hero Section
  heroTagline: text("hero_tagline"),
  heroTitle: text("hero_title"),
  heroDescription: text("hero_description"),
  heroCtaText: text("hero_cta_text"),

  // About Section (homepage)
  aboutLabel: text("about_label"),
  aboutTitle: text("about_title"),
  aboutDescription: text("about_description"),
  aboutImage: text("about_image"),
  aboutCtaText: text("about_cta_text"),

  // Floors Section
  floorsSectionLabel: text("floors_section_label"),
  floorsSectionTitle: text("floors_section_title"),

  // Footer
  footerTagline: text("footer_tagline"),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSettingsSchema = createInsertSchema(settingsTable).omit({ id: true, updatedAt: true });
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settingsTable.$inferSelect;
