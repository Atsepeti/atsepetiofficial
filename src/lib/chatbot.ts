type Rule = { keys: string[]; replies: string[] };

const RULES: Rule[] = [
  {
    keys: ["merhaba", "selam", "hey", "naber", "nasılsın", "iyi günler"],
    replies: [
      "Merhaba! Ben AtBot 3000, kişisel at danışmanınız. Size nasıl yardımcı olabilirim? Kişneme sesi duyuyorsanız normaldir.",
      "Hoş geldiniz! Buyrun, atlı sohbete hazırım. Ne sormak istersiniz?",
    ],
  },
  {
    keys: ["wifi", "wi-fi", "internete", "internet", "bluetooth", "5g", "şarj"],
    replies: [
      "Maalesef atlarımız WiFi'ye bağlanmıyor. Ancak bakışlarıyla duygusal bağlantı kurarlar; gecikme süresi 0 ms'dir. 2027 modellerinde Bluetooth düşünülüyor.",
      "Atlarımız 5G desteklemez ama sizi görünce kalbi 5G hızında atar. Şarja da gerek yok, yulaf yeterli.",
    ],
  },
  {
    keys: ["apartman", "asansör", "kat", "daire", "eve sığar", "balkon", "merdiven"],
    replies: [
      "At apartmana çıkar ama asansörle arası limonidir; merdiven tercih eder. 4. kattan yukarısı için 'Kapıda Bırak' seçeneğimiz mevcut (at bahçede bekler, küsmez).",
      "Teknik olarak sığar. Kanepenin üstüne çıkmaya çalışırsa sorumluluk size aittir. Balkon teslimatı ek ücrete tabidir (atın rızası dahil).",
    ],
  },
  {
    keys: ["iade", "geri ver", "beğenmedim", "değişim", "cayma"],
    replies: [
      "14 gün içinde koşulsuz iade! Tek şart: atın duyguları incinmemiş olmalı. İade kargo ücreti yoktur, çünkü at zaten geri yürür.",
      "İade edebilirsiniz ama at size veda ederken gözlerinin içine bakamazsınız. Bizden söylemesi. Yasal süre 14 gündür.",
    ],
  },
  {
    keys: ["kargo", "teslimat", "ne zaman gelir", "kaç gün", "gecikme", "sipariş"],
    replies: [
      "Ortalama teslimat süremiz 27 dakikadır. Kargo ücreti almıyoruz çünkü at kendi geliyor, biz sadece adresi fısıldıyoruz.",
      "Atınız çıktıktan sonra canlı takip yoktur; at GPS takmaz, gurur meselesidir. Kapıyı aralık bırakmanız yeterli.",
    ],
  },
  {
    keys: ["fiyat", "pahalı", "indirim", "kupon", "taksit", "ucuz", "para"],
    replies: [
      "Fiyatlarımız samanla ödenmez, TL isteriz. 12 taksit imkânı vardır; 13. taksidi at kendi öder (şaka). 'ATSEPETI10' kuponu ise tamamen uydurmadır ama moral verir.",
      "Pahalı bulanlara tavsiyemiz: Felsefeci Fikret (99.999 ₺). Hem derin sohbet eder hem cüzdanınızı yormaz.",
    ],
  },
  {
    keys: ["yem", "yer mi", "beslenme", "yulaf", "havuç", "saman", "mama", "aç"],
    replies: [
      "Günde 3 öğün saman + ara öğün havuç öneriyoruz. Fırtına Gülnihal için bu hesabı 2 ile çarpın. Pizza yemez, denedik.",
      "Yem aboneliğimiz ayrı satılır: 'Samansız Kalma Paketi'. İlk ay yanında 5 kg başlangıç samanı hediyemizdir.",
    ],
  },
  {
    keys: ["yarış", "bahis", "hipodrom", "koşu", "kupon", "atcoin", "coin"],
    replies: [
      "At Yarışı sayfamızda bahis heyecanı sizi bekliyor! AtCoin'ler tamamen sanal, heyecan tamamen gerçek. 1. gelen ata 4 kat ödeme yapıyoruz.",
      "Yarış sayfasına gidin, atınızı seçin, bahsinizi koyun. Kaybederseniz sorumluluk atındır. O hep böyle söyler.",
    ],
  },
  {
    keys: ["video", "youtube", "instagram", "sosyal", "tiktok", "medya"],
    replies: [
      "Videolarımız bölümünden harika at videoları izleyebilir, giriş yaptıysanız kendi videonuzu yükleyebilirsiniz. YouTube ve Instagram linklerimiz footer'da, atlardan daha hızlı ulaşırsınız.",
    ],
  },
  {
    keys: ["şifre", "giriş", "hesap", "kayıt", "üye", "parola"],
    replies: [
      "Kayıt olmak çok kolay: sağ üstten 'Kayıt Ol' deyin, 10 saniyenizi alır (at hızında: 8 saniye). Şifrenizi unutursanız panik yapmayın, biz de unutuyoruz bazen.",
      "Hesabınızla ilgili sorun mu var? Çıkış yapıp tekrar girin; at bakımında olduğu gibi, yeniden başlatmak çoğu şeyi çözer.",
    ],
  },
  {
    keys: ["gerçek", "robot", "yapay zeka", "insan mısın", "bot musun", "ai"],
    replies: [
      "Ben AtBot 3000'im. Yapay zekâyım ama at sevgim %100 gerçek. Arka planda bir atın klavye kullandığını iddia edenler de var, yalanlamıyorum.",
    ],
  },
  {
    keys: ["kedi", "köpek", "hayvan", "anlaşır", "pati"],
    replies: [
      "Kedilerle anlaşması kediye bağlıdır. Deneyimlerimize göre kedi genelde patron olur, at kabul eder. Köpeklerle ise derhal koşu arkadaşı olurlar.",
    ],
  },
  {
    keys: ["ses", "gürültü", "uyku", "gece", "komşu", "kişneme"],
    replies: [
      "Atlar sadece maç günleri ve romantik film sahnelerinde ses çıkarır. Fırtına Gülnihal hariç; o bir yaşam tarzıdır.",
    ],
  },
  {
    keys: ["düğün", "evlenme", "teklif", "romantik", "aşk"],
    replies: [
      "Evlilik teklifi için Prenses Lokum'u öneriyoruz; yüzüğü yeleğine takıyorlar, etki garantili. Düğün kiralama hizmetimiz henüz yok ama atın kalbi her zaman açık.",
    ],
  },
  {
    keys: ["teşekkür", "sağol", "eyvallah", "harika", "süper", "mükemmel"],
    replies: [
      "Rica ederim! İyi kişnemeler dilerim. Başka bir konuda yardımcı olabilir miyim?",
      "Ne demek, görevimiz! Atınızla mutlu günler dilerim. Ya da atsız günlerinizde de mutlu olun, o da olur.",
    ],
  },
  {
    keys: ["admin", "h.a.t", "hocam", "kurucu", "sahip", "patron"],
    replies: [
      "Bu sitenin tüm hakları H.A.T'a aittir. M. Hocam sağolsun. Yönetimle görüşmek isterseniz saman yazılı dilekçe kabul ediyoruz (şaka, destek hattından yazın).",
    ],
  },
];

