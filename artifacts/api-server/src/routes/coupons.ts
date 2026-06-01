import { Router } from "express";
import { db, couponsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

// Validate a coupon (public)
router.get("/validate/:code", async (req, res) => {
  const code = req.params.code.toUpperCase().trim();
  const [coupon] = await db.select().from(couponsTable).where(eq(couponsTable.code, code));
  if (!coupon || !coupon.isActive) {
    res.status(404).json({ error: "Invalid or expired coupon code" });
    return;
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    res.status(400).json({ error: "This coupon has expired" });
    return;
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    res.status(400).json({ error: "This coupon has reached its usage limit" });
    return;
  }
  res.json({
    id: coupon.id,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    isActive: coupon.isActive,
    expiresAt: coupon.expiresAt,
    maxUses: coupon.maxUses,
    usedCount: coupon.usedCount,
  });
});

// List all coupons (admin)
router.get("/", requireAdmin, async (_req, res) => {
  const coupons = await db.select().from(couponsTable);
  res.json(coupons.map(c => ({ ...c, createdAt: c.createdAt.toISOString() })));
});

// Create coupon (admin)
router.post("/", requireAdmin, async (req, res) => {
  const { code, discountType, discountValue, isActive, maxUses, expiresAt } = req.body;
  const [coupon] = await db.insert(couponsTable).values({
    code: code.toUpperCase().trim(),
    discountType: discountType ?? "percentage",
    discountValue,
    isActive: isActive ?? true,
    maxUses: maxUses ?? null,
    expiresAt: expiresAt ?? null,
  }).returning();
  res.status(201).json({ ...coupon, createdAt: coupon.createdAt.toISOString() });
});

// Update coupon (admin)
router.patch("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const updates: any = {};
  const fields = ["code","discountType","discountValue","isActive","maxUses","expiresAt"];
  for (const f of fields) {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  }
  if (updates.code) updates.code = updates.code.toUpperCase().trim();
  const [coupon] = await db.update(couponsTable).set(updates).where(eq(couponsTable.id, id)).returning();
  if (!coupon) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...coupon, createdAt: coupon.createdAt.toISOString() });
});

// Delete coupon (admin)
router.delete("/:id", requireAdmin, async (req, res) => {
  await db.delete(couponsTable).where(eq(couponsTable.id, Number(req.params.id)));
  res.status(204).end();
});

export default router;
