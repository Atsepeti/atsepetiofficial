import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { cartItems, horses, orderItems, orders } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Önce giriş yap." }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const address = String(body.address ?? "").trim();
    if (address.length < 5) {
      return NextResponse.json(
        {
          error:
            "Adres çok kısa. 'Eve bırak' sayılmaz; atın bulması için biraz ipucu ver.",
        },
        { status: 400 }
      );
    }

    const items = await db
      .select({
        cartId: cartItems.id,
        horseId: horses.id,
        name: horses.name,
        price: horses.price,
      })
      .from(cartItems)
      .innerJoin(horses, eq(horses.id, cartItems.horseId))
      .where(eq(cartItems.userId, user.id));

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Sepetin boş. Kapıya kutu gelmesini bekleme, önce bir at seç." },
        { status: 400 }
      );
    }

    const total = items.reduce((s, i) => s + i.price, 0);
    const [order] = await db
      .insert(orders)
      .values({ userId: user.id, total, address })
      .returning();
    await db.insert(orderItems).values(
      items.map((i) => ({
        orderId: order.id,
        horseId: i.horseId,
        name: i.name,
        price: i.price,
      }))
    );
    await db.delete(cartItems).where(eq(cartItems.userId, user.id));

    const eta = 22 + Math.floor(Math.random() * 8); // 22-29 dk
    return NextResponse.json({
      ok: true,
      orderId: order.id,
      total,
      eta,
      message: `Siparişin alındı! Atların atı yola çıktı. Tahmini varış: ${eta} dakika.`,
    });
  } catch {
    return NextResponse.json(
      { error: "Kasada teknik arıza: at kartı yuttu. Tekrar dene." },
      { status: 500 }
    );
  }
}
