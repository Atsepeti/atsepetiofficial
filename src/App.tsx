import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Camera, Check, ChevronDown, Clock3, MapPin, Minus, Play, Plus, Search, ShieldCheck, ShoppingBag, Trophy, X } from "lucide-react";
import { useMemo, useState } from "react";
import { cityNamesByCode, districtsByCityCode } from "turkey-neighbourhoods";

type Product = { id: string; name: string; note: string; price: number; image: string; type: "At" | "Aksesuar"; mood?: string };

const horses: Product[] = [
  { id: "at-1", name: "Cevdet", note: "Pazartesileri çalışmaz, havuca açıktır.", price: 48000, mood: "Sakin", type: "At", image: "https://images.pexels.com/photos/28245389/pexels-photo-28245389.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1200" },
  { id: "at-2", name: "Şahbatur", note: "Kendini dizi oyuncusu sanıyor.", price: 72500, mood: "Karizmatik", type: "At", image: "https://images.pexels.com/photos/15153684/pexels-photo-15153684.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1200" },
  { id: "at-3", name: "Fındık", note: "Küçük değil, perspektif öyle.", price: 39900, mood: "Enerjik", type: "At", image: "https://images.pexels.com/photos/33358385/pexels-photo-33358385.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1200" },
  { id: "at-4", name: "Müdür", note: "Toplantılara geç gelir, vizyonu geniştir.", price: 86000, mood: "Karizmatik", type: "At", image: "https://images.pexels.com/photos/32910834/pexels-photo-32910834.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1200" },
  { id: "at-5", name: "Muzaffer", note: "Kamerayı görünce doğal davranamaz.", price: 54750, mood: "Enerjik", type: "At", image: "https://images.pexels.com/photos/15923755/pexels-photo-15923755.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1200" },
  { id: "at-6", name: "Nevzat", note: "Az konuşur, çok dört nala gider.", price: 61500, mood: "Sakin", type: "At", image: "https://images.pexels.com/photos/28826395/pexels-photo-28826395.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1200" },
];

const accessories: Product[] = [
  { id: "ak-1", name: "Usta İşi Deri Eyer", note: "Hakiki deri, dengeli oturuş ve uzun yol konforu.", price: 12850, type: "Aksesuar", image: "https://images.pexels.com/photos/7882504/pexels-photo-7882504.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=900" },
  { id: "ak-2", name: "Güvenli Binici Seti", note: "Kask, eldiven ve bolca özgüven içerir.", price: 3490, type: "Aksesuar", image: "https://images.pexels.com/photos/7882929/pexels-photo-7882929.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=900" },
  { id: "ak-3", name: "Klasik Üzengi", note: "Sağ ve sol birlikte. Tek satmıyoruz, ayıp olur.", price: 2150, type: "Aksesuar", image: "https://images.pexels.com/photos/37629888/pexels-photo-37629888.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=900" },
  { id: "ak-4", name: "Bakım ve Koşum Seti", note: "Atın senden daha bakımlı görünmesi için.", price: 1890, type: "Aksesuar", image: "https://images.pexels.com/photos/7882601/pexels-photo-7882601.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=900" },
];

const raceHorses = [
  { name: "Turbo Niyazi", odds: 2.1, color: "#e7ff68" },
  { name: "Rüzgarın Oğlu", odds: 3.4, color: "#ff926c" },
  { name: "Geç Kalan", odds: 5.8, color: "#a9c7ff" },
  { name: "Kesin Gelir", odds: 8.2, color: "#e8c1ff" },
];

const allProducts = [...horses, ...accessories];
const formatPrice = (price: number) => new Intl.NumberFormat("tr-TR").format(price) + " TL";
const cityEntries = Object.entries(cityNamesByCode).sort((a, b) => a[1].localeCompare(b[1], "tr"));

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#677368]">{eyebrow}</p><h2 className="font-serif text-5xl font-bold leading-[0.95] tracking-[-0.045em] md:text-7xl">{title}</h2>{text && <p className="mt-5 max-w-xl text-base leading-7 text-[#677368]">{text}</p>}</div>;
}

