// ── Admin session helpers — SERVER ONLY ──────────────────────────────────────
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

const SESSION_COOKIE = "ec_admin";
const SESSION_HOURS  = 4;

export function hashPassword(plain: string) {
  return crypto.createHash("sha256").update(plain).digest("hex");
}

export function checkPassword(plain: string): boolean {
  const expected = process.env.ADMIN_HASH ?? "";
  if (!expected) return false;
  return hashPassword(plain) === expected.toLowerCase();
}

export async function getSession(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value ?? null;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

export async function createSession() {
  const jar = await cookies();
  const token = crypto.randomBytes(24).toString("hex");
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   SESSION_HOURS * 3600,
    path:     "/",
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
