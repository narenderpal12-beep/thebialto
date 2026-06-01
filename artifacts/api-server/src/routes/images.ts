import { Router } from "express";
import multer from "multer";
import { db } from "@workspace/db";
import { imagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// POST /api/images — upload a new image (admin only)
router.post("/", requireAdmin, upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  const { buffer, mimetype, originalname, size } = req.file;
  const [row] = await db
    .insert(imagesTable)
    .values({
      data: buffer,
      mimeType: mimetype,
      filename: originalname,
      size,
    })
    .returning({ id: imagesTable.id });

  res.status(201).json({ id: row.id, url: `/api/images/${row.id}` });
});

// GET /api/images/:id — serve an image (public)
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const rows = await db
    .select({
      data: imagesTable.data,
      mimeType: imagesTable.mimeType,
      filename: imagesTable.filename,
    })
    .from(imagesTable)
    .where(eq(imagesTable.id, id));

  if (!rows.length) { res.status(404).json({ error: "Image not found" }); return; }

  const { data, mimeType, filename } = rows[0];
  res.setHeader("Content-Type", mimeType);
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  if (filename) res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
  res.send(data);
});

// DELETE /api/images/:id (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(imagesTable).where(eq(imagesTable.id, id));
  res.status(204).end();
});

export default router;
