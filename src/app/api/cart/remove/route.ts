import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { cartItems } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Önce giriş yap." }, { status: 401 });
  }
  const body = await req.json();
  const id = Number(body.id);
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.id, id), eq(cartItems.userId, user.id)));
  return NextResponse.json({ ok: true, message: "At sepetten çıkarıldı. Biraz kırıldı ama geçer." });
}
