import Link from "next/link";

const highlights = [
  {
    title: "Visao clara de caixa",
    body: "Receitas, despesas e saldo consolidado com atualização imediata.",
  },
  {
    title: "Transacoes sem atrito",
    body: "Filtros rapidos, categorias e atalhos para registrar o que importa.",
  },
  {
    title: "Configuracoes simples",
    body: "Contas, instituicoes e categorias em um painel leve de editar.",
  },
];

const steps = [
  {
    title: "Conecte suas contas",
    description: "Cadastre contas e instituicoes para começar com saldos reais.",
  },
  {
    title: "Registre transacoes",
    description: "Lance receitas, despesas ou transferencias com categorias.",
  },
  {
    title: "Acompanhe o mes",
    description: "Visualize o resultado, distribua gastos e ajuste sua rota.",
  },
];

export default function Page() {
  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-card">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              🚀 Pronto para usar agora
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
                Controle financeiro direto ao ponto
              </h1>
              <p className="text-lg text-slate-600">
                UpperView organiza caixa, metas e carteira com um dashboard enxuto, filtros inteligentes e configuracoes simples para o dia a dia.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard"
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                Ver dashboard
              </Link>
              <Link
                href="/transactions"
                className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-200 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                Registrar transacoes
              </Link>
              <Link
                href="/docs/blueprint"
                className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-blue-700 hover:underline"
              >
                Ver blueprint do produto
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <p className="text-xs uppercase tracking-wide text-slate-500">Saldo monitorado</p>
                <p className="text-lg font-semibold text-slate-900">Conta + Investimentos</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <p className="text-xs uppercase tracking-wide text-slate-500">Alertas visuais</p>
                <p className="text-lg font-semibold text-slate-900">Receita vs. Despesa</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <p className="text-xs uppercase tracking-wide text-slate-500">Acesso rapido</p>
                <p className="text-lg font-semibold text-slate-900">Transacao em 2 cliques</p>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-md self-start rounded-2xl border border-slate-200 bg-slate-900 px-6 py-6 text-white shadow-2xl">
            <div className="absolute inset-x-6 top-6 h-12 rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-400/10 to-emerald-400/20 blur-2xl" aria-hidden />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Visao do mes</span>
                <span>Atualizado agora</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-inner">
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <span>Receitas</span>
                  <span className="font-semibold text-emerald-300">R$ 7.500</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-200">
                  <span>Despesas</span>
                  <span className="font-semibold text-rose-300">R$ 1.915</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                  <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-blue-400 to-emerald-300" aria-hidden />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Top categoria</p>
                  <p className="text-sm font-semibold text-white">Alimentacao</p>
                  <p className="text-sm text-rose-200">- R$ 455</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Saldo liquido</p>
                  <p className="text-sm font-semibold text-white">R$ 5.585</p>
                  <p className="text-sm text-emerald-200">+12% vs. mes passado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Por que UpperView</p>
            <h2 className="text-2xl font-bold text-slate-900">Tudo o que voce precisa em um fluxo continuo</h2>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            Ir para o dashboard
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Em 3 passos</p>
            <h2 className="text-2xl font-bold text-slate-900">Comece do zero em minutos</h2>
            <p className="text-slate-600">Fluxo desenhado para ser repetivel: cadastre, registre e acompanhe sem depender de planilhas paralelas.</p>
          </div>
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={step.title} className="relative rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="absolute -left-5 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-sm">
                  {idx + 1}
                </div>
                <h3 className="pl-6 text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="pl-6 text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50 px-8 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-800">Convite</p>
            <h2 className="text-2xl font-bold text-slate-900">Pronto para testar o fluxo completo?</h2>
            <p className="text-slate-700">Acesse o dashboard, cadastre sua primeira conta e registre uma transacao demo.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
            >
              Abrir dashboard
            </Link>
            <Link
              href="/transactions"
              className="rounded-lg border border-blue-200 px-6 py-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
            >
              Registrar transacao demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
