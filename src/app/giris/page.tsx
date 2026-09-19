import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Giriş Yap — At Sepeti",
};

export default async function GirisPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const user = await getSessionUser();
  if (user) redirect(next && next.startsWith("/") ? next : user.isAdmin ? "/admin" : "/");

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <AuthForm mode="login" next={next} />
    </div>
  );
}
