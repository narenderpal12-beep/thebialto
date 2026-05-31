import { Router } from "express";
import { db, attractionsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", async (_req, res) => {
  const attractions = await db.select().from(attractionsTable).orderBy(asc(attractionsTable.sortOrder));
  res.json(attractions);
});

router.post("/", requireAdmin, async (req, res) => {
  const { name, description, distance, travelTime, imageUrl, sortOrder } = req.body;
  const [attraction] = await db.insert(attractionsTable).values({ name, description, distance, travelTime, imageUrl, sortOrder: sortOrder ?? 0 }).returning();
  res.status(201).json(attraction);
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const updates: any = {};
  const fields = ["name","description","distance","travelTime","imageUrl","sortOrder"];
  for (const f of fields) if (req.body[f] !== undefined) updates[f] = req.body[f];
  const [attraction] = await db.update(attractionsTable).set(updates).where(eq(attractionsTable.id, id)).returning();
  if (!attraction) { res.status(404).json({ error: "Not found" }); return; }
  res.json(attraction);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await db.delete(attractionsTable).where(eq(attractionsTable.id, Number(req.params.id)));
  res.status(204).end();
});

export default router;
