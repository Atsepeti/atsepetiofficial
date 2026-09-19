import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { horses } from "@/db/schema";
import { ensureHorsesSeeded, HERO_IMAGE } from "@/lib/horses";
import HorseCard from "@/components/HorseCard";
import { HorseshoeIcon } from "@/components/Logo";
import {
  MousePointerClick,
  ShoppingBasket,
  DoorOpen,
  Timer,
  ShieldCheck,
  PiggyBank,
  PlayCircle,
  HelpCircle,
  MessagesSquare,
  Flag,
  ArrowRight,
} from "lucide-react";

const STATS = [
  { value: "12.438", label: "teslim edilen at", icon: <DoorOpen className="h-5 w-5" /> },
  { value: "27 dk", label: "ortalama teslimat", icon: <Timer className="h-5 w-5" /> },
  { value: "%99,9", label: "memnuniyet (atlar anlamında)", icon: <ShieldCheck className="h-5 w-5" /> },
  { value: "0 ₺", label: "kargo ücreti (at yürüyor)", icon: <PiggyBank className="h-5 w-5" /> },
];

const STEPS = [
  {
    n: "1",
    title: "Atını Seç",
    desc: "Katalogdaki asilleri incele. Zor karardır, hepsi birbirinden at. Beğenmediğin olursa Fikret her zaman oradadır; o da seni pek beğenmez, adildir.",
    icon: <MousePointerClick className="h-7 w-7" />,
    rotate: "-rotate-2",
  },
  {
    n: "2",
    title: "Sepete Ekle",
    desc: "Sepetimiz %100 at tutar, bilimsel olarak kanıtlanmadı ama denedik. Tek tıkla at senindir (henüz değil, önce ödeme).",
    icon: <ShoppingBasket className="h-7 w-7" />,
    rotate: "rotate-2",
  },
  {
    n: "3",
    title: "Kapıyı Aç",
    desc: "At zaten yolda. Merdivenleri üçer beşer çıkar. Kapıyı açtığında burun buruna gelirsiniz; gerisi dostluk.",
    icon: <DoorOpen className="h-7 w-7" />,
    rotate: "-rotate-1",
  },
];

