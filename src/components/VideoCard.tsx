"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function VideoCard({
  id,
  title,
  url,
  poster,
  uploaderName,
  createdAt,
  isAdmin,
}: {
  id: number;
  title: string;
  url: string;
  poster: string | null;
  uploaderName: string;
  createdAt: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);
  const [gone, setGone] = useState(false);

  async function remove() {
    if (removing) return;
    setRemoving(true);
    const res = await fetch("/api/videos/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setGone(true);
      router.refresh();
    } else {
      setRemoving(false);
    }
  }

  if (gone) return null;

  return (
    <figure className="sticker overflow-hidden rounded-3xl bg-white/85">
      <div className="border-b-2 border-ink">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          controls
          preload="none"
          poster={poster ?? undefined}
          className="aspect-video w-full bg-ink object-cover"
          src={url}
        />
      </div>
      <figcaption className="flex items-start justify-between gap-3 p-4">
        <div>
          <h3 className="font-display text-lg leading-tight">{title}</h3>
          <p className="mt-1 text-xs font-bold text-mocha">
            {uploaderName} —{" "}
            {new Date(createdAt).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={remove}
            disabled={removing}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-ink bg-cream transition-colors hover:bg-[#ffe3df] hover:text-brick disabled:opacity-50"
            title="Videoyu sil (yönetici yetkisi)"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </figcaption>
    </figure>
  );
}
