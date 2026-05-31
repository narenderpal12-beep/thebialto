import { Router } from "express";
import { db, roomsTable, bookingsTable, reviewsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/stats", requireAdmin, async (_req, res) => {
  const [totalRoomsResult] = await db.select({ count: sql<number>`count(*)` }).from(roomsTable);
  const [totalBookingsResult] = await db.select({ count: sql<number>`count(*)` }).from(bookingsTable);
  const [pendingBookingsResult] = await db.select({ count: sql<number>`count(*)` }).from(bookingsTable).where(eq(bookingsTable.status, "pending"));
  const [pendingReviewsResult] = await db.select({ count: sql<number>`count(*)` }).from(reviewsTable).where(eq(reviewsTable.isApproved, false));
  const [revenueResult] = await db.select({ total: sql<number>`coalesce(sum(total_amount), 0)` }).from(bookingsTable).where(eq(bookingsTable.status, "confirmed"));

  const today = new Date().toISOString().split("T")[0];
  const [todayCheckInsResult] = await db.select({ count: sql<number>`count(*)` }).from(bookingsTable).where(eq(bookingsTable.checkIn, today));

  const statusCounts = await db
    .select({ status: bookingsTable.status, count: sql<number>`count(*)` })
    .from(bookingsTable)
    .groupBy(bookingsTable.status);

  const recentBookings = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt)).limit(5);

  res.json({
    totalRooms: Number(totalRoomsResult.count),
    totalBookings: Number(totalBookingsResult.count),
    todayCheckIns: Number(todayCheckInsResult.count),
    pendingBookings: Number(pendingBookingsResult.count),
    pendingReviews: Number(pendingReviewsResult.count),
    totalRevenue: Number(revenueResult.total),
    bookingsByStatus: statusCounts.map(s => ({ status: s.status, count: Number(s.count) })),
    recentBookings: recentBookings.map(b => ({ ...b, createdAt: b.createdAt.toISOString() })),
  });
});

export default router;
