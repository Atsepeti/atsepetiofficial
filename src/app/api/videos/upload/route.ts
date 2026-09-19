import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

const MAX_MB = 60;

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "Video yüklemek girişe özel bir ayrıcalıktır. Önce giriş yap." },
      { status: 401 }
    );
  }
  try {
    const form = await req.formData();
    const file = form.get("file");
    const title = String(form.get("title") ?? "").trim().slice(0, 120);

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Dosya yok. Atı görüntülü arayıp mı çektin? Dosya seç." },
        { status: 400 }
      );
    }
    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "Bu bir video değil. Atımız sadece video sever." },
        { status: 400 }
      );
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Video ${MAX_MB} MB'ı geçti. At bile bu kadar yer kaplamıyor.` },
        { status: 400 }
      );
    }
    if (!title) {
      return NextResponse.json(
        { error: "Videoya bir başlık ver; 'video.mp4' sayılmaz." },
        { status: 400 }
      );
    }

    const ext = (file.name.split(".").pop() || "mp4").replace(/[^a-z0-9]/gi, "").toLowerCase();
    const fileName = `${crypto.randomBytes(10).toString("hex")}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, fileName), buffer);

    await db.insert(videos).values({
      userId: user.id,
      uploaderName: user.name,
      title,
      url: `/uploads/${fileName}`,
      source: "upload",
    });

    return NextResponse.json({
      ok: true,
      message: "Videon yayında! Atın artık meşhur.",
    });
  } catch {
    return NextResponse.json(
      { error: "Yükleme sırasında at kaçtı. Tekrar dene." },
      { status: 500 }
    );
  }
}
