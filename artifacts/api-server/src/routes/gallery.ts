import { Router } from "express";
import { db, galleryTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", async (req, res) => {
  const category = req.query.category as string | undefined;
  const images = category
    ? await db.select().from(galleryTable).where(eq(galleryTable.category, category)).orderBy(asc(galleryTable.sortOrder))
    : await db.select().from(galleryTable).orderBy(asc(galleryTable.sortOrder));
  res.json(images);
});

router.post("/", requireAdmin, async (req, res) => {
  const { imageUrl, category, title, sortOrder } = req.body;
  const [image] = await db.insert(galleryTable).values({ imageUrl, category, title, sortOrder: sortOrder ?? 0 }).returning();
  res.status(201).json(image);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await db.delete(galleryTable).where(eq(galleryTable.id, Number(req.params.id)));
  res.status(204).end();
});

export default router;
