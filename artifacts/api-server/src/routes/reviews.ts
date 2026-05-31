import { Router } from "express";
import { db, reviewsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", async (req, res) => {
  const approved = req.query.approved;
  let reviews;
  if (approved === "true") {
    reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.isApproved, true)).orderBy(desc(reviewsTable.createdAt));
  } else if (approved === "false") {
    reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.isApproved, false)).orderBy(desc(reviewsTable.createdAt));
  } else {
    reviews = await db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt));
  }
  res.json(reviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.post("/", async (req, res) => {
  const { guestName, guestLocation, guestPhoto, rating, reviewText } = req.body;
  const [review] = await db.insert(reviewsTable).values({
    guestName, guestLocation: guestLocation ?? null, guestPhoto: guestPhoto ?? null,
    rating, reviewText, isApproved: false,
  }).returning();
  res.status(201).json({ ...review, createdAt: review.createdAt.toISOString() });
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const updates: any = {};
  if (req.body.isApproved !== undefined) updates.isApproved = req.body.isApproved;
  const [review] = await db.update(reviewsTable).set(updates).where(eq(reviewsTable.id, id)).returning();
  if (!review) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...review, createdAt: review.createdAt.toISOString() });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await db.delete(reviewsTable).where(eq(reviewsTable.id, Number(req.params.id)));
  res.status(204).end();
});

export default router;
