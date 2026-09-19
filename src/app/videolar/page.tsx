import Link from "next/link";
import { count, desc } from "drizzle-orm";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import VideoUploader from "@/components/VideoUploader";
import VideoCard from "@/components/VideoCard";
import { Clapperboard, LockKeyhole } from "lucide-react";
import { YoutubeIcon, InstagramIcon } from "@/components/Logo";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Videolarımız — At Sepeti",
  description: "Koşan atlar, yürüyen atlar, duran ama karizmatik atlar. Giriş yap, kendi videonu yükle.",
};

const SAMPLE_VIDEOS = [
  {
    title: "Çayırda Sprint Antrenmanı",
    url: "https://videos.pexels.com/video-files/7030396/7030396-uhd_3840_2160_30fps.mp4",
    poster:
      "https://images.pexels.com/videos/7030396/240-fps-4k-4k-video-arena-7030396.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
  },
  {
    title: "Çiftlikte Sabah Koşusu",
    url: "https://videos.pexels.com/video-files/6264718/6264718-uhd_3840_2160_30fps.mp4",
    poster:
      "https://images.pexels.com/videos/6264718/chestnut-equestrian-equine-hd-6264718.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
  },
  {
    title: "Sürüyle Drone Çekimi",
    url: "https://videos.pexels.com/video-files/5087749/5087749-uhd_3840_2160_25fps.mp4",
    poster:
      "https://images.pexels.com/videos/5087749/pexels-photo-5087749.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
  },
  {
    title: "Ashil Tepeler Turu",
    url: "https://videos.pexels.com/video-files/5087763/5087763-uhd_3840_2160_25fps.mp4",
    poster:
      "https://images.pexels.com/videos/5087763/pexels-photo-5087763.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
  },
  {
    title: "Sahilde Yürüyüş (Romantik Model)",
    url: "https://videos.pexels.com/video-files/18359865/18359865-hd_1920_1080_30fps.mp4",
    poster:
      "https://images.pexels.com/videos/18359865/pexels-photo-18359865.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
  },
  {
    title: "Koyunların Arasında Kahraman",
    url: "https://videos.pexels.com/video-files/11907381/11907381-hd_1920_1080_50fps.mp4",
    poster:
      "https://images.pexels.com/videos/11907381/horse-11907381.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
  },
];

let samplesSeeded = false;

async function ensureSampleVideos() {
  if (samplesSeeded) return;
  try {
    const r = await db.select({ v: count() }).from(videos);
    if ((r[0]?.v ?? 0) === 0) {
      await db.insert(videos).values(
        SAMPLE_VIDEOS.map((v) => ({
          ...v,
          uploaderName: "At Sepeti",
          source: "web",
        }))
      );
    }
    samplesSeeded = true;
  } catch {
    // tablolar hazır değilse geç
  }
}

export default async function VideolarPage() {
  await ensureSampleVideos();
  const user = await getSessionUser();

  let list: (typeof videos.$inferSelect)[] = [];
  try {
    list = await db.select().from(videos).orderBy(desc(videos.id)).limit(60);
  } catch {
    list = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-brick px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-cream">
            <Clapperboard className="h-4 w-4" />
            Videolarımız
          </span>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl">
            Dıgıdık Sineması
          </h1>
          <p className="mt-3 text-lg text-coffee/85">
            Koşan atlar, yürüyen atlar, duran ama karizmatik atlar. Giriş
            yaparsan kendi videonu yüklersin — atın meşhur olur, seni saman
            olarak hatırlar.
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="https://www.youtube.com/@atsepetiofficial"
            target="_blank"
            rel="noreferrer"
            className="sticker flex items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-extrabold text-cream transition-transform hover:-translate-y-0.5"
          >
            <YoutubeIcon className="h-5 w-5 text-brick" />
            YouTube&apos;dayız
          </a>
          <a
            href="https://www.instagram.com/atsepetiofficial/"
            target="_blank"
            rel="noreferrer"
            className="sticker flex items-center gap-2 rounded-2xl bg-cream px-4 py-3 text-sm font-extrabold transition-transform hover:-translate-y-0.5"
          >
            <InstagramIcon className="h-5 w-5 text-brick" />
            Instagram
          </a>
        </div>
      </div>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_360px]">
        {list.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {list.map((v) => (
              <VideoCard
                key={v.id}
                id={v.id}
                title={v.title}
                url={v.url}
                poster={v.poster}
                uploaderName={v.uploaderName}
                createdAt={v.createdAt.toISOString()}
                isAdmin={!!user?.isAdmin}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-mocha/40 p-10 text-center text-mocha">
            Film arşivi boş. İlk videoyu sen yükle, tarihe geç.
          </p>
        )}

        <aside className="lg:sticky lg:top-28">
          {user ? (
            <VideoUploader />
          ) : (
            <div className="sticker rounded-3xl bg-white/85 p-6 text-center">
              <span className="mx-auto inline-grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink bg-hay">
                <LockKeyhole className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-display text-2xl">
                Yükleme Girişe Özeldir
              </h3>
              <p className="mt-2 text-sm text-coffee/85">
                Video yüklemek için üye olman lazım. Atlar anonim şöhretten
                hoşlanmaz.
              </p>
              <div className="mt-5 flex justify-center gap-2">
                <Link
                  href="/giris?next=/videolar"
                  className="sticker rounded-xl bg-brick px-5 py-2.5 font-display text-base text-cream"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="rounded-xl border-2 border-ink bg-cream px-5 py-2.5 font-display text-base"
                >
                  Kayıt Ol
                </Link>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-2xl border-2 border-dashed border-mocha/40 bg-parchment/70 p-4 text-xs font-bold leading-relaxed text-mocha">
            Yayın ilkelerimiz: At içermeyen videolara AtBot 3000 üzülür.
            Kişneme içeren videolara öncelik tanınır. Hakaret içeren atlara
            tolerans yoktur.
          </div>
        </aside>
      </div>
    </div>
  );
}
