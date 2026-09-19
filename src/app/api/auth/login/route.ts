import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  createSession,
  ensureAdminUser,
  verifyPassword,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-posta ve şifre gerekli; boş nal sesi duyuyoruz." },
        { status: 400 }
      );
    }

    // Yönetici girişi (özel hesap)
    if (email === ADMIN_EMAIL) {
      if (password !== ADMIN_PASSWORD) {
        return NextResponse.json(
          { error: "Yönetim şifresi yanlış. Atlar bile duydu, ayıp oldu." },
          { status: 401 }
        );
      }
      const admin = await ensureAdminUser();
      await createSession(admin.id);
      return NextResponse.json({ ok: true, isAdmin: true });
    }

    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const user = rows[0];
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "E-posta ya da şifre yanlış. At da hatırlamıyor, biz de." },
        { status: 401 }
      );
    }

    await createSession(user.id);
    return NextResponse.json({ ok: true, isAdmin: user.isAdmin });
  } catch {
    return NextResponse.json(
      { error: "Ahır kapısı takıldı. Birazdan tekrar dene." },
      { status: 500 }
    );
  }
}
