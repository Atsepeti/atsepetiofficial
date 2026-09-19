import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kayıt Ol — At Sepeti",
};

export default async function KayitPage() {
  const user = await getSessionUser();
  if (user) redirect("/");

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <AuthForm mode="register" />
    </div>
  );
}
