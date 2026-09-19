import { NextRequest, NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return NextResponse.json(
      { error: "Videoları sadece yönetim silebilir. Atların kararı." },
      { status: 403 }
    );
  }
  const body = await req.json();
  const id = Number(body.id);
  const row = (
    await db.select().from(videos).where(eq(videos.id, id)).limit(1)
  )[0];
  if (!row) return NextResponse.json({ error: "Video bulunamadı." }, { status: 404 });

  await db.delete(videos).where(eq(videos.id, id));
  if (row.url.startsWith("/uploads/")) {
    try {
      await unlink(path.join(process.cwd(), "public", row.url));
    } catch {
      // dosya yoksa dert etme
    }
  }
  return NextResponse.json({ ok: true, message: "Video arşive (ahırın derinliklerine) kaldırıldı." });
}
