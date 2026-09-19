import Link from "next/link";
import { MapPin, PhoneCall } from "lucide-react";
import { LogoMark, HorseshoeIcon, YoutubeIcon, InstagramIcon } from "./Logo";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t-2 border-ink bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="inline-block text-cream [&_span]:text-hay">
              <LogoMark />
            </span>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/70">
              Türkiye&apos;nin ilk ve tek at e-ticaret platformu. Atını seç,
              sepete ekle, kapıyı aralık bırak. Gerisi atın işi.
            </p>
            <p className="mt-4 inline-flex rotate-[-1.5deg] items-center gap-2 rounded-lg border-2 border-hay px-3 py-1.5 font-display text-sm tracking-wide text-hay">
              <HorseshoeIcon className="h-4 w-4" />
              H.A.T KALİTESİ
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg tracking-wide text-hay">
              Hızlı Linkler
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-cream/80">
              <li><Link href="/atlar" className="hover:text-hay">Atlar</Link></li>
              <li><Link href="/sepetim" className="hover:text-hay">Sepetim</Link></li>
              <li><Link href="/yaris" className="hover:text-hay">At Yarışı (3D)</Link></li>
              <li><Link href="/videolar" className="hover:text-hay">Videolarımız</Link></li>
              <li><Link href="/sss" className="hover:text-hay">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="/destek" className="hover:text-hay">Destek Hattı</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg tracking-wide text-hay">
              Sosyal
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="https://www.youtube.com/@atsepetiofficial"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-cream/80 hover:text-hay"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-brick">
                    <YoutubeIcon className="h-4.5 w-4.5 text-cream" />
                  </span>
                  @atsepetiofficial
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/atsepetiofficial/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-cream/80 hover:text-hay"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-tr from-hay to-brick">
                    <InstagramIcon className="h-4.5 w-4.5 text-cream" />
                  </span>
                  @atsepetiofficial
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg tracking-wide text-hay">
              İletişim
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-cream/80">
              <li className="flex items-start gap-2">
                <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-hay" />
                <span>
                  Destek hattımız mesajlaşma üzerinden çalışır.
                  <Link href="/destek" className="ml-1 font-bold text-hay underline underline-offset-2">
                    Hemen yaz
                  </Link>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-hay" />
                <span>Merkez Ahır Sk. No: 30, Dıgıdık Mah. / İnternet</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/15 pt-6 text-center text-xs text-cream/60 md:flex-row md:text-left">
          <p>
            © {new Date().getFullYear()} At Sepeti. Tüm hakları{" "}
            <span className="font-extrabold text-hay">H.A.T</span>&apos;a
            aittir. <span className="font-bold text-cream/80">M. Hocam sağolsun.</span>
          </p>
          <p>Hiçbir atın duygusu incinmemiştir. (Felsefeci Fikret hariç, o zaten sorguluyor.)</p>
        </div>
      </div>
    </footer>
  );
}
