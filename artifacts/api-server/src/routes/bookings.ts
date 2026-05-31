import { Router } from "express";
import { db, bookingsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", requireAdmin, async (req, res) => {
  const status = req.query.status as string | undefined;
  const bookings = status
    ? await db.select().from(bookingsTable).where(eq(bookingsTable.status, status)).orderBy(desc(bookingsTable.createdAt))
    : await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt));
  res.json(bookings.map(b => ({ ...b, createdAt: b.createdAt.toISOString() })));
});

router.post("/", async (req, res) => {
  const { guestName, guestEmail, guestPhone, checkIn, checkOut, guests, roomId, roomType, specialRequests } = req.body;
  const [booking] = await db.insert(bookingsTable).values({
    guestName, guestEmail, guestPhone, checkIn, checkOut,
    guests, roomId: roomId ?? null, roomType, specialRequests: specialRequests ?? null,
    status: "pending", totalAmount: 0,
  }).returning();
  res.status(201).json({ ...booking, createdAt: booking.createdAt.toISOString() });
});

router.get("/:id", requireAdmin, async (req, res) => {
  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, Number(req.params.id)));
  if (!booking) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...booking, createdAt: booking.createdAt.toISOString() });
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const updates: any = {};
  if (req.body.status !== undefined) updates.status = req.body.status;
  if (req.body.roomId !== undefined) updates.roomId = req.body.roomId;
  const [booking] = await db.update(bookingsTable).set(updates).where(eq(bookingsTable.id, id)).returning();
  if (!booking) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...booking, createdAt: booking.createdAt.toISOString() });
});

export default router;