export default async function HomePage() {
  await ensureHorsesSeeded();
  let featured: (typeof horses.$inferSelect)[] = [];
  try {
    featured = await db
      .select()
      .from(horses)
      .orderBy(desc(horses.price))
      .limit(3);
  } catch {
    featured = [];
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b-2 border-ink">
        <div className="pointer-events-none absolute -right-10 top-10 rotate-12 opacity-[0.07]">
          <HorseshoeIcon className="h-64 w-64" />
        </div>
        <div className="pointer-events-none absolute -left-16 bottom-6 -rotate-12 opacity-[0.07]">
          <HorseshoeIcon className="h-56 w-56" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="sticker inline-block -rotate-2 rounded-full bg-grass px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-cream">
              Türkiye&apos;nin ilk at e-ticaret platformu
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              AT MI
              <br />
              İSTİYORSUN?
              <br />
              <span className="mt-1 inline-block -rotate-1 border-2 border-ink bg-hay px-3 shadow-[4px_5px_0_#241708]">
                30 DAKİKADA
              </span>{" "}
              KAPINDA.
            </h1>
            <p className="mt-6 max-w-md text-lg font-medium leading-relaxed text-coffee">
              Atını seç, sepete ekle, kapıyı aralık bırak. Kargo bedava —
              çünkü at kendi yürüyor. Biz sadece adresi fısıldıyoruz.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/atlar"
                className="sticker inline-flex items-center gap-2 rounded-2xl bg-brick px-6 py-4 font-display text-xl tracking-wide text-cream transition-transform hover:-translate-y-1"
              >
                Hemen At Seç
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#nasil"
                className="rounded-2xl border-2 border-ink bg-cream px-6 py-4 font-display text-xl tracking-wide transition-colors hover:bg-parchment"
              >
                Nasıl Çalışır?
              </a>
            </div>
            <p className="mt-5 text-sm font-semibold text-mocha">
              Şimdiye kadar 12.438 kapı çalındı. <span className="italic">(372&apos;si nalla çalındı.)</span>
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="sticker rotate-2 rounded-[2rem] bg-white p-3 transition-transform duration-500 hover:rotate-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_IMAGE}
                alt="Özgürce koşan atlar — yarın belki senin bahçende"
                className="aspect-[4/3] w-full rounded-3xl object-cover"
              />
            </div>
            <span className="sticker absolute -left-4 -top-4 animate-wiggle rounded-2xl bg-grass px-4 py-2 font-display text-cream">
              ORT. 27 DK
            </span>
            <span className="sticker absolute -bottom-5 right-6 rotate-3 rounded-2xl bg-hay px-4 py-2 font-display">
              KİŞNEME GARANTİLİ
            </span>
            <span className="sticker absolute -right-3 top-1/3 hidden -rotate-3 rounded-2xl bg-white px-4 py-2 text-sm font-extrabold sm:block">
              +1 at, -0 problem
            </span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b-2 border-ink bg-ink text-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-hay text-hay">
                {s.icon}
              </span>
              <div>
                <div className="font-display text-3xl text-hay">{s.value}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-cream/70">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED HORSES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-brick">
              Vitrin
            </span>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">
              Haftanın Asilleri
            </h2>
            <p className="mt-2 max-w-lg text-coffee/80">
              Fiyatına göre en asil üç atımız. Asaletin fiyatı olmaz dedik,
              oldu; aşağıda yazıyor.
            </p>
          </div>
          <Link
            href="/atlar"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-hay px-5 py-2.5 font-extrabold transition-transform hover:-translate-y-0.5"
          >
            Tüm atları gör
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {featured.map((h) => (
              <HorseCard key={h.id} horse={h} />
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-2xl border-2 border-dashed border-mocha/40 p-8 text-center text-mocha">
            Atlar şu an ahırda hazırlanıyor. Birazdan yenileyin.
          </p>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section id="nasil" className="border-y-2 border-ink bg-parchment">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-center">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-brick">
              Bilimsel süreç
            </span>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">
              3 Adımda At Sahibi Ol
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-coffee/80">
              NASA&apos;dan daha kolay. Dürüst olalım: birçok şeyden kolay.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className={`sticker relative rounded-3xl bg-cream p-7 ${s.rotate} transition-transform hover:rotate-0`}
              >
                <span className="absolute -top-4 left-6 grid h-9 w-9 rotate-6 place-items-center rounded-xl border-2 border-ink bg-brick font-display text-lg text-cream">
                  {s.n}
                </span>
                <span className="mt-2 inline-grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink bg-hay">
                  {s.icon}
                </span>
                <h3 className="mt-4 font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-coffee/85">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RACE BANNER */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="sticker relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-grass to-grassdark p-8 text-cream sm:p-12">
          <div className="checkered absolute inset-x-0 bottom-0 h-6 opacity-90" />
          <div className="pointer-events-none absolute -right-6 -top-10 rotate-12 opacity-15">
            <Flag className="h-48 w-48" />
          </div>
          <span className="inline-block -rotate-2 rounded-full border-2 border-cream px-4 py-1 text-[11px] font-extrabold uppercase tracking-[0.25em]">
            3D Hipodrom Deneyimi
          </span>
          <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-6xl">
            AT YARIŞI ARENASI
          </h2>
          <p className="mt-4 max-w-xl text-cream/85">
            Atını seç, AtCoin&apos;ini konuştur, 3D hipodromda kaderini izle.
            Birinciye 4 kat ödeme. Kaybedersen suç atındır; kendisi kabul
            etmiştir.
          </p>
          <Link
            href="/yaris"
            className="sticker mt-7 inline-flex items-center gap-2 rounded-2xl bg-hay px-6 py-4 font-display text-xl tracking-wide text-ink transition-transform hover:-translate-y-1"
          >
            <Flag className="h-5 w-5" />
            Hipodroma Git
          </Link>
        </div>
      </section>

      {/* TEASER GRID */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <Link
            href="/videolar"
            className="sticker group rounded-3xl bg-white/80 p-7 transition-transform hover:-translate-y-1.5 hover:rotate-1"
          >
            <span className="inline-grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink bg-brick text-cream">
              <PlayCircle className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-display text-2xl">Videolarımız</h3>
            <p className="mt-2 text-sm leading-relaxed text-coffee/85">
              Koşan atlar, yürüyen atlar, duran ama karizmatik atlar. Giriş
              yaparsan kendi videonu da yüklersin — atın meşhur olur.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold text-brick">
              Hemen izle <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/sss"
            className="sticker group rounded-3xl bg-white/80 p-7 transition-transform hover:-translate-y-1.5 hover:-rotate-1"
          >
            <span className="inline-grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink bg-hay">
              <HelpCircle className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-display text-2xl">Sıkça Sorulan Sorular</h3>
            <p className="mt-2 text-sm italic leading-relaxed text-coffee/85">
              “At WiFi&apos;ye bağlanır mı?”, “Apartmana sığar mı?”, “Kedimle
              anlaşır mı?” — Hepsinin cevabı var, ciddiyeti tartışılır.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold text-brick">
              Sorulara bak <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/destek"
            className="sticker group rounded-3xl bg-white/80 p-7 transition-transform hover:-translate-y-1.5 hover:rotate-1"
          >
            <span className="inline-grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink bg-grass text-cream">
              <MessagesSquare className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-display text-2xl">Destek Hattı</h3>
            <p className="mt-2 text-sm leading-relaxed text-coffee/85">
              AtBot 3000 hizmetinde: yaz, cevap gelsin. Yapay zekâ, gerçek at
              sevgisi. Sorularına 27 dakikadan hızlı cevap.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold text-brick">
              AtBot&apos;a yaz <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t-2 border-ink bg-hay">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <p className="font-display text-lg tracking-wide text-coffee">
            HÂLÂ DÜŞÜNÜYOR MUSUN?
          </p>
          <h2 className="mx-auto mt-2 max-w-3xl font-display text-4xl leading-tight sm:text-6xl">
            Atlar düşünmez. Atlar gider.
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-medium text-coffee/90">
            Kayıt ol, 1.000 AtCoin hoş geldin bonusu ile başla. İlk atını
            seçmeden önce yarışta şov yapabilirsin.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/kayit"
              className="sticker rounded-2xl bg-ink px-7 py-4 font-display text-xl tracking-wide text-cream transition-transform hover:-translate-y-1"
            >
              Kayıt Ol (8 saniye)
            </Link>
            <Link
              href="/atlar"
              className="rounded-2xl border-2 border-ink bg-cream px-7 py-4 font-display text-xl tracking-wide transition-colors hover:bg-parchment"
            >
              Önce Atlara Bakayım
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
