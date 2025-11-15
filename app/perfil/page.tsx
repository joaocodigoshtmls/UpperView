import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";
import ChangePasswordForm from "./change-password-form";

export default async function PerfilPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Perfil</h1>
        <p className="text-slate-600">Gerencie suas informações pessoais e senha</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Informações Pessoais</h2>
        <ProfileForm user={session.user} />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Alterar Senha</h2>
        <ChangePasswordForm userId={session.user.id as string} />
      </div>
    </div>
  );
}
