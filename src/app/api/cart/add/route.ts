import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { cartItems, horses } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      {
        error:
          "Sepete at eklemek için önce giriş yapmalısın. Atlar kiminle eve gideceğini bilmek ister.",
        needAuth: true,
      },
      { status: 401 }
    );
  }
  try {
    const body = await req.json();
    const horseId = Number(body.horseId);
    const horse = (
      await db.select().from(horses).where(eq(horses.id, horseId)).limit(1)
    )[0];
    if (!horse) {
      return NextResponse.json(
        { error: "Böyle bir at yok. Rüyanda görmüş olabilirsin." },
        { status: 404 }
      );
    }
    const inserted = await db
      .insert(cartItems)
      .values({ userId: user.id, horseId })
      .onConflictDoNothing()
      .returning();
    if (inserted.length === 0) {
      return NextResponse.json(
        { error: `${horse.name} zaten sepetinde bekliyor. İkincisini alırsa kıskanır.` },
        { status: 409 }
      );
    }
    return NextResponse.json({
      ok: true,
      message: `${horse.name} sepete eklendi! Kapını aralık bırakmaya başla.`,
    });
  } catch {
    return NextResponse.json(
      { error: "At sepete sığmadı, bir şey ters gitti." },
      { status: 500 }
    );
  }
}
