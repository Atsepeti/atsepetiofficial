import { asc } from "drizzle-orm";
import { db } from "@/db";
import { horses } from "@/db/schema";
import { ensureHorsesSeeded } from "@/lib/horses";
import { getSessionUser } from "@/lib/auth";
import RaceGame from "@/components/race/RaceGame";
import { Flag } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "At Yarışı Arenası — At Sepeti",
  description: "3D hipodrom: atını seç, AtCoin'ini konuştur. Birinciye 4 kat ödeme.",
};

export default async function YarisPage() {
  await ensureHorsesSeeded();
  const user = await getSessionUser();

  let racers: { id: number; name: string; colorHex: string; speed: number }[] = [];
  try {
    const rows = await db
      .select()
      .from(horses)
      .orderBy(asc(horses.id))
      .limit(6);
    racers = rows.map((r) => ({
      id: r.id,
      name: r.name,
      colorHex: r.colorHex,
      speed: r.speed,
    }));
  } catch {
    racers = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-grass px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-cream">
            <Flag className="h-4 w-4" />
            3D Hipodrom
          </span>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl">
            At Yarışı Arenası
          </h1>
          <p className="mt-2 max-w-xl text-coffee/85">
            Atını seç, AtCoin&apos;ini konuştur, 3D hipodromda kaderini izle.
            Birincilik 4 kat öder. Sonunculuk da karakter geliştirir.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <RaceGame
          racers={racers}
          balance={user ? user.balance : null}
        />
      </div>
    </div>
  );
}
