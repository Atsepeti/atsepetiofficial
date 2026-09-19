"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ShoppingBasket,
  Loader2,
  MapPin,
  PartyPopper,
  PackageCheck,
} from "lucide-react";
import { HorseshoeIcon } from "./Logo";

export type CartItem = {
  cartId: number;
  name: string;
  price: number;
  image: string;
  tagline: string;
};

export type PastOrder = {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items: string[];
};

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(n) + " ₺";
}

export default function CartView({
  items,
  pastOrders,
}: {
  items: CartItem[];
  pastOrders: PastOrder[];
}) {
  const router = useRouter();
  const [list, setList] = useState(items);
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ orderId: number; eta: number } | null>(null);

  const total = list.reduce((s, i) => s + i.price, 0);

  async function remove(cartId: number) {
    setList((l) => l.filter((i) => i.cartId !== cartId));
    await fetch("/api/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cartId }),
    });
    router.refresh();
  }

  async function checkout() {
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Bir şey ters gitti.");
        setBusy(false);
        return;
      }
      setSuccess({ orderId: data.orderId, eta: data.eta });
      setList([]);
      router.refresh();
    } catch {
      setError("Bağlantı koptu; at ödeme noktasında değildir.");
    }
    setBusy(false);
  }

  if (success) {
    return (
      <div className="sticker mx-auto max-w-xl animate-pop rounded-3xl bg-white/85 p-10 text-center">
        <span className="mx-auto inline-grid h-16 w-16 animate-gallop place-items-center rounded-2xl border-2 border-ink bg-grass text-cream">
          <PartyPopper className="h-8 w-8" />
        </span>
        <h2 className="mt-5 font-display text-4xl">Atın Yola Çıktı!</h2>
        <p className="mt-3 text-coffee/85">
          Sipariş <span className="font-extrabold">#AS-{success.orderId}</span> onaylandı.
          Tahmini varış: <span className="font-extrabold text-brick">{success.eta} dakika</span>.
        </p>
        <div className="mt-5 rounded-2xl border-2 border-dashed border-haydark/60 bg-hay/15 p-4 text-sm font-bold text-coffee">
          Lütfen kapıyı aralık bırakın ve merdivenleri serbest tutun.
          Atlığımız (kuryemiz) kendini göstermeden gelir: duyacağınız tek şey dıgıdık.
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/atlar"
            className="rounded-2xl border-2 border-ink bg-cream px-5 py-3 font-display text-lg transition-colors hover:bg-parchment"
          >
            Bir At Daha?
          </Link>
          <Link
            href="/yaris"
            className="sticker rounded-2xl bg-brick px-5 py-3 font-display text-lg text-cream transition-transform hover:-translate-y-0.5"
          >
            Beklerken Yarış Oyna
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-mocha/40 bg-white/50 p-12 text-center">
            <ShoppingBasket className="mx-auto h-12 w-12 text-mocha/50" />
            <h2 className="mt-4 font-display text-3xl">Sepet boş, kapı da boş</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-mocha">
              Şu an kapında at yok ve bu kabul edilemez bir durum. Ahır kataloğunda
              asiller seni bekliyor.
            </p>
            <Link
              href="/atlar"
              className="sticker mt-6 inline-block rounded-2xl bg-brick px-6 py-3 font-display text-lg text-cream transition-transform hover:-translate-y-0.5"
            >
              At Seçmeye Git
            </Link>
          </div>
        ) : (
          list.map((i) => (
            <div
              key={i.cartId}
              className="sticker flex items-center gap-4 rounded-3xl bg-white/85 p-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={i.image}
                alt={i.name}
                className="h-20 w-24 shrink-0 rounded-2xl border-2 border-ink object-cover"
              />
              <div className="grow">
                <h3 className="font-display text-xl leading-tight">{i.name}</h3>
                <p className="text-xs font-semibold italic text-mocha">
                  “{i.tagline}”
                </p>
                <p className="mt-1.5 font-display text-lg text-brick">{fmt(i.price)}</p>
              </div>
              <button
                onClick={() => remove(i.cartId)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-ink bg-cream transition-colors hover:bg-[#ffe3df] hover:text-brick"
                aria-label={`${i.name} sepetten çıkar`}
                title="Sepetten çıkar (at kızar)"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))
        )}

        {pastOrders.length > 0 && (
          <div className="pt-4">
            <h3 className="font-display text-2xl">Geçmiş Siparişlerin</h3>
            <div className="mt-3 space-y-3">
              {pastOrders.map((o) => (
                <div
                  key={o.id}
                  className="rounded-2xl border-2 border-ink bg-parchment/70 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-2 font-display text-lg">
                      <PackageCheck className="h-5 w-5 text-grass" />
                      #AS-{o.id}
                    </span>
                    <span className="rounded-full border-2 border-ink bg-grass px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-cream">
                      {o.status}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs font-bold text-mocha">
                    {new Date(o.createdAt).toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    — {o.items.join(", ")}
                  </p>
                  <p className="mt-1 font-display text-lg text-brick">{fmt(o.total)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Özet */}
      {list.length > 0 && (
        <aside className="sticker sticky top-28 rounded-3xl bg-white/85 p-6">
          <h3 className="font-display text-2xl">Sipariş Özeti</h3>
          <div className="mt-4 space-y-2 text-sm font-semibold text-coffee">
            <div className="flex justify-between">
              <span>At sayısı</span>
              <span className="font-extrabold">{list.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Kargo</span>
              <span className="font-extrabold text-grass">0 ₺ (at yürüyor)</span>
            </div>
            <div className="flex justify-between">
              <span>Kişneme bedeli</span>
              <span className="font-extrabold text-grass">Hediye</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t-2 border-dashed border-sand pt-4">
            <span className="font-display text-xl">Toplam</span>
            <span className="font-display text-3xl text-brick">{fmt(total)}</span>
          </div>

          <label className="mt-5 block text-xs font-extrabold uppercase tracking-wider text-mocha">
            Teslimat adresi
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border-2 border-ink bg-cream px-3">
            <MapPin className="h-4 w-4 shrink-0 text-mocha" />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder='"Eve bırak" sayılmaz, ipucu ver'
              className="w-full bg-transparent py-3 text-sm font-semibold outline-none placeholder:text-mocha/50"
            />
          </div>

          {error && (
            <p className="mt-3 rounded-xl border-2 border-ink bg-[#ffe3df] p-3 text-xs font-bold text-brick">
              {error}
            </p>
          )}

          <button
            onClick={checkout}
            disabled={busy}
            className="sticker mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-brick px-4 py-4 font-display text-xl tracking-wide text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-70"
          >
            {busy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <HorseshoeIcon className="h-5 w-5" />
            )}
            {busy ? "Atlar hazırlanıyor..." : "Siparişi Ver — 30 dk"}
          </button>
          <p className="mt-3 text-center text-[11px] font-bold text-mocha">
            Teslimatta kapıyı at çalar. Zili boşuna tamir ettirmeyin.
          </p>
        </aside>
      )}
    </div>
  );
}
