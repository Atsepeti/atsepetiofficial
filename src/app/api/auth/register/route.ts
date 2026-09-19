import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, createSession, ADMIN_EMAIL } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Adın en az 2 harf olmalı; atlar kısa isimlere kuşkuyla bakar." },
        { status: 400 }
      );
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json(
        { error: "Bu e-posta pek inandırıcı değil; at postası değil, gerçek adres lazım." },
        { status: 400 }
      );
    }
    if (email === ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Bu adres yönetime ayrılmış. Giriş sayfasından yönetici şifrenle gir." },
        { status: 400 }
      );
    }
    if (password.length < 4) {
      return NextResponse.json(
        { error: "Şifre en az 4 karakter olmalı. 'at' sayılmaz, denedik." },
        { status: 400 }
      );
    }

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existing[0]) {
      return NextResponse.json(
        { error: "Bu e-postayla zaten bir ahır kurulmuş. Giriş yapmayı dene." },
        { status: 409 }
      );
    }

    const [user] = await db
      .insert(users)
      .values({ name, email, passwordHash: hashPassword(password) })
      .returning();
    await createSession(user.id);
    return NextResponse.json({ ok: true, name: user.name });
  } catch {
    return NextResponse.json(
      { error: "Ahırda bir şey devrildi. Birazdan tekrar dene." },
      { status: 500 }
    );
  }
}
