# UpperView (MVP — Etapas 1 a 3)

Stack: **Next.js (App Router) + Tailwind + Prisma + PostgreSQL (Neon)**

## 1) Setup
- Crie o banco no **Neon**, copie a connection string (com `sslmode=require`).
- Preencha `.env` a partir de `.env.example`.

```bash
npm i
npm run prisma:generate
npm run prisma:migrate
# (opcional)
npm run db:seed
npm run dev
```

## 2) Prisma
O schema está em `prisma/schema.prisma`. Usa `Decimal` para valores monetários.

## 3) Blueprint do MVP
Veja `/docs/blueprint` no app para as rotas/telas planejadas.

> Próximas etapas (fora deste pacote): implementar `/dashboard`, `/transactions`, autenticação e UI base com shadcn.
