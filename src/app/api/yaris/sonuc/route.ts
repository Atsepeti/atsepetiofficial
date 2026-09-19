import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { raceResults, users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "Bahis için giriş yapmalısın. Seyir serbest ama bahis üyelik ister." },
      { status: 401 }
    );
  }
  try {
    const body = await req.json();
    const horseName = String(body.horseName ?? "Bilinmeyen At").slice(0, 80);
    const bet = Math.floor(Number(body.bet));
    const position = Math.floor(Number(body.position));

    if (!Number.isFinite(bet) || bet < 10) {
      return NextResponse.json(
        { error: "Bahis en az 10 AtCoin olmalı. Saman kabul etmiyoruz." },
        { status: 400 }
      );
    }
    if (bet > user.balance) {
      return NextResponse.json(
        { error: "AtCoin'in yetmiyor. Yarışı izle, moral topla, biriktir gel." },
        { status: 400 }
      );
    }
    if (position < 1 || position > 6) {
      return NextResponse.json({ error: "Sıralama hatalı." }, { status: 400 });
    }

    const payout = position === 1 ? bet * 4 : 0;
    const newBalance = user.balance - bet + payout;

    await db.update(users).set({ balance: newBalance }).where(eq(users.id, user.id));
    await db.insert(raceResults).values({
      userId: user.id,
      horseName,
      bet,
      position,
      payout,
    });

    return NextResponse.json({ ok: true, newBalance, payout, position });
  } catch {
    return NextResponse.json(
      { error: "Hipodromda karışıklık çıktı. Tekrar dene." },
      { status: 500 }
    );
  }
}