const FALLBACKS = [
  "Bunu tam anlayamadım ama atlarımız bunu duysa kişnerdi. Kargo, iade, fiyat, yarış ya da 'at WiFi'ye bağlanır mı' gibi konularda sorabilirsiniz.",
  "Hmm, AtBot veri tabanımda buna karşılık sadece bir kişneme sesi var. Bir de şöyle deneyin: 'teslimat kaç dakika?', 'iade var mı?'",
  "İlginç bir soru! Bunu atlarımıza sorduk, hepsi aynı anda havuç istedi. Daha somut bir soruyla tekrar deneyin.",
  "Bu konuda uzman görüşü almam lazım: uzman at şu an molasında. Başka bir şey sorabilirsiniz: kargo, fiyat, apartman, WiFi...",
];

const SIGNATURES = [
  "",
  "",
  "\n\n— AtBot 3000, iyi kişnemeler diler.",
  "\n\n(At hızında yanıt: 27 dakika garantili.)",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function atBotReply(
  message: string,
  history: { role: string; content: string }[]
): string {
  const m = message.toLocaleLowerCase("tr-TR");

  // Aynı soru tekrar edildiyse takılma yok, takılma VAR.
  const userMsgs = history.filter((h) => h.role === "user").map((h) => h.content);
  if (
    userMsgs.length >= 2 &&
    userMsgs[userMsgs.length - 1].trim().toLocaleLowerCase("tr-TR") ===
      userMsgs[userMsgs.length - 2].trim().toLocaleLowerCase("tr-TR")
  ) {
    return (
      pick([
        "Bunu az önce de sordunuz! Cevap aynı, atlar aynı, heyecan aynı. Ama merakınızı takdir ettim.",
        "Déjà vu mu yaşıyorum? Bu soruyu az önce cevaplamıştım. Atlar da aynı fikirde.",
      ]) + pick(SIGNATURES)
    );
  }

  for (const rule of RULES) {
    if (rule.keys.some((k) => m.includes(k))) {
      return pick(rule.replies) + pick(SIGNATURES);
    }
  }
  return pick(FALLBACKS) + pick(SIGNATURES);
}
