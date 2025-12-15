# UpperView (MVP)

Stack: **Next.js (App Router) + Tailwind + Prisma + PostgreSQL (Neon)**

## 1) Setup rapido
1. Crie o banco no **Neon** e copie a connection string (use `sslmode=require`).
2. Preencha `.env` a partir de `.env.example`.
3. Instale deps e gere o client Prisma:

```bash
npm i
npm run prisma:generate
npm run prisma:migrate
npm run db:seed   # usa ts-node --esm
npm run dev
```

## 2) Funcionalidades
- Dashboard: receitas, despesas, contas e grafico de despesas por categoria.
- Transacoes: filtros por tipo, conta, categoria, busca, intervalo de datas e criacao rapida via dialogo.
- Configuracoes: contas financeiras, instituicoes e categorias editaveis com validacao.

## 3) Notas de implementacao
- Helpers em `lib/format.ts` e `lib/date.ts` tratam valores numericos e datas invalidas.
- `getUserId` usa cache leve e requer usuario demo (`DEMO_USER_EMAIL`, padrao `demo@local`). Rode `npm run db:seed` se faltar o usuario.
- Blueprint do produto: acesse `/docs/blueprint` na aplicacao para a visão geral de rotas e escopo.
