import type { Horse } from "@/db/schema";
import { formatPrice } from "@/lib/horses";
import AddToCartButton from "./AddToCartButton";
import { Gauge, Heart, Wheat } from "lucide-react";

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-mocha">
        <span className="flex items-center gap-1">
          {icon}
          {label}
        </span>
        <span>{value}/10</span>
      </div>
      <div className="mt-1 h-2.5 overflow-hidden rounded-full border border-ink bg-sand">
        <div
          className="h-full rounded-full bg-haydark"
          style={{ width: `${Math.min(10, Math.max(1, value)) * 10}%` }}
        />
      </div>
    </div>
  );
}

export default function HorseCard({ horse }: { horse: Horse }) {
  return (
    <article className="sticker group flex flex-col overflow-hidden rounded-3xl bg-white/80 transition-transform duration-300 hover:-translate-y-1.5 hover:rotate-[0.5deg]">
      <div className="relative overflow-hidden border-b-2 border-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={horse.image}
          alt={horse.name}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {horse.badge && (
          <span className="absolute left-3 top-3 -rotate-6 rounded-full border-2 border-ink bg-hay px-3 py-1 text-xs font-extrabold shadow-[2px_2px_0_#241708]">
            {horse.badge}
          </span>
        )}
        <span className="absolute bottom-3 right-3 rounded-full border-2 border-cream bg-ink/90 px-3 py-1 font-display text-sm tracking-wide text-hay">
          {formatPrice(horse.price)}
        </span>
      </div>

      <div className="flex grow flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-2xl leading-tight">{horse.name}</h3>
          <p className="text-sm font-semibold italic text-mocha">
            “{horse.tagline}”
          </p>
        </div>
        <span className="inline-block w-fit rounded-full bg-parchment px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-coffee">
          {horse.breed}
        </span>
        <p className="text-sm leading-relaxed text-coffee/90">
          {horse.description}
        </p>

        <div className="mt-auto space-y-2 border-t-2 border-dashed border-sand pt-4">
          <Stat
            icon={<Gauge className="h-3.5 w-3.5" />}
            label="Dıgıdık Hızı"
            value={horse.speed}
          />
          <Stat
            icon={<Heart className="h-3.5 w-3.5" />}
            label="Sevimlilik"
            value={horse.charm}
          />
          <Stat
            icon={<Wheat className="h-3.5 w-3.5" />}
            label="Saman Tüketimi"
            value={horse.appetite}
          />
        </div>

        <AddToCartButton horseId={horse.id} />
      </div>
    </article>
  );
}
