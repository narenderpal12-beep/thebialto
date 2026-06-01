import { Router } from "express";
import { db, floorsTable, roomsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", async (_req, res) => {
  const floors = await db.select().from(floorsTable).orderBy(asc(floorsTable.floorNumber));
  const rooms = await db.select().from(roomsTable);
  const result = floors.map(f => ({
    ...f,
    rooms: rooms.filter(r => r.floorId === f.id),
  }));
  res.json(result);
});

router.post("/", requireAdmin, async (req, res) => {
  const { name, floorNumber, description, imageUrl, galleryImages, isAvailable, hasKitchen } = req.body;
  const [floor] = await db.insert(floorsTable).values({
    name, floorNumber, description, imageUrl,
    galleryImages: galleryImages ?? [],
    isAvailable: isAvailable ?? true,
    hasKitchen: hasKitchen ?? true,
  }).returning();
  res.status(201).json({ ...floor, rooms: [] });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [floor] = await db.select().from(floorsTable).where(eq(floorsTable.id, id));
  if (!floor) { res.status(404).json({ error: "Not found" }); return; }
  const rooms = await db.select().from(roomsTable).where(eq(roomsTable.floorId, id));
  res.json({ ...floor, rooms });
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { name, floorNumber, description, imageUrl, galleryImages, isAvailable, hasKitchen } = req.body;
  const updates: any = {};
  if (name !== undefined) updates.name = name;
  if (floorNumber !== undefined) updates.floorNumber = floorNumber;
  if (description !== undefined) updates.description = description;
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  if (galleryImages !== undefined) updates.galleryImages = galleryImages;
  if (isAvailable !== undefined) updates.isAvailable = isAvailable;
  if (hasKitchen !== undefined) updates.hasKitchen = hasKitchen;
  const [floor] = await db.update(floorsTable).set(updates).where(eq(floorsTable.id, id)).returning();
  if (!floor) { res.status(404).json({ error: "Not found" }); return; }
  const rooms = await db.select().from(roomsTable).where(eq(roomsTable.floorId, id));
  res.json({ ...floor, rooms });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(floorsTable).where(eq(floorsTable.id, id));
  res.status(204).end();
});

export default router;
