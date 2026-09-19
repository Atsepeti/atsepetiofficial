import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { supportMessages } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import SupportChat from "@/components/SupportChat";
import { Headset, Clock3, Smile } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Destek Hattı — At Sepeti",
  description: "AtBot 3000 hizmetinde: yaz, yapay zekâ cevaplasın. Gerçek at sevgisi.",
};

export default async function DestekPage() {
  const user = await getSessionUser();
  let initialMessages: { role: "user" | "bot"; content: string }[] = [];
  if (user) {
    try {
      const rows = await db
        .select()
        .from(supportMessages)
        .where(eq(supportMessages.userId, user.id))
        .orderBy(desc(supportMessages.id))
        .limit(30);
      initialMessages = rows
        .reverse()
        .map((r) => ({ role: r.role as "user" | "bot", content: r.content }));
    } catch {
      initialMessages = [];
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-grass px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-cream">
            <Headset className="h-4 w-4" />
            Destek Hattı
          </span>
          <h1 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">
            AtBot 3000
            <br />
            Hizmetinde
          </h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-coffee/85">
            Mesajını yaz, yapay zekâmız cevaplasın. Yapay zekâ, gerçek at
            sevgisi. Telefon yok, bekleme müziği yok, sadece kişneme var.
          </p>

          <div className="mt-6 space-y-3">
            <div className="sticker flex items-center gap-3 rounded-2xl bg-white/80 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-ink bg-hay">
                <Clock3 className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-lg">Cevap süresi: anında</p>
                <p className="text-xs font-bold text-mocha">
                  27 dakikalık teslimatımızdan bile hızlı
                </p>
              </div>
            </div>
            <div className="sticker flex items-center gap-3 rounded-2xl bg-white/80 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-ink bg-brick text-cream">
                <Smile className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-lg">Memnuniyet: yüksek</p>
                <p className="text-xs font-bold text-mocha">
                  Kullanıcıların %99,9&apos;u tekrar
                  yazdığı için memnun varsayıldı
                </p>
              </div>
            </div>
          </div>

          {!user && (
            <p className="mt-5 rounded-2xl border-2 border-dashed border-mocha/50 bg-parchment px-4 py-3 text-sm font-bold text-mocha">
              Giriş yaparsan sohbet geçmişin ahır günlüğüne kaydedilir.
              Misafirlerin sözü havada, mesajı sekmede kalır.
            </p>
          )}
        </div>

        <SupportChat initialMessages={initialMessages} />
      </div>
    </div>
  );
}
