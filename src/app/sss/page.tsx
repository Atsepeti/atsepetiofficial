import FaqAccordion from "@/components/FaqAccordion";
import { Star, Shuffle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sıkça Sorulan Sorular — At Sepeti",
  description: "At WiFi'ye bağlanır mı? Apartmana sığar mı? Hepsinin cevabı burada; ciddiyeti tartışılır.",
};

const FAQS = [
  {
    q: "At WiFi'ye bağlanır mı?",
    a: "Hayır. Atlarımız 5G desteklemez, Bluetooth'u felsefi sebeplerle reddeder. Ancak bakışlarıyla sıfır gecikmeli duygusal bağlantı kurarlar. 2027 modellerinde WiFi düşünülüyor ama atlar pek istekli değil.",
  },
  {
    q: "Atı apartmana nasıl sokayım?",
    a: "Merdiven en güvenlisidir; atlar asansörü 'küçük hareketli oda' olarak nitelendirip boykot eder. 4. kattan yukarısı için 'Bahçede Bırak' seçeneğimizi öneririz. Komşularınıza önceden haber verin — sürpriz at, sürpriz sorun demektir.",
  },
  {
    q: "30 dakikada nasıl yetiştiriyorsunuz?",
    a: "Sırrımız basit: atlar zaten hızlı. Siparişiniz düştüğü anda adrese fısıldıyoruz, gerisini at hallediyor. Trafikte trafik ışıkları atlara işlemez (bu bilgiyi yetkililere söylemeyin).",
  },
  {
    q: "Kargo ücreti var mı?",
    a: "Yok. At kendi yürüdüğü için kargo bedava. Aslında teknik olarak at bizi taşımıyor, biz onu bekliyoruz. Lojistiğin romantik hâli.",
  },
  {
    q: "İade edebilir miyim?",
    a: "14 gün koşulsuz iade. Tek şart: atın duyguları incinmemiş olmalı. Uyarıyoruz: iade anında kapıda göz göze gelirseniz vazgeçme ihtimaliniz %94'tür (kurum içi istatistik).",
  },
  {
    q: "At gece ses çıkarır mı?",
    a: "Sadece maç günleri ve romantik filmlerde. Fırtına Gülnihal istisnadır; onu aldıysanız gece gündüz kavramını yeniden tanımlamaya hazır olun.",
  },
  {
    q: "Evdeki kedimle anlaşır mı?",
    a: "Kediye bağlı. Verilerimiz kedilerin %97'sinin ilişkide patron olduğunu, atların bunu olgunlukla karşıladığını gösteriyor. Köpeklerle ise 3 dakikada koşu arkadaşı olurlar.",
  },
  {
    q: "Saman fiyata dahil mi?",
    a: "İlk 5 kilogram hediyemizdir. Sonrası için 'Samansız Kalma Paketi' aboneliğimizi öneririz. Fırtına Gülnihal sahiplerine ikinci samana %0 indirim (stokçuluk yapmayın).",
  },
  {
    q: "AtCoin gerçek para mı?",
    a: "Keşke. AtCoin tamamen sanaldır, sadece At Yarışı Arenası'nda geçer. Gerçek heyecan, sanal coin: finansal olarak en güvenli adrenalindir.",
  },
  {
    q: "Atı düğünüme götürebilir miyim?",
    a: "Prenses Lokum tam da bunun için var. Kız istemeye atla giden müşterilerimizin başarı oranı kurum rekorudur. Düğün kiralama henüz yok ama atın kalbi açık.",
  },
  {
    q: "Atım kayboldu, ne yapayım?",
    a: "Sakin olun. Kara Şimşek gölgede, Beyaz Gölge Bülent karda kaybolur. Genellikle mutfakta havuç sesiyle geri dönerler. 72 saati geçerse destek hattına yazın; AtBot arama ekibi (1 at) görevlendirir.",
  },
  {
    q: "Şifremi unuttum. At hatırlar mı?",
    a: "Atlar yüzleri unutmaz ama şifreleri hiç bilmez. Çıkış yapıp tekrar kayıt olmanız gerekebilir; geliştirme ekibimiz (M. Hocam sağolsun) şifre sıfırlamayı yol haritasına aldı.",
  },
  {
    q: "Yarışta hile oluyor mu?",
    a: "Hipodromumuz bağımsız bir at tarafından denetlenir. Kendisi tarafsızlığıyla ünlüdür çünkü sonucu anlayamıyor. Rastgelelik %100, heyecan %300.",
  },
  {
    q: "Bu site gerçek mi?",
    a: "Bu soruyu sorduğunuza göre Felsefeci Fikret'le tanışmamışsınız. Sitenin gerçekliği, sizin gerçekliğiniz kadar gerçektir. — Bu cevap Fikret tarafından onaylanmıştır.",
  },
];

