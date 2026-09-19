"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Clapperboard } from "lucide-react";

export type AdminVideo = {
  id: number;
  title: string;
  uploaderName: string;
  source: string;
  createdAt: string;
};

export default function AdminVideoList({ videos }: { videos: AdminVideo[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<number | null>(null);

  async function remove(id: number) {
    if (busyId) return;
    setBusyId(id);
    const res = await fetch("/api/videos/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBusyId(null);
    if (res.ok) router.refresh();
  }

  if (videos.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-dashed border-mocha/40 p-6 text-center text-sm text-mocha">
        Henüz video yok. Atlar kamera karşısına geçmedi.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {videos.map((v) => (
        <div
          key={v.id}
          className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-cream px-4 py-3"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-ink bg-brick text-cream">
            <Clapperboard className="h-4 w-4" />
          </span>
          <div className="grow">
            <p className="font-display text-base leading-tight">{v.title}</p>
            <p className="text-xs font-bold text-mocha">
              {v.uploaderName} —{" "}
              {v.source === "web" ? "arşiv" : "yükleme"} —{" "}
              {new Date(v.createdAt).toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={() => remove(v.id)}
            disabled={busyId === v.id}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-ink bg-white transition-colors hover:bg-[#ffe3df] hover:text-brick disabled:opacity-50"
            title="Videoyu sil"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
