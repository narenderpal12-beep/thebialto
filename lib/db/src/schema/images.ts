import { pgTable, serial, text, integer, timestamp, customType } from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer }>({
  dataType() { return "bytea"; },
});

export const imagesTable = pgTable("images", {
  id: serial("id").primaryKey(),
  data: bytea("data").notNull(),
  mimeType: text("mime_type").notNull().default("image/jpeg"),
  filename: text("filename"),
  size: integer("size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Image = typeof imagesTable.$inferSelect;