export default function App() {
  const [filter, setFilter] = useState("Tümü");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [toast, setToast] = useState("");
  const [cityCode, setCityCode] = useState("01");
  const [district, setDistrict] = useState("Seyhan");
  const [racePick, setRacePick] = useState("");
  const [stake, setStake] = useState(100);
  const [credits, setCredits] = useState(1000);
  const [racing, setRacing] = useState(false);
  const [winner, setWinner] = useState("");

  const visibleHorses = useMemo(() => horses.filter((horse) => (filter === "Tümü" || horse.mood === filter) && horse.name.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr"))), [filter, query]);
  const cartCount = Object.values(cart).reduce((sum, amount) => sum + amount, 0);
  const total = Object.entries(cart).reduce((sum, [id, amount]) => sum + (allProducts.find((item) => item.id === id)?.price || 0) * amount, 0);
  const districts = districtsByCityCode[cityCode as keyof typeof districtsByCityCode] || [];

  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const addToCart = (product: Product) => { setCart((current) => ({ ...current, [product.id]: (current[product.id] || 0) + 1 })); showToast(`${product.name} sepete eklendi.`); };
  const changeAmount = (id: string, change: number) => setCart((current) => { const next = Math.max(0, (current[id] || 0) + change); const updated = { ...current, [id]: next }; if (!next) delete updated[id]; return updated; });

  const runRace = () => {
    if (!racePick) return showToast("Önce bir yarışçı seç.");
    if (stake < 50 || stake > credits) return showToast("Kredi miktarını kontrol et.");
    setCredits((value) => value - stake);
    setWinner("");
    setRacing(true);
    window.setTimeout(() => {
      const selectedWinner = raceHorses[Math.floor(Math.random() * raceHorses.length)];
      setWinner(selectedWinner.name);
      setRacing(false);
      if (selectedWinner.name === racePick) {
        const odds = raceHorses.find((horse) => horse.name === racePick)!.odds;
        const prize = Math.round(stake * odds);
        setCredits((value) => value + prize);
        showToast(`Bildin! ${prize} oyun kredisi kazandın.`);
      } else showToast(`${selectedWinner.name} kazandı. Bu tur olmadı.`);
    }, 3200);
  };

  return <main className="min-h-screen bg-[#f4f1e8] text-[#18251d]">
    <nav className="fixed inset-x-0 top-0 z-40 flex h-20 items-center justify-between border-b border-white/15 bg-[#142219]/80 px-5 text-white backdrop-blur-md md:px-10">
      <a href="#top" className="font-serif text-2xl font-bold tracking-[-0.04em]">at sepeti.</a>
      <div className="hidden items-center gap-7 text-sm font-medium lg:flex">
        <a href="#atlar">Atlar</a><a href="#aksesuarlar">Aksesuarlar</a><a href="#yaris">At Yarışı</a><a href="#bayiler">Bayiler</a>
      </div>
      <div className="flex items-center gap-2">
        <a className="nav-button hidden sm:grid" href="https://www.instagram.com/atsepetiofficial/" target="_blank" rel="noreferrer" aria-label="Instagram"><Camera size={18} /></a>
        <a className="nav-button hidden sm:grid" href="https://www.youtube.com/@atsepetiofficial/shorts" target="_blank" rel="noreferrer" aria-label="YouTube"><Play size={19} /></a>
        <button className="nav-button" onClick={() => setSearchOpen((value) => !value)} aria-label="Ara"><Search size={19} /></button>
        <button className="nav-button relative" onClick={() => setCartOpen(true)} aria-label="Sepeti aç"><ShoppingBag size={19} />{cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#e7ff68] px-1 text-[10px] font-bold text-[#18251d]">{cartCount}</span>}</button>
      </div>
      <AnimatePresence>{searchOpen && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute left-4 right-4 top-[88px] mx-auto flex max-w-xl items-center gap-3 bg-white p-4 text-[#18251d] shadow-2xl"><Search size={18} className="opacity-40" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Bir at ara..." className="w-full bg-transparent outline-none" /><button onClick={() => setSearchOpen(false)}><X size={18} /></button></motion.div>}</AnimatePresence>
    </nav>

    <header id="top" className="relative min-h-[94svh] overflow-hidden text-white">
      <motion.img initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} src="https://images.pexels.com/photos/7731708/pexels-photo-7731708.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=2000&h=1400" alt="Çayırda kahverengi at" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#101b14]/95 via-[#101b14]/50 to-transparent" />
      <div className="relative mx-auto flex min-h-[94svh] max-w-7xl items-end px-5 pb-16 pt-32 md:items-center md:px-10 md:pb-0">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: .8 }} className="max-w-2xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-[#e7ff68]">Adana'dan Türkiye'ye dörtnala</p>
          <h1 className="font-serif text-[clamp(4rem,10vw,8.5rem)] font-bold leading-[0.78] tracking-[-0.07em]">at sepeti.</h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/80">At, ekipman ve tamamen oyun amaçlı yarış heyecanı. Hepsi tek yerde, hepsi biraz ciddi.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#atlar" className="inline-flex items-center gap-3 bg-[#e7ff68] px-6 py-4 text-sm font-bold text-[#18251d]">Atlara bak <ArrowRight size={18} /></a><a href="#yaris" className="border border-white/40 px-6 py-4 text-sm font-bold">Yarışa git</a></div>
        </motion.div>
      </div>
    </header>

    <section id="atlar" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
      <div className="mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end"><SectionTitle eyebrow="Ahırın yıldızları" title="Biri kesin sana göre." /><div className="flex flex-wrap gap-2">{["Tümü", "Sakin", "Enerjik", "Karizmatik"].map((item) => <button key={item} onClick={() => setFilter(item)} className={`border px-4 py-2 text-sm ${filter === item ? "border-[#18251d] bg-[#18251d] text-white" : "border-[#aeb6aa]"}`}>{item}</button>)}</div></div>
      <motion.div layout className="grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"><AnimatePresence mode="popLayout">{visibleHorses.map((horse, index) => <ProductItem key={horse.id} product={horse} index={index} onAdd={addToCart} />)}</AnimatePresence></motion.div>
    </section>

    <section id="aksesuarlar" className="bg-white px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl"><SectionTitle eyebrow="Ekipman seçkisi" title="At tamam. Tarz eksik kalmasın." text="Binici ve at için özenle seçilmiş temel ekipmanlar. Gösterişten uzak, işini iyi yapan parçalar." /><div className="mt-14 grid gap-10 md:grid-cols-2">{accessories.map((product) => <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} key={product.id} className="group grid gap-5 sm:grid-cols-[1.2fr_1fr]"><div className="aspect-[4/3] overflow-hidden bg-[#dedfd7]"><img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div><div className="flex flex-col justify-center"><span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#677368]">Aksesuar</span><h3 className="mt-2 font-serif text-3xl font-bold">{product.name}</h3><p className="mt-2 text-sm leading-6 text-[#677368]">{product.note}</p><p className="mt-5 font-bold">{formatPrice(product.price)}</p><button onClick={() => addToCart(product)} className="mt-4 flex w-fit items-center gap-2 border-b border-[#18251d] pb-1 text-xs font-bold uppercase tracking-wider">Sepete ekle <Plus size={14} /></button></div></motion.article>)}</div></div>
    </section>

    <section id="yaris" className="relative overflow-hidden bg-[#142219] px-5 py-24 text-white md:px-10 md:py-32">
      <img src="https://images.pexels.com/photos/35273022/pexels-photo-35273022.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1900&h=1200" alt="Pistte yarışan atlar" className="absolute inset-0 h-full w-full object-cover opacity-20" /><div className="absolute inset-0 bg-gradient-to-r from-[#142219] via-[#142219]/95 to-[#142219]/70" />
      <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
        <div><p className="mb-3 text-xs font-bold uppercase tracking-[.22em] text-[#e7ff68]">Demo yarış merkezi</p><h2 className="font-serif text-5xl font-bold leading-[.95] tracking-[-.045em] md:text-7xl">Nalı hızlı olan kazansın.</h2><p className="mt-5 max-w-md leading-7 text-white/65">Gerçek para yok. Ödeme yok. Sadece 1.000 ücretsiz oyun kredisi ve tamamen rastgele sonuçlanan eğlencelik bir yarış var.</p><div className="mt-8 flex items-center gap-3 text-sm"><ShieldCheck className="text-[#e7ff68]" /><span>18+ değil, çünkü bahis değil. Kredi nakde çevrilemez.</span></div></div>
        <div className="border border-white/15 bg-[#0d1711]/80 p-5 backdrop-blur-md md:p-8">
          <div className="flex items-center justify-between border-b border-white/15 pb-5"><div><p className="text-xs uppercase tracking-widest text-white/45">Adana demo koşusu</p><p className="mt-1 font-serif text-2xl font-bold">01 Numaralı Pist</p></div><div className="text-right"><p className="text-xs text-white/45">Bakiyen</p><p className="text-xl font-bold text-[#e7ff68]">{credits} kredi</p></div></div>
          <div className="mt-5 space-y-2">{raceHorses.map((horse, index) => <button disabled={racing} onClick={() => setRacePick(horse.name)} key={horse.name} className={`flex w-full items-center gap-4 border p-4 text-left transition-colors ${racePick === horse.name ? "border-[#e7ff68] bg-white/10" : "border-white/10 hover:border-white/35"}`}><span className="grid h-8 w-8 place-items-center font-bold text-[#142219]" style={{ background: horse.color }}>{index + 1}</span><span className="flex-1 font-bold">{horse.name}</span><span className="text-sm text-white/55">x{horse.odds}</span></button>)}</div>
          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]"><label className="flex items-center justify-between border border-white/15 px-4"><span className="text-xs text-white/50">Oyun kredisi</span><input disabled={racing} type="number" min="50" max={credits} step="50" value={stake} onChange={(event) => setStake(Number(event.target.value))} className="w-24 bg-transparent py-4 text-right font-bold outline-none" /></label><button disabled={racing || credits < 50} onClick={runRace} className="bg-[#e7ff68] px-7 py-4 font-bold text-[#142219] disabled:opacity-40">{racing ? "Koşuyorlar..." : "Yarışı başlat"}</button></div>
          <div className="relative mt-6 h-24 overflow-hidden border-y border-white/10"><div className="absolute bottom-3 left-0 right-0 border-b border-dashed border-white/30" />{raceHorses.map((horse, index) => <motion.div key={horse.name} animate={racing ? { x: [0, `${55 + Math.random() * 35}vw`] } : { x: winner ? "110%" : 0 }} transition={{ duration: 3, ease: "easeInOut", delay: index * .05 }} className="absolute left-2 text-lg" style={{ top: index * 20 }}>♞</motion.div>)}</div>
          {winner && <p className="mt-4 text-center text-sm"><Trophy size={17} className="mr-2 inline text-[#e7ff68]" />Son yarışın galibi: <strong>{winner}</strong></p>}
        </div>
      </div>
    </section>

    <section id="bayiler" className="px-5 py-24 md:px-10 md:py-32"><div className="mx-auto max-w-7xl"><SectionTitle eyebrow="Türkiye çapında" title="81 il, tüm ilçeler." text="Teslimat ve hizmet talebin için ilini ve ilçeni seç. Ana bayimiz Adana'da; diğer noktalar demo bayi ağıdır." /><div className="mt-14 grid overflow-hidden border border-[#c7cbc2] bg-white lg:grid-cols-2">
      <div className="p-6 md:p-10"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#677368]">Bayi bulucu</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="select-wrap"><span>İl</span><select value={cityCode} onChange={(event) => { setCityCode(event.target.value); const list = districtsByCityCode[event.target.value as keyof typeof districtsByCityCode] || []; setDistrict(list[0] || ""); }}>{cityEntries.map(([code, name]) => <option value={code} key={code}>{name}</option>)}</select><ChevronDown size={17} /></label><label className="select-wrap"><span>İlçe</span><select value={district} onChange={(event) => setDistrict(event.target.value)}>{districts.map((name) => <option key={name}>{name}</option>)}</select><ChevronDown size={17} /></label></div><div className="mt-8 border-t border-[#d9ddd4] pt-7"><p className="text-xs text-[#677368]">Seçilen hizmet bölgesi</p><p className="mt-1 font-serif text-3xl font-bold">{district}, {cityNamesByCode[cityCode as keyof typeof cityNamesByCode]}</p><p className="mt-3 text-sm leading-6 text-[#677368]">Bu bölgede çevrim içi talep alınmaktadır. Fiziksel ziyaret için Adana Ana Bayi ile iletişime geçin.</p><button onClick={() => showToast(`${district} için talebin alındı. (Demo)`)} className="mt-6 bg-[#18251d] px-5 py-3 text-sm font-bold text-white">Hizmet talebi oluştur</button></div></div>
      <div className="bg-[#e7ff68] p-6 md:p-10"><span className="inline-block bg-[#18251d] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white">Ana bayi</span><h3 className="mt-6 font-serif text-4xl font-bold">Adana Merkez</h3><div className="mt-8 space-y-6 text-sm"><p className="flex gap-3"><MapPin className="shrink-0" size={20} /><span>Seyhan, Adana<br /><span className="text-[#4c584f]">Ziyaretler yalnızca randevuyla. Adres temsilidir.</span></span></p><p className="flex gap-3"><Clock3 className="shrink-0" size={20} /><span>Pazartesi - Cumartesi<br /><strong>09.00 - 18.00</strong></span></p><p className="flex gap-3"><ShieldCheck className="shrink-0" size={20} /><span>Ürün danışmanlığı, ekipman teslimi ve bolca at muhabbeti.</span></p></div></div>
    </div></div></section>

    <section className="bg-white px-5 py-20 md:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#677368]">Bizi takip et</p><h2 className="mt-3 font-serif text-5xl font-bold">Ahırdan kısa kısa.</h2></div><div className="flex flex-col gap-3 sm:flex-row"><a href="https://www.instagram.com/atsepetiofficial/" target="_blank" rel="noreferrer" className="social-link"><Camera />Instagram <ArrowRight size={17} /></a><a href="https://www.youtube.com/@atsepetiofficial/shorts" target="_blank" rel="noreferrer" className="social-link"><Play />YouTube Shorts <ArrowRight size={17} /></a></div></div></section>

    <footer className="bg-[#18251d] px-5 py-12 text-white md:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="font-serif text-4xl font-bold">atsepeti.app</p><p className="mt-2 text-sm text-white/50">Adana merkezli, şaka ciddiyetinde.</p></div><div className="text-xs leading-6 text-white/45 md:text-right"><p>Yarış alanı gerçek bahis içermez.</p><p>2026 At Sepeti. Tamamen hayali, özenle hazırlanmış.</p></div></div></footer>

    <AnimatePresence>{cartOpen && <><motion.button aria-label="Sepeti kapat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm" /><motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 250 }} className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col bg-[#f4f1e8] p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-[#18251d]/20 pb-5"><div><p className="text-[10px] uppercase tracking-widest text-[#677368]">{cartCount} ürün</p><h2 className="font-serif text-3xl font-bold">Sepetin</h2></div><button onClick={() => setCartOpen(false)}><X /></button></div><div className="flex-1 overflow-y-auto py-3">{cartCount === 0 ? <div className="grid h-full place-items-center text-center"><div><ShoppingBag className="mx-auto mb-4 opacity-30" size={38} /><p className="font-serif text-2xl font-bold">Sepet ıssız.</p></div></div> : Object.entries(cart).map(([id, amount]) => { const product = allProducts.find((item) => item.id === id)!; return <div key={id} className="flex gap-4 border-b border-[#18251d]/15 py-5"><img src={product.image} alt={product.name} className="h-24 w-20 object-cover" /><div className="flex flex-1 flex-col justify-between"><div className="flex justify-between gap-4"><div><span className="text-[9px] uppercase tracking-widest text-[#677368]">{product.type}</span><h3 className="font-serif text-xl font-bold">{product.name}</h3></div><span className="whitespace-nowrap text-xs font-bold">{formatPrice(product.price * amount)}</span></div><div className="flex items-center gap-3"><button onClick={() => changeAmount(id, -1)} className="quantity-button"><Minus size={14} /></button><span className="text-sm font-bold">{amount}</span><button onClick={() => changeAmount(id, 1)} className="quantity-button"><Plus size={14} /></button></div></div></div> })}</div>{cartCount > 0 && <div className="border-t border-[#18251d]/20 pt-5"><div className="mb-5 flex justify-between font-bold"><span>Toplam</span><span>{formatPrice(total)}</span></div><button onClick={() => showToast("Demo siparişin hazır. Gerçek ödeme alınmadı.")} className="flex w-full items-center justify-center gap-2 bg-[#18251d] py-4 text-sm font-bold text-white">Siparişi tamamla <ArrowRight size={17} /></button></div>}</motion.aside></>}</AnimatePresence>
    <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 10, x: "-50%" }} className="fixed bottom-6 left-1/2 z-[60] flex min-w-max items-center gap-2 bg-[#e7ff68] px-5 py-3 text-sm font-bold shadow-xl"><Check size={17} />{toast}</motion.div>}</AnimatePresence>
  </main>;
}

function ProductItem({ product, index, onAdd }: { product: Product; index: number; onAdd: (product: Product) => void }) {
  return <motion.article layout initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (index % 3) * .08 }} exit={{ opacity: 0, scale: .96 }} className="group"><div className="relative aspect-[4/5] overflow-hidden bg-[#d9d9cc]"><img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /><span className="absolute left-4 top-4 bg-[#f4f1e8] px-3 py-2 text-[10px] font-bold uppercase tracking-wider">{product.mood}</span><button onClick={() => onAdd(product)} className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center bg-[#e7ff68] text-[#18251d] transition-transform hover:scale-105" aria-label={`${product.name} sepete ekle`}><Plus size={20} /></button></div><div className="mt-5 flex items-start justify-between gap-4"><div><h3 className="font-serif text-3xl font-bold">{product.name}</h3><p className="mt-1 text-sm text-[#617064]">{product.note}</p></div><p className="whitespace-nowrap pt-2 text-sm font-bold">{formatPrice(product.price)}</p></div></motion.article>;
}