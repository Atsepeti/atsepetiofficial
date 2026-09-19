import Link from "next/link";
import { desc, eq, count } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, raceResults, users, videos } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import AdminVideoList from "@/components/AdminVideoList";
import { formatDate, formatPrice } from "@/lib/horses";
import {
  ShieldCheck,
  Users,
  ShoppingBasket,
  Clapperboard,
  Coins,
  LockKeyhole,
  Flag,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Yönetim Paneli — At Sepeti",
};

export default async function AdminPage() {
  const user = await getSessionUser();

  if (!user?.isAdmin) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="sticker mx-auto max-w-md rounded-3xl bg-white/85 p-10 text-center">
          <span className="mx-auto inline-grid h-16 w-16 place-items-center rounded-2xl border-2 border-ink bg-brick text-cream">
            <LockKeyhole className="h-8 w-8" />
          </span>
          <h1 className="mt-5 font-display text-4xl">Ahırın Gizli Bölmesi</h1>
          <p className="mt-3 text-coffee/85">
            Buraya sadece yönetim girer. Nal izleri şifreyi bilenlere aittir.
          </p>
          <Link
            href="/giris?next=/admin"
            className="sticker mt-6 inline-block rounded-2xl bg-brick px-6 py-3 font-display text-lg text-cream"
          >
            Yönetici Girişi
          </Link>
        </div>
      </div>
    );
  }

  const allUsers = await db.select().from(users).orderBy(desc(users.id)).limit(500);
  const allVideos = await db.select().from(videos).orderBy(desc(videos.id)).limit(100);
  const allOrders = await db.select().from(orders).orderBy(desc(orders.id)).limit(50);
  const races = await db.select({ v: count() }).from(raceResults);

  const ordersWithItems = await Promise.all(
    allOrders.map(async (o) => {
      const its = await db
        .select({ name: orderItems.name })
        .from(orderItems)
        .where(eq(orderItems.orderId, o.id));
      const u = allUsers.find((x) => x.id === o.userId);
      return { ...o, items: its.map((i) => i.name), userEmail: u?.email ?? "?" };
    })
  );

  const revenue = allOrders.reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: "Kayıtlı at dostu", value: String(allUsers.length), icon: <Users className="h-5 w-5" /> },
    { label: "Verilen sipariş", value: String(allOrders.length), icon: <ShoppingBasket className="h-5 w-5" /> },
    { label: "Sanal ciro", value: formatPrice(revenue), icon: <Coins className="h-5 w-5" /> },
    { label: "Yarış oynandı", value: String(races[0]?.v ?? 0), icon: <Flag className="h-5 w-5" /> },
    { label: "Video", value: String(allVideos.length), icon: <Clapperboard className="h-5 w-5" /> },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-brick px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-cream">
            <ShieldCheck className="h-4 w-4" />
            Yönetim Paneli
          </span>
          <h1 className="mt-4 font-display text-5xl">Ahır Kumanda Merkezi</h1>
          <p className="mt-2 text-coffee/85">
            Hoş geldin patron. Tüm haklar H.A.T&apos;a ait, tüm sorumluluk sana.
          </p>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="sticker rounded-2xl bg-white/85 p-4">
            <span className="inline-grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-hay">
              {s.icon}
            </span>
            <p className="mt-3 font-display text-2xl leading-none">{s.value}</p>
            <p className="mt-1 text-[11px] font-extrabold uppercase tracking-wider text-mocha">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Kullanıcılar */}
      <section className="mt-12">
        <h2 className="font-display text-3xl">Kayıt Olan Herkes</h2>
        <p className="mt-1 text-sm text-mocha">
          Ahıra katılan her at dostu burada listelenir. Saygıyla izle; onlar
          ailenin bir parçası.
        </p>
        <div className="sticker mt-4 overflow-hidden rounded-3xl bg-white/85">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b-2 border-ink bg-ink text-cream">
                  <th className="px-4 py-3 font-display text-sm tracking-wide">#</th>
                  <th className="px-4 py-3 font-display text-sm tracking-wide">Ad Soyad</th>
                  <th className="px-4 py-3 font-display text-sm tracking-wide">E-posta</th>
                  <th className="px-4 py-3 font-display text-sm tracking-wide">AtCoin</th>
                  <th className="px-4 py-3 font-display text-sm tracking-wide">Rol</th>
                  <th className="px-4 py-3 font-display text-sm tracking-wide">Katılım</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u, i) => (
                  <tr
                    key={u.id}
                    className={`border-b border-sand ${i % 2 === 0 ? "bg-white/60" : "bg-parchment/60"}`}
                  >
                    <td className="px-4 py-3 font-bold text-mocha">{u.id}</td>
                    <td className="px-4 py-3 font-extrabold">{u.name}</td>
                    <td className="px-4 py-3 font-semibold text-coffee">{u.email}</td>
                    <td className="px-4 py-3 font-extrabold text-haydark">
                      {u.balance.toLocaleString("tr-TR")} AC
                    </td>
                    <td className="px-4 py-3">
                      {u.isAdmin ? (
                        <span className="rounded-full border-2 border-ink bg-brick px-2.5 py-0.5 text-[11px] font-extrabold text-cream">
                          YÖNETİCİ
                        </span>
                      ) : (
                        <span className="rounded-full border border-mocha/30 bg-cream px-2.5 py-0.5 text-[11px] font-bold text-mocha">
                          at dostu
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-mocha">
                      {formatDate(u.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {allUsers.length === 0 && (
            <p className="p-8 text-center text-sm text-mocha">
              Henüz kimse kayıt olmamış. Ahır bomboş, nereye gidiyor bu dünya?
            </p>
          )}
        </div>
      </section>

      {/* Siparişler + Videolar */}
      <div className="mt-12 grid items-start gap-10 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-3xl">Siparişler</h2>
          <p className="mt-1 text-sm text-mocha">
            Yola çıkan her atın kaydı. Kapı çalınmaları istatistiğe dahil değil.
          </p>
          <div className="mt-4 space-y-3">
            {ordersWithItems.length === 0 && (
              <p className="rounded-2xl border-2 border-dashed border-mocha/40 p-6 text-center text-sm text-mocha">
                Henüz sipariş yok. Atlar hâlâ ahırda bekliyor.
              </p>
            )}
            {ordersWithItems.map((o) => (
              <div key={o.id} className="rounded-2xl border-2 border-ink bg-white/75 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-lg">#AS-{o.id}</span>
                  <span className="rounded-full border-2 border-ink bg-grass px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-cream">
                    {o.status}
                  </span>
                </div>
                <p className="mt-1 text-xs font-bold text-mocha">
                  {o.userEmail} — {formatDate(o.createdAt)}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-coffee">
                  {o.items.join(", ")}
                </p>
                <p className="mt-1 font-display text-lg text-brick">
                  {formatPrice(o.total)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl">Video Arşivi</h2>
          <p className="mt-1 text-sm text-mocha">
            Yüklenen ve arşivdeki tüm videolar. Çöp kutusu atın erişemeyeceği
            bir yerdedir.
          </p>
          <div className="mt-4">
            <AdminVideoList
              videos={allVideos.map((v) => ({
                id: v.id,
                title: v.title,
                uploaderName: v.uploaderName,
                source: v.source,
                createdAt: v.createdAt.toISOString(),
              }))}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
