"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBasket, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function AddToCartButton({
  horseId,
  label = "Sepete Ekle",
}: {
  horseId: number;
  label?: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");
  const [needAuth, setNeedAuth] = useState(false);

  async function onAdd() {
    if (state === "loading") return;
    setState("loading");
    setNeedAuth(false);
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ horseId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error ?? "Bir şey ters gitti; at huysuzlandı.");
        setState("err");
        if (data.needAuth) setNeedAuth(true);
      } else {
        setMsg(data.message);
        setState("ok");
        router.refresh();
      }
    } catch {
      setMsg("Bağlantı koptu. At ara bağlantıda değildir, hat bizdedir.");
      setState("err");
    }
    window.setTimeout(() => setState((s) => (s === "loading" ? "loading" : "idle")), 3600);
  }

  return (
    <div className="relative">
      {(state === "ok" || state === "err") && (
        <div
          className={`absolute -top-3 left-0 z-10 w-full -translate-y-full animate-pop rounded-2xl border-2 border-ink p-3 text-xs font-bold shadow-[3px_4px_0_#241708] ${
            state === "ok" ? "bg-[#dff3e0] text-grassdark" : "bg-[#ffe3df] text-brick"
          }`}
        >
          <span className="flex items-start gap-1.5">
            {state === "ok" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>
              {msg}
              {needAuth && (
                <>
                  {" "}
                  <Link href="/giris" className="underline underline-offset-2">
                    Giriş yap
                  </Link>{" "}
                  — 8 saniye sürer.
                </>
              )}
            </span>
          </span>
        </div>
      )}
      <button
        onClick={onAdd}
        disabled={state === "loading"}
        className="sticker flex w-full items-center justify-center gap-2 rounded-2xl bg-brick px-4 py-3 font-display text-lg tracking-wide text-cream transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
      >
        {state === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ShoppingBasket className="h-5 w-5" />
        )}
        {state === "loading" ? "At ikna ediliyor..." : label}
      </button>
    </div>
  );
}
