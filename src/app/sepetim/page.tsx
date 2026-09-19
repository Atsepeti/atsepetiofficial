import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { cartItems, horses, orderItems, orders } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import CartView, { type CartItem, type PastOrder } from "@/components/CartView";
import { ShoppingBasket, LockKeyhole } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sepetim — At Sepeti",
};

export default async function SepetimPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="sticker mx-auto max-w-md rounded-3xl bg-white/85 p-10 text-center">
          <span className="mx-auto inline-grid h-16 w-16 place-items-center rounded-2xl border-2 border-ink bg-hay">
            <LockKeyhole className="h-8 w-8" />
          </span>
          <h1 className="mt-5 font-display text-4xl">Sepet Kilitli</h1>
          <p className="mt-3 text-coffee/85">
            Sepetini görmek için giriş yapmalısın. Atlar kimin sepetine
            gireceklerini bilmek ister — güven meselesi.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/giris?next=/sepetim"
              className="sticker rounded-2xl bg-brick px-6 py-3 font-display text-lg text-cream transition-transform hover:-translate-y-0.5"
            >
              Giriş Yap
            </Link>
            <Link
              href="/kayit"
              className="rounded-2xl border-2 border-ink bg-cream px-6 py-3 font-display text-lg transition-colors hover:bg-parchment"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let items: CartItem[] = [];
  let pastOrders: PastOrder[] = [];
  try {
    const rows = await db
      .select({
        cartId: cartItems.id,
        name: horses.name,
        price: horses.price,
        image: horses.image,
        tagline: horses.tagline,
      })
      .from(cartItems)
      .innerJoin(horses, eq(horses.id, cartItems.horseId))
      .where(eq(cartItems.userId, user.id))
      .orderBy(desc(cartItems.id));
    items = rows;

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, user.id))
      .orderBy(desc(orders.id))
      .limit(5);
    for (const o of userOrders) {
      const its = await db
        .select({ name: orderItems.name })
        .from(orderItems)
        .where(eq(orderItems.orderId, o.id));
      pastOrders.push({
        id: o.id,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
        items: its.map((i) => i.name),
      });
    }
  } catch {
    // tablolar henüz hazır değilse sessiz kal
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-hay px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em]">
            <ShoppingBasket className="h-4 w-4" />
            Sepetim
          </span>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl">
            Atların Bekleme Salonu
          </h1>
          <p className="mt-2 max-w-lg text-coffee/85">
            Buradaki atlar sabırsız. Siparişi ver, 30 dakikada burun buruna gelin.
          </p>
        </div>
        <span className="rounded-full border-2 border-ink bg-parchment px-4 py-2 text-sm font-extrabold">
          Ahır defteri: {user.name}
        </span>
      </div>

      <div className="mt-10">
        <CartView items={items} pastOrders={pastOrders} />
      </div>
    </div>
  );
}
