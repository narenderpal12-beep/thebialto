import { Router } from "express";
import { db, bookingsTable, couponsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { sendBookingNotification } from "../email";

const router = Router();

router.get("/", requireAdmin, async (req, res) => {
  const status = req.query.status as string | undefined;
  const bookings = status
    ? await db.select().from(bookingsTable).where(eq(bookingsTable.status, status)).orderBy(desc(bookingsTable.createdAt))
    : await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt));
  res.json(bookings.map(b => ({ ...b, createdAt: b.createdAt.toISOString() })));
});

router.post("/", async (req, res) => {
  const {
    guestName, guestEmail, guestPhone,
    checkIn, checkOut,
    adults, children, guests,
    roomId, roomType, specialRequests,
    couponCode, discountAmount, totalAmount,
  } = req.body;

  let finalCouponCode: string | null = null;
  let finalDiscount = 0;

  // Validate and apply coupon if provided
  if (couponCode) {
    const code = String(couponCode).toUpperCase().trim();
    const [coupon] = await db.select().from(couponsTable).where(eq(couponsTable.code, code));
    if (coupon && coupon.isActive && !(coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
        && !(coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses)) {
      finalCouponCode = code;
      finalDiscount = discountAmount ?? 0;
      // Increment usage count
      await db.update(couponsTable).set({ usedCount: coupon.usedCount + 1 }).where(eq(couponsTable.id, coupon.id));
    }
  }

  const totalAdults = adults ?? 1;
  const totalChildren = children ?? 0;
  const totalGuests = guests ?? (totalAdults + totalChildren);

  const [booking] = await db.insert(bookingsTable).values({
    guestName, guestEmail, guestPhone,
    checkIn, checkOut,
    adults: totalAdults,
    children: totalChildren,
    guests: totalGuests,
    roomId: roomId ?? null,
    roomType,
    specialRequests: specialRequests ?? null,
    couponCode: finalCouponCode,
    discountAmount: finalDiscount,
    status: "pending",
    totalAmount: totalAmount ?? 0,
  }).returning();

  // Calculate nights for email
  const nights = Math.max(0, Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
  ));

  // Fire-and-forget email notification
  sendBookingNotification({
    guestName,
    guestEmail,
    guestPhone,
    roomType,
    checkIn,
    checkOut,
    adults: totalAdults,
    children: totalChildren,
    nights,
    totalAmount: totalAmount ?? 0,
    discountAmount: finalDiscount,
    couponCode: finalCouponCode,
    specialRequests: specialRequests ?? null,
  }).catch(() => {});

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