const REVIEWS = [
  {
    name: "Hayrettin K.",
    stars: 5,
    text: "At kapıya geldiğinde kargo takip numarası sordu. Veremedik, bozuldu. Sonra havuçla barıştık.",
    horse: "Rüzgarın Oğlu Bekir",
  },
  {
    name: "Selin Y.",
    stars: 5,
    text: "Beyaz Gölge Bülent'i kışın sipariş ettim, karda kayboldu. 3 gündür beraber yaşıyoruz ama onu sadece yağmur sesiyle buluyorum. 10/10 kamuflaj.",
    horse: "Beyaz Gölge Bülent",
  },
  {
    name: "Mert A.",
    stars: 5,
    text: "Fikret'le üç saat varoluş konuştuk. Hayatım değişti. Hâlâ koşmuyor ama koşmanın anlamını sorgulamak da güzelmiş.",
    horse: "Felsefeci Fikret",
  },
  {
    name: "Derya T.",
    stars: 4,
    text: "Apartmana çıkardık, asansör atı kabul etmedi. Merdivenden indik, ikimiz de kas yaptık. Fitness üyeliğinden ucuz.",
    horse: "Kara Şimşek",
  },
  {
    name: "Kamil B.",
    stars: 5,
    text: "Kız istemeye atla gittik. Verdiler. Teşekkürler At Sepeti, düğünde korteje at da katılacak.",
    horse: "Prenses Lokum",
  },
  {
    name: "Anonim (kedi sahibi)",
    stars: 3,
    text: "Atım WiFi'ye bağlanmadı ama modemin yanında uyuyor. Ben bağlandım, o bağlanmadı. Kim akıllı şimdi?",
    horse: "Nostalji Nuri",
  },
  {
    name: "Nurcan H.",
    stars: 5,
    text: "İade edecektim. Kapıda göz göze geldik. Edemedim. Şimdi üçüncü atı alıyorum. Bu site bir yaşam tarzıdır.",
    horse: "İkili Paket: Cemal & Kemal",
  },
  {
    name: "Oktay D.",
    stars: 4,
    text: "Şimşek McQueen kırmızı ışıkta durmuyor. Ceza bana geldi. Yine de 4 yıldız; hız gerçekten hız.",
    horse: "Şimşek McQueen",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SSSPage() {
  const reviews = shuffle(REVIEWS).slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <span className="inline-block -rotate-2 rounded-full border-2 border-ink bg-hay px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em]">
          Merak edilenler
        </span>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">
          Sıkça Sorulan Sorular
        </h1>
        <p className="mt-3 text-lg text-coffee/85">
          Sordunuz, cevapladık. Bazı cevapların ciddiyeti atlar tarafından
          onaylanmamıştır.
        </p>
      </div>

      <div className="mt-10">
        <FaqAccordion items={FAQS} />
      </div>

      {/* RASTGELE YORUMLAR */}
      <div className="mt-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-grass px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-cream">
              <Shuffle className="h-3.5 w-3.5" />
              Rastgele sıralanır
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">
              Saçma Sapan Müşteri Yorumları
            </h2>
            <p className="mt-2 text-coffee/80">
              Her yenilemede sıraları değişir. Yorumlar %100 gerçek değildir;
              duyguları öyledir.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((r, i) => (
            <figure
              key={r.name}
              className={`sticker rounded-3xl bg-white/80 p-6 ${
                i % 3 === 0 ? "-rotate-1" : i % 3 === 1 ? "rotate-1" : "-rotate-2"
              } transition-transform hover:rotate-0`}
            >
              <div className="flex items-center gap-1 text-haydark">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s < r.stars ? "fill-haydark" : "opacity-25"}`}
                  />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-coffee">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-4 border-t-2 border-dashed border-sand pt-3">
                <span className="font-display text-base">{r.name}</span>
                <span className="block text-xs font-bold text-mocha">
                  Satın aldığı at: {r.horse}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
