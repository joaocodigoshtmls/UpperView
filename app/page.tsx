export default function Page() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-medium">Setup pronto ✅</h2>
      <p>
        Projeto criado com Next.js (App Router), Tailwind e Prisma. O schema do Prisma está em <code>prisma/schema.prisma</code>.
        Este pacote cobre as etapas 1 a 3: setup, schema de dados e blueprint documentado.
      </p>
      <div className="rounded-xl border p-4">
        <h3 className="font-semibold mb-2">Próximos passos (resumo)</h3>
        <ol className="list-decimal ml-5 space-y-1">
          <li>Configurar variáveis de ambiente em <code>.env</code>.</li>
          <li>Executar migrações: <code>npm run prisma:migrate</code>.</li>
          <li>(Opcional) Rodar seed: <code>npm run db:seed</code>.</li>
          <li>Subir o dev server: <code>npm run dev</code>.</li>
        </ol>
      </div>
    </section>
  );
}
