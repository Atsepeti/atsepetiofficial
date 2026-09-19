import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { cartItems } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { ensureHorsesSeeded } from "@/lib/horses";
import HeaderClient from "./HeaderClient";

export default async function SiteHeader() {
  await ensureHorsesSeeded();
  const user = await getSessionUser();
  let cartCount = 0;
  if (user) {
    const r = await db
      .select({ v: count() })
      .from(cartItems)
      .where(eq(cartItems.userId, user.id));
    cartCount = r[0]?.v ?? 0;
  }
  return (
    <HeaderClient
      user={
        user
          ? { name: user.name, balance: user.balance, isAdmin: user.isAdmin }
          : null
      }
      cartCount={cartCount}
    />
  );
}
