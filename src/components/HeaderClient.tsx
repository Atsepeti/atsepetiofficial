"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBasket,
  Menu,
  X,
  LogOut,
  Coins,
  ShieldCheck,
} from "lucide-react";
import { LogoMark, HorseshoeIcon } from "./Logo";

export type HeaderUser = {
  name: string;
  balance: number;
  isAdmin: boolean;
} | null;

const LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/atlar", label: "Atlar" },
  { href: "/yaris", label: "At Yarışı" },
  { href: "/videolar", label: "Videolarımız" },
  { href: "/sss", label: "SSS" },
  { href: "/destek", label: "Destek" },
];

const TICKER = [
  "30 DK'DA KAPINDA",
  "KARGO ÜCRETSİZ — AT KENDİ YÜRÜYOR",
  "14 GÜN KOŞULSUZ İADE",
  "ŞIMARIK AT SATILMAZ",
  "ATCOIN İLE BAHİS HEYECANI",
  "M. HOCAM SAĞOLSUN",
  "KAPINIZI ARALIK BIRAKIN",
];

export default function HeaderClient({
  user,
  cartCount,
}: {
  user: HeaderUser;
  cartCount: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      {/* Komik ticker */}
      <div className="overflow-hidden border-b-2 border-ink bg-ink py-1.5 text-cream">
        <div className="flex w-max animate-marquee items-center gap-6 whitespace-nowrap">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span
              key={i}
              className="flex items-center gap-6 text-[11px] font-extrabold tracking-[0.2em]"
            >
              {t}
              <HorseshoeIcon className="h-3.5 w-3.5 text-hay" />
            </span>
          ))}
        </div>
      </div>

      <nav className="border-b-2 border-ink bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="group" onClick={() => setOpen(false)}>
            <LogoMark />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3.5 py-2 text-sm font-bold transition-colors ${
                  isActive(l.href)
                    ? "bg-ink text-cream"
                    : "text-coffee hover:bg-parchment"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <>
                <span className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-hay px-3 py-1.5 text-xs font-extrabold">
                  <Coins className="h-3.5 w-3.5" />
                  {user.balance.toLocaleString("tr-TR")} AC
                </span>
                <span className="max-w-32 truncate rounded-full bg-parchment px-3 py-1.5 text-xs font-bold text-coffee">
                  {user.name}
                </span>
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 rounded-full border-2 border-ink bg-brick px-3 py-1.5 text-xs font-extrabold text-cream"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Yönetim
                  </Link>
                )}
                <Link
                  href="/sepetim"
                  className={`relative grid h-10 w-10 place-items-center rounded-full border-2 border-ink transition-colors ${
                    isActive("/sepetim")
                      ? "bg-ink text-cream"
                      : "bg-cream hover:bg-parchment"
                  }`}
                  aria-label="Sepetim"
                >
                  <ShoppingBasket className="h-4.5 w-4.5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-ink bg-brick px-1 text-[10px] font-extrabold text-cream">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button
                    type="submit"
                    className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-cream transition-colors hover:bg-parchment"
                    aria-label="Çıkış yap"
                    title="Çıkış yap"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="rounded-full px-4 py-2 text-sm font-bold text-coffee transition-colors hover:bg-parchment"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="sticker rounded-full bg-brick px-4 py-2 text-sm font-extrabold text-cream transition-transform hover:-translate-y-0.5"
                >
                  Kayıt Ol
                </Link>
                <Link
                  href="/sepetim"
                  className="relative grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-cream transition-colors hover:bg-parchment"
                  aria-label="Sepetim"
                >
                  <ShoppingBasket className="h-4.5 w-4.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobil */}
          <div className="flex items-center gap-2 lg:hidden">
            {user && (
              <span className="flex items-center gap-1 rounded-full border-2 border-ink bg-hay px-2.5 py-1 text-[11px] font-extrabold">
                <Coins className="h-3 w-3" />
                {user.balance.toLocaleString("tr-TR")}
              </span>
            )}
            <Link
              href="/sepetim"
              className="relative grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-cream"
              aria-label="Sepetim"
            >
              <ShoppingBasket className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-ink bg-brick px-1 text-[10px] font-extrabold text-cream">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-cream"
              aria-label="Menü"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="animate-pop border-t-2 border-ink bg-cream px-4 pb-5 pt-2 lg:hidden">
            <div className="grid gap-1">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-base font-bold ${
                    isActive(l.href) ? "bg-ink text-cream" : "hover:bg-parchment"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              {user ? (
                <>
                  {user.isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="rounded-xl bg-brick px-4 py-3 text-base font-extrabold text-cream"
                    >
                      Yönetim Paneli
                    </Link>
                  )}
                  <form action="/api/auth/logout" method="post">
                    <button
                      type="submit"
                      className="w-full rounded-xl border-2 border-ink bg-parchment px-4 py-3 text-left text-base font-bold"
                    >
                      Çıkış Yap ({user.name})
                    </button>
                  </form>
                </>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link
                    href="/giris"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border-2 border-ink bg-cream px-4 py-3 text-center font-bold"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/kayit"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-brick px-4 py-3 text-center font-extrabold text-cream"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
