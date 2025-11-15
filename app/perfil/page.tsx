import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";
import { SecurityForm } from "./security-form";
import { PreferencesForm } from "./preferences-form";

export default async function PerfilPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Meu Perfil</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Gerencie suas informações pessoais, segurança e preferências
        </p>
      </div>

      <ProfileForm user={session.user} />
      <SecurityForm userId={session.user.id} />
      <PreferencesForm user={session.user} />
    </div>
  );
}
