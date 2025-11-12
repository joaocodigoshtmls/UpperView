export default function Blueprint() {
  return (
    <article className="prose prose-zinc max-w-none">
      <h1>Blueprint do MVP</h1>
      <p>
        Este documento descreve as telas e módulos planejados para a primeira versão do Financia.
      </p>
      <h2>Rotas</h2>
      <ul>
        <li><code>/dashboard</code> — visão geral (saldo por conta, gastos do mês, receita vs despesa, metas e carteira).</li>
        <li><code>/transactions</code> — tabela com filtros (conta, categoria, período), import CSV (futuro) e quick add.</li>
        <li><code>/budgets</code> — orçamento mensal por categoria (limite, gasto real).</li>
        <li><code>/goals</code> — metas (aporte manual e progresso).</li>
        <li><code>/investments</code> — posições, trades e carteira agregada.</li>
        <li><code>/markets</code> — watchlists (B3/BDRs/FIIs/ETFs/Cripto).</li>
        <li><code>/alerts</code> — regras por ativo (preço/variação) para notificação.</li>
        <li><code>/settings</code> — perfil, carteiras, contas financeiras, categorias.</li>
      </ul>
      <h2>Padrões de UX/Estado</h2>
      <ul>
        <li>Zustand para filtros e preferências locais.</li>
        <li>Server Actions para CRUD, sempre escopando por <code>userId</code>.</li>
        <li>Componentes base com Tailwind; tabelas e gráficos com Recharts.</li>
      </ul>
      <p>
        A implementação dessas rotas virá nas próximas etapas.
      </p>
    </article>
  );
}
