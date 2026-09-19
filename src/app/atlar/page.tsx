import { asc } from "drizzle-orm";
import { db } from "@/db";
import { horses } from "@/db/schema";
import { ensureHorsesSeeded } from "@/lib/horses";
import HorseCard from "@/components/HorseCard";
import { Warehouse } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Atlar — At Sepeti",
  description: "Ahır kataloğu: hepsi birbirinden at. Fiyatlara kişneme dahildir.",
};

export default async function AtlarPage() {
  await ensureHorsesSeeded();
  let list: (typeof horses.$inferSelect)[] = [];
  try {
    list = await db.select().from(horses).orderBy(asc(horses.id));
  } catch {
    list = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <span className="flex w-fit items-center gap-2 rounded-full border-2 border-ink bg-hay px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em]">
          <Warehouse className="h-4 w-4" />
          Ahır Kataloğu
        </span>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">
          Hepsi Birbirinden At
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-coffee/85">
          Şu anda ahırda <span className="font-extrabold">{list.length} asil</span>{" "}
          bekliyor. Fiyatlara kişneme dahildir; saman aboneliği ve komşuların
          sabrı ayrı satılır.
        </p>
      </div>

      <div className="mt-4 -rotate-1">
        <p className="inline-block rounded-lg border-2 border-dashed border-mocha/50 bg-parchment px-4 py-2 text-xs font-bold text-mocha">
          Not: Atların hiçbiri uçmuyor. Uçan model 2027&apos;de. Söz veremeyiz.
        </p>
      </div>

      {list.length > 0 ? (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((h) => (
            <HorseCard key={h.id} horse={h} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-2xl border-2 border-dashed border-mocha/40 p-10 text-center text-mocha">
          Ahır şu an boş görünüyor. Sayfayı yenile, atlar utangaçtır.
        </p>
      )}
    </div>
  );
}
