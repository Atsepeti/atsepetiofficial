import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { supportMessages } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { atBotReply } from "@/lib/chatbot";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const message = String(body.message ?? "").trim();
  const history = Array.isArray(body.history)
    ? body.history
        .slice(-8)
        .map((h: { role?: unknown; content?: unknown }) => ({
          role: String(h.role ?? "user"),
          content: String(h.content ?? ""),
        }))
    : [];

  if (!message) {
    return NextResponse.json(
      { error: "Boş mesaj gördük ama atlar bile boş mesaja cevap vermez." },
      { status: 400 }
    );
  }
  if (message.length > 500) {
    return NextResponse.json(
      { error: "Mesajın bir at boyunu geçti (500 karakter). Kısaltıp gel." },
      { status: 400 }
    );
  }

  const reply = atBotReply(message, history);

  // "Yazıyor..." hissi için küçük bekleme
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));

  const user = await getSessionUser();
  if (user) {
    await db.insert(supportMessages).values([
      { userId: user.id, role: "user", content: message },
      { userId: user.id, role: "bot", content: reply },
    ]);
  }

  return NextResponse.json({ ok: true, reply });
}
