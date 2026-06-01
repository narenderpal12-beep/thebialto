import { Router } from "express";
import { db, roomsTable, floorsTable } from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

async function getRoomWithFloorName(roomId: number) {
  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, roomId));
  if (!room) return null;
  const [floor] = await db.select().from(floorsTable).where(eq(floorsTable.id, room.floorId));
  return { ...room, floorName: floor?.name ?? null };
}

router.get("/featured", async (_req, res) => {
  const rooms = await db.select().from(roomsTable)
    .where(and(eq(roomsTable.isFeatured, true), eq(roomsTable.isPublished, true)))
    .orderBy(asc(roomsTable.id));
  const floors = await db.select().from(floorsTable);
  const floorMap = Object.fromEntries(floors.map(f => [f.id, f.name]));
  res.json(rooms.map(r => ({ ...r, floorName: floorMap[r.floorId] ?? null })));
});

router.get("/", async (req, res) => {
  const conditions: any[] = [];
  if (req.query.floorId) conditions.push(eq(roomsTable.floorId, Number(req.query.floorId)));
  if (req.query.available === "true") conditions.push(eq(roomsTable.isAvailable, true));
  if (req.query.available === "false") conditions.push(eq(roomsTable.isAvailable, false));
  if (req.query.published === "true") conditions.push(eq(roomsTable.isPublished, true));
  if (req.query.published === "false") conditions.push(eq(roomsTable.isPublished, false));

  const rooms = conditions.length > 0
    ? await db.select().from(roomsTable).where(and(...conditions)).orderBy(asc(roomsTable.id))
    : await db.select().from(roomsTable).orderBy(asc(roomsTable.id));

  const floors = await db.select().from(floorsTable);
  const floorMap = Object.fromEntries(floors.map(f => [f.id, f.name]));
  res.json(rooms.map(r => ({ ...r, floorName: floorMap[r.floorId] ?? null })));
});

router.post("/", requireAdmin, async (req, res) => {
  const { name, floorId, roomType, featureImageUrl, galleryImages, pricePerNight, adultCapacity, childCapacity, amenities, description, isAvailable, isPublished, isFeatured } = req.body;
  const [room] = await db.insert(roomsTable).values({
    name, floorId, roomType, featureImageUrl, galleryImages: galleryImages ?? [],
    pricePerNight,
    adultCapacity: adultCapacity ?? 2,
    childCapacity: childCapacity ?? 0,
    amenities: amenities ?? [], description,
    isAvailable: isAvailable ?? true, isPublished: isPublished ?? true, isFeatured: isFeatured ?? false,
  }).returning();
  const [floor] = await db.select().from(floorsTable).where(eq(floorsTable.id, room.floorId));
  res.status(201).json({ ...room, floorName: floor?.name ?? null });
});

router.get("/:id", async (req, res) => {
  const room = await getRoomWithFloorName(Number(req.params.id));
  if (!room) { res.status(404).json({ error: "Not found" }); return; }
  res.json(room);
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const updates: any = {};
  const fields = ["name","floorId","roomType","featureImageUrl","galleryImages","pricePerNight","adultCapacity","childCapacity","amenities","description","isAvailable","isPublished","isFeatured"];
  for (const f of fields) {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  }
  const [room] = await db.update(roomsTable).set(updates).where(eq(roomsTable.id, id)).returning();
  if (!room) { res.status(404).json({ error: "Not found" }); return; }
  const [floor] = await db.select().from(floorsTable).where(eq(floorsTable.id, room.floorId));
  res.json({ ...room, floorName: floor?.name ?? null });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await db.delete(roomsTable).where(eq(roomsTable.id, Number(req.params.id)));
  res.status(204).end();
});

export default router;
