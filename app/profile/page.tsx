import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "./profile-form";
import PasswordForm from "./password-form";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      preferredCurrency: true,
      preferredLanguage: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Perfil</h1>
        <p className="text-slate-600">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Informações Pessoais
          </h2>
          <ProfileForm user={user} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Segurança
          </h2>
          <PasswordForm />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Informações da Conta
        </h2>
        <div className="space-y-2 text-sm text-slate-600">
          <p>
            <span className="font-medium">ID:</span> {user.id}
          </p>
          <p>
            <span className="font-medium">Membro desde:</span>{" "}
            {new Date(user.createdAt).toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
