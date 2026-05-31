import { Router } from "express";
import { db, adminsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signAdminToken, requireAdmin } from "../middlewares/auth";
import { createHash } from "crypto";

const router = Router();

function hashPassword(password: string): string {
  return createHash("sha256").update(password + "bialto_salt").digest("hex");
}

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.email, email));
  if (!admin || admin.passwordHash !== hashPassword(password)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = signAdminToken(admin.id, admin.email);
  res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
});

router.post("/logout", (_req, res) => {
  res.json({ success: true });
});

router.get("/me", requireAdmin, async (req: any, res) => {
  const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.id, req.adminId));
  if (!admin) {
    res.status(401).json({ error: "Not found" });
    return;
  }
  res.json({ id: admin.id, email: admin.email, name: admin.name });
});

export default router;
