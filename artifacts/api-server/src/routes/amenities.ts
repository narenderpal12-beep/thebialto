import { Router } from "express";
import { db, amenitiesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", async (_req, res) => {
  const amenities = await db.select().from(amenitiesTable).orderBy(asc(amenitiesTable.sortOrder));
  res.json(amenities);
});

router.post("/", requireAdmin, async (req, res) => {
  const { name, icon, description, sortOrder } = req.body;
  const [amenity] = await db.insert(amenitiesTable).values({ name, icon, description, sortOrder: sortOrder ?? 0 }).returning();
  res.status(201).json(amenity);
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const updates: any = {};
  const fields = ["name","icon","description","sortOrder"];
  for (const f of fields) if (req.body[f] !== undefined) updates[f] = req.body[f];
  const [amenity] = await db.update(amenitiesTable).set(updates).where(eq(amenitiesTable.id, id)).returning();
  if (!amenity) { res.status(404).json({ error: "Not found" }); return; }
  res.json(amenity);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await db.delete(amenitiesTable).where(eq(amenitiesTable.id, Number(req.params.id)));
  res.status(204).end();
});

export default router;
