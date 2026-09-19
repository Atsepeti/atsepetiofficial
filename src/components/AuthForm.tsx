"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus, Loader2, AlertTriangle, Coins } from "lucide-react";
import { HorseshoeIcon } from "./Logo";

export default function AuthForm({
  mode,
  next,
}: {
  mode: "login" | "register";
  next?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string> = {
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
    };
    if (!isLogin) payload.name = String(fd.get("name") ?? "");

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Bir şey ters gitti.");
        setLoading(false);
        return;
      }
      const target =
        next && next.startsWith("/") ? next : data.isAdmin ? "/admin" : "/";
      router.push(target);
      router.refresh();
    } catch {
      setError("Bağlantı koptu. Atla ilgisi yok, bakma öyle.");
      setLoading(false);
    }
  }

  return (
    <div className="sticker mx-auto w-full max-w-md rounded-3xl bg-white/85 p-8">
      <div className="text-center">
        <span className="mx-auto inline-grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink bg-hay">
          <HorseshoeIcon className="h-8 w-8" />
        </span>
        <h1 className="mt-4 font-display text-3xl">
          {isLogin ? "Tekrar Hoş Geldin" : "Ahıra Katıl"}
        </h1>
        <p className="mt-1 text-sm text-mocha">
          {isLogin
            ? "Atlar seni özledi. Bir tanesi ağlıyor olabilir."
            : "8 saniyede üye ol, at hayallerine 1.000 AtCoin ile başla."}
        </p>
      </div>

      {!isLogin && (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-haydark/60 bg-hay/15 px-3 py-2 text-xs font-extrabold text-coffee">
          <Coins className="h-4 w-4 text-haydark" />
          Hoş geldin bonusu: 1.000 AtCoin
        </div>
      )}

      {error && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border-2 border-ink bg-[#ffe3df] p-3 text-sm font-bold text-brick">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="name" className="text-xs font-extrabold uppercase tracking-wider text-mocha">
              Ad Soyad
            </label>
            <input
              id="name"
              name="name"
              required
              minLength={2}
              placeholder="At sever biri"
              className="mt-1.5 w-full rounded-xl border-2 border-ink bg-cream px-4 py-3 font-semibold outline-none placeholder:text-mocha/50 focus:bg-white focus:ring-4 focus:ring-hay/40"
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="text-xs font-extrabold uppercase tracking-wider text-mocha">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="sen@ornek.com"
            className="mt-1.5 w-full rounded-xl border-2 border-ink bg-cream px-4 py-3 font-semibold outline-none placeholder:text-mocha/50 focus:bg-white focus:ring-4 focus:ring-hay/40"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-xs font-extrabold uppercase tracking-wider text-mocha">
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={4}
            placeholder="En az 4 karakter ('at' sayılmaz)"
            className="mt-1.5 w-full rounded-xl border-2 border-ink bg-cream px-4 py-3 font-semibold outline-none placeholder:text-mocha/50 focus:bg-white focus:ring-4 focus:ring-hay/40"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="sticker flex w-full items-center justify-center gap-2 rounded-2xl bg-brick px-4 py-3.5 font-display text-xl tracking-wide text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isLogin ? (
            <LogIn className="h-5 w-5" />
          ) : (
            <UserPlus className="h-5 w-5" />
          )}
          {loading
            ? "Nallar bağlanıyor..."
            : isLogin
              ? "Giriş Yap"
              : "Kayıt Ol"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm font-semibold text-mocha">
        {isLogin ? (
          <>
            Hesabın yok mu?{" "}
            <Link href="/kayit" className="font-extrabold text-brick underline underline-offset-2">
              Kayıt ol
            </Link>{" "}
            — at bekletmez.
          </>
        ) : (
          <>
            Zaten ahırda yerin var mı?{" "}
            <Link href="/giris" className="font-extrabold text-brick underline underline-offset-2">
              Giriş yap
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
