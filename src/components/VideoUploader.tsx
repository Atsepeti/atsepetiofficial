"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2, CheckCircle2, AlertTriangle, Film } from "lucide-react";

export default function VideoUploader() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !title.trim() || state === "loading") return;
    setState("loading");
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("file", file);
      const res = await fetch("/api/videos/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setState("err");
        setMsg(data.error ?? "Yükleme başarısız.");
        return;
      }
      setState("ok");
      setMsg(data.message);
      setTitle("");
      setFileName("");
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } catch {
      setState("err");
      setMsg("Bağlantı koptu; atlar arası hat değil, bizim hat.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="sticker rounded-3xl bg-white/85 p-6">
      <h3 className="flex items-center gap-2 font-display text-2xl">
        <Film className="h-6 w-6 text-brick" />
        Videonu Yükle
      </h3>
      <p className="mt-1 text-xs font-bold text-mocha">
        MP4/WebM, en fazla 60 MB. Atın artık meşhur olacak.
      </p>

      <label className="mt-4 block text-xs font-extrabold uppercase tracking-wider text-mocha">
        Video başlığı
      </label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={120}
        placeholder='örn: "Boncuğun ilk maratonu"'
        className="mt-1.5 w-full rounded-xl border-2 border-ink bg-cream px-4 py-3 text-sm font-semibold outline-none placeholder:text-mocha/50 focus:ring-4 focus:ring-hay/40"
      />

      <label className="mt-4 block text-xs font-extrabold uppercase tracking-wider text-mocha">
        Dosya
      </label>
      <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-mocha/50 bg-parchment/60 px-4 py-6 text-sm font-bold text-mocha transition-colors hover:bg-parchment">
        <UploadCloud className="h-5 w-5" />
        {fileName || "Video dosyası seç"}
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
        />
      </label>

      {state !== "idle" && msg && (
        <p
          className={`mt-3 flex items-start gap-2 rounded-xl border-2 border-ink p-3 text-xs font-bold ${
            state === "ok" ? "bg-[#dff3e0] text-grassdark" : "bg-[#ffe3df] text-brick"
          }`}
        >
          {state === "ok" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          )}
          {msg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading" || !title.trim() || !fileName}
        className="sticker mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-brick px-4 py-3.5 font-display text-lg text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        {state === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <UploadCloud className="h-5 w-5" />
        )}
        {state === "loading" ? "Yükleniyor..." : "Yayınla"}
      </button>
    </form>
  );
}
