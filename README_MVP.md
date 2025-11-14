# UpperView MVP

Controle financeiro pessoal com visão de caixa, metas e carteira de investimentos.

## 🚀 Stack Tecnológica

- **Next.js 15** (App Router, TypeScript strict)
- **Tailwind CSS** (estilização)
- **Prisma 5** (ORM)
- **PostgreSQL** (Neon - serverless com SSL)
- **Zustand** (gerenciamento de estado - quando necessário)
- **Recharts** (gráficos)
- **Zod** (validação)

## 📋 Funcionalidades

### ✅ Dashboard (`/dashboard`)
- 3 cards principais: Receitas, Despesas e Resultado do mês
- Lista de contas com saldos
- Gráfico de despesas por categoria (top 6)
- Atualização em tempo real com revalidação

### ✅ Transações (`/transactions`)
- Listagem de transações em tabela
- Filtros por tipo (receita/despesa) e texto
- Criação rápida via dialog modal
- Valores negativos para despesas, positivos para receitas
- Revalidação automática do dashboard após criação

### ✅ Configurações (`/settings`)
- **Contas Financeiras**: CRUD completo
  - Nome, tipo, moeda, saldo, instituição
  - Tipos: Corrente, Poupança, Cartão, Dinheiro, App de Pagamento, Investimentos
- **Categorias**: CRUD completo
  - Nome e ícone (emoji)
  - Categorias padrão e personalizadas

## 🛠️ Setup do Projeto

### 1. Pré-requisitos
- Node.js 18+
- PostgreSQL (recomendado: Neon serverless)
- npm ou yarn

### 2. Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd UpperView

# Instale as dependências
npm install
```

### 3. Configuração do Banco de Dados

#### Opção A: Neon (Recomendado)
1. Crie uma conta em [Neon](https://neon.tech)
2. Crie um novo projeto PostgreSQL
3. Copie a connection string (já vem com SSL)

#### Opção B: PostgreSQL Local
Use uma connection string local:
```
postgresql://usuario:senha@localhost:5432/upperview?sslmode=disable
```

### 4. Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
# Neon PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/neondb?sslmode=require"

# Usuário demo (para MVP)
DEMO_USER_EMAIL="demo@local"

# NextAuth (para futura autenticação)
AUTH_SECRET="upperview_secret_key_change_in_production"
NEXTAUTH_URL="http://localhost:3000"
```

### 5. Executar Migrações e Seed

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar/aplicar migrações
npm run prisma:migrate

# Popular banco com dados iniciais
npm run db:seed
```

O seed cria:
- ✅ Usuário demo (`demo@local`)
- ✅ 4 instituições (Mercado Pago, Sicredi, BTG Pactual, C6 Bank)
- ✅ 10 categorias padrão com ícones
- ✅ 3 contas financeiras com saldos
- ✅ ~10 transações do mês atual

### 6. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📂 Estrutura de Arquivos

```
UpperView/
├── app/
│   ├── layout.tsx              # Layout global com navegação
│   ├── page.tsx                # Página inicial
│   ├── dashboard/
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── expense-chart.tsx  # Componente de gráfico
│   │   └── expense-chart-wrapper.tsx
│   ├── transactions/
│   │   ├── page.tsx           # Lista de transações
│   │   ├── transaction-dialog.tsx
│   │   └── actions.ts         # Server Actions
│   └── settings/
│       ├── page.tsx           # Configurações
│       ├── account-form.tsx   # Formulário de contas
│       ├── category-form.tsx  # Formulário de categorias
│       └── actions.ts         # Server Actions
├── lib/
│   ├── prisma.ts              # Singleton Prisma Client
│   ├── format.ts              # Formatação de moeda
│   ├── date.ts                # Helpers de data
│   └── user.ts                # Helper getUserId()
├── prisma/
│   ├── schema.prisma          # Schema do banco
│   └── seed.ts                # Dados iniciais
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 🎨 Design

- **Tema**: Blue Tech (#2563EB)
- **Paleta**: Grafite + Azul 600
- **Responsivo**: Mobile-first
- **Acessibilidade**: aria-labels em elementos interativos

## 📝 Scripts Disponíveis

```bash
npm run dev              # Servidor de desenvolvimento
npm run build            # Build de produção
npm run start            # Inicia build de produção
npm run lint             # Lint do código
npm run prisma:generate  # Gera Prisma Client
npm run prisma:migrate   # Aplica migrações
npm run prisma:studio    # Abre Prisma Studio
npm run db:seed          # Popula banco de dados
```

## ✅ Checklist de Aceitação

- [x] `npx prisma validate` sem erros
- [x] `npm run prisma:generate` conclui
- [x] Migração roda em Neon (SSL)
- [x] `/dashboard` exibe cards, contas e gráfico
- [x] `/transactions` lista e permite criar transação
- [x] `/settings` permite CRUD de Contas e Categorias
- [x] Layout responsivo, fontes legíveis, contraste OK
- [x] Sem libs extras além das listadas
- [x] TypeScript strict, sem erros de build

## 🔐 Segurança

- Validação com Zod em todos os Server Actions
- Verificação de propriedade do usuário em operações CRUD
- Decimal.js para valores monetários (precisão)
- Prepared statements via Prisma (prevenção SQL injection)

## 🚧 Limitações Conhecidas

1. **Autenticação**: Usa `DEMO_USER_EMAIL` fixo (MVP)
   - Próximo passo: Implementar NextAuth completo
   
2. **Seed Idempotente**: Verifica existência antes de inserir
   - Safe para rodar múltiplas vezes

3. **Timezone**: Usa timezone do sistema
   - Considerar UTC + conversão por usuário

4. **Validações**: Básicas com Zod
   - Expandir regras de negócio

## 🔜 Próximos Passos Sugeridos

1. **Autenticação completa** (NextAuth)
2. **Metas financeiras** (modelo Goal já existe)
3. **Orçamentos mensais** (modelo Budget já existe)
4. **Investimentos** (Position, Trade, Security já existem)
5. **Relatórios e exportação** (PDF, CSV)
6. **Alertas e notificações**
7. **Multi-moeda** (já preparado)
8. **Backup e restore**
9. **Temas escuro/claro**
10. **PWA** (Progressive Web App)

## 📄 Licença

MIT

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 🐛 Reportar Bugs

Abra uma issue descrevendo:
- Comportamento esperado
- Comportamento atual
- Passos para reproduzir
- Screenshots (se aplicável)

---

**UpperView** - Eleve sua visão financeira! 📈
