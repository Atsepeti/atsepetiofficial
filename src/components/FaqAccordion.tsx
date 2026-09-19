"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export type FaqItem = { q: string; a: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`sticker overflow-hidden rounded-2xl transition-colors ${
              isOpen ? "bg-white" : "bg-white/70 hover:bg-white"
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-ink transition-colors ${
                  isOpen ? "bg-brick text-cream" : "bg-hay"
                }`}
              >
                <HelpCircle className="h-5 w-5" />
              </span>
              <span className="grow font-display text-lg leading-snug">
                {item.q}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="border-t-2 border-dashed border-sand px-5 pb-5 pt-4 pl-[4.25rem] text-sm leading-relaxed text-coffee/90">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
