import { count } from "drizzle-orm";
import { db } from "@/db";
import { horses } from "@/db/schema";

export function formatPrice(kurusFreeTL: number): string {
  return (
    new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(
      kurusFreeTL
    ) + " ₺"
  );
}

export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export const HERO_IMAGE =
  "https://images.pexels.com/photos/18168930/pexels-photo-18168930.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

export const SEED_HORSES = [
  {
    slug: "simsek-mcqueen",
    name: "Şimşek McQueen",
    tagline: "Kırmızı başlıklı hız canavarı",
    breed: "Ateşli Arap (Turbolu)",
    price: 189999,
    image:
      "https://images.pexels.com/photos/14704387/pexels-photo-14704387.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    colorHex: "#C6362C",
    speed: 9,
    charm: 7,
    appetite: 6,
    description:
      "0-100'e çim sahada 11 saniyede çıkar. Kaçow demez ama bakışlarıyla anlatır. Kırmızı ışıkta durmaz, o yüzden şehir içi kullanıma dikkat.",
    badge: "En Hızlı",
  },
  {
    slug: "ruzgarin-oglu-bekir",
    name: "Rüzgarın Oğlu Bekir",
    tagline: "Soy ağacı belediye onaylı",
    breed: "Safkan Mahallesi Karma",
    price: 149999,
    image:
      "https://images.pexels.com/photos/15291038/pexels-photo-15291038.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    colorHex: "#A0522D",
    speed: 8,
    charm: 8,
    appetite: 7,
    description:
      "Babası da hızlıydı, dedesi de. Ailecek koşarlar. Bekir sabahları kendi kendine ısınır, siz kahvaltı yaparken o tur atar.",
    badge: "Personelin Favorisi",
  },
  {
    slug: "kara-simsek",
    name: "Kara Şimşek",
    tagline: "Gece kargoda görünmez",
    breed: "Premium Siyah Seri",
    price: 219999,
    image:
      "https://images.pexels.com/photos/17000704/pexels-photo-17000704.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    colorHex: "#1F1A17",
    speed: 7,
    charm: 9,
    appetite: 5,
    description:
      "Gece teslimatlarında %100 kamuflaj. Kaybolursa panik yapmayın, muhtemelen gölgededir. Parlak güneşte tavsiye edilen model.",
    badge: "Premium",
  },
  {
    slug: "prenses-lokum",
    name: "Prenses Lokum",
    tagline: "Koşmaz, süzülür",
    breed: "Paparazzi Dostu Irk",
    price: 234999,
    image:
      "https://images.pexels.com/photos/5689060/pexels-photo-5689060.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    colorHex: "#D8A05A",
    speed: 4,
    charm: 10,
    appetite: 4,
    description:
      "Instagram'ı sizden iyi kullanır. Fotoğraf çekilirken poz verir, açılışını bilir. Diyetine dikkat edin: yulaf değil, övgüyle beslenir.",
    badge: "En Fotogenik",
  },
  {
    slug: "felsefeci-fikret",
    name: "Felsefeci Fikret",
    tagline: "Nietzsche okur, nadiren koşar",
    breed: "Varoluşsal Karışım",
    price: 99999,
    image:
      "https://images.pexels.com/photos/16760165/pexels-photo-16760165.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    colorHex: "#EDE6DA",
    speed: 2,
    charm: 9,
    appetite: 3,
    description:
      "Bakışlarında 2000 yıllık felsefe birikimi var. 'Neden koşalım ki?' diye sorar, cevabınızı bekler. Derin sohbetler için idealdir.",
    badge: "En Derin Bakışlı",
  },
  {
    slug: "beyaz-golge-bulent",
    name: "Beyaz Gölge Bülent",
    tagline: "Kış aylarında teslimat ücretsiz",
    breed: "Kar Kamuflajlı Beyaz",
    price: 159999,
    image:
      "https://images.pexels.com/photos/4102764/pexels-photo-4102764.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    colorHex: "#F4F1EA",
    speed: 6,
    charm: 8,
    appetite: 5,
    description:
      "Kar yağınca gözden kaybolur, zaten görünmezdir. Yazın güneşte parlar, dikkat: kamaşma yapabilir. Güneş gözlüğüyle yaklaşın.",
    badge: null,
  },
  {
    slug: "firtina-gulnihal",
    name: "Fırtına Gülnihal",
    tagline: "Mahallenin en gürültülü kişnemesi",
    breed: "Gösterişli Kızıl Doru",
    price: 174999,
    image:
      "https://images.pexels.com/photos/1848727/pexels-photo-1848727.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    colorHex: "#8A4B2A",
    speed: 7,
    charm: 8,
    appetite: 9,
    description:
      "Kişnemesi 140 desibel. Komşularınızı önceden bilgilendirin. Sabah 08.00'den önce uyandırmaz (bu bir söz değildir). Yem stoğunuza göre fiyat değişebilir.",
    badge: "En Gürültülü",
  },
  {
    slug: "gece-vardiyasi-veysel",
    name: "Gece Vardiyası Veysel",
    tagline: "Sadece gece tam performans",
    breed: "Nokturnal Siyah Seri",
    price: 119999,
    image:
      "https://images.pexels.com/photos/7622241/pexels-photo-7622241.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    colorHex: "#231F1C",
    speed: 6,
    charm: 6,
    appetite: 6,
    description:
      "Gündüzleri resmi olarak 'mola' modundadır. Gece 02.00'de nallarını duyarsanız korkmayın, spor yapıyordur. Gece insanı olanlara tavsiye.",
    badge: null,
  },
  {
    slug: "nostalji-nuri",
    name: "Nostalji Nuri",
    tagline: "Renkli fotoğrafta bile siyah-beyaz çıkar",
    breed: "Klasik 1962 Model",
    price: 134999,
    image:
      "https://images.pexels.com/photos/21967392/pexels-photo-21967392.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    colorHex: "#5B5148",
    speed: 5,
    charm: 10,
    appetite: 5,
    description:
      "Siyah-beyaz Türk filmlerinden fırlamış gibidir. Yanında otomatik olarak eski şarkılar çalar. Torunlarınıza anlatacağınız bir dostluk.",
    badge: "Koleksiyonluk",
  },
  {
    slug: "ikili-paket-cemal-kemal",
    name: "İkili Paket: Cemal & Kemal",
    tagline: "Bozuk para üstü yerine ikinci at",
    breed: "Brezilya Sahra Karması (x2)",
    price: 299999,
    image:
      "https://images.pexels.com/photos/9010011/pexels-photo-9010011.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    colorHex: "#B0793F",
    speed: 6,
    charm: 9,
    appetite: 10,
    description:
      "Ayrı satılmaz, küserler. Biri koşarken diğeri tezahürat yapar. Yem masrafı çift kişiliktir, dostluk da. İkisi birden eve sığar mı? Sığar, inanın.",
    badge: "2'si 1 Arada",
  },
];

let seeded = false;

export async function ensureHorsesSeeded() {
  if (seeded) return;
  try {
    const rows = await db.select({ value: count() }).from(horses);
    if ((rows[0]?.value ?? 0) === 0) {
      await db.insert(horses).values(SEED_HORSES);
    }
    seeded = true;
  } catch {
    // tablo henüz yoksa sessizce geç (ilk push öncesi build aşaması)
  }
}
