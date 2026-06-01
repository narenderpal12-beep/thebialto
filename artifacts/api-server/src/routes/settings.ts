import { Router } from "express";
import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

async function getOrCreateSettings() {
  const rows = await db.select().from(settingsTable);
  if (rows.length > 0) return rows[0];
  const [created] = await db.insert(settingsTable).values({}).returning();
  return created;
}

router.get("/", async (_req, res) => {
  const settings = await getOrCreateSettings();
  res.json(settings);
});

router.patch("/", requireAdmin, async (req, res) => {
  const settings = await getOrCreateSettings();
  const updates: any = {};
  const fields = [
    "propertyName","tagline","address","phone","email","whatsapp",
    "logoUrl","heroImages","facebook","instagram","twitter",
    "googleMapsEmbed","metaTitle","metaDescription",
    "primaryColor","secondaryColor","accentColor","darkMode",
    // Homepage sections
    "heroTagline","heroTitle","heroDescription","heroCtaText",
    "aboutLabel","aboutTitle","aboutDescription","aboutImage","aboutCtaText",
    "floorsSectionLabel","floorsSectionTitle",
    "footerTagline",
  ];
  for (const f of fields) {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  }
  updates.updatedAt = new Date();
  const [updated] = await db.update(settingsTable).set(updates).where(eq(settingsTable.id, settings.id)).returning();
  res.json(updated);
});

export default router;
