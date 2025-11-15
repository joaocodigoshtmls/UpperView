# UpperView

**Controle financeiro pessoal com visão de caixa, metas e carteira de investimentos**

Stack: **Next.js 15 (App Router) + Tailwind CSS + Prisma 5 + PostgreSQL (Neon) + NextAuth.js 5**

## ✨ Features

- ✅ **Autenticação Completa**: Login, registro, recuperação de senha e perfil
- ✅ **Dashboard Financeiro**: Visão geral de receitas e despesas
- ✅ **Gestão de Transações**: Adicionar, editar e visualizar transações
- ✅ **Contas Financeiras**: Múltiplas contas e categorias personalizadas
- ✅ **Proteção de Rotas**: Middleware para rotas autenticadas
- ✅ **Design Responsivo**: Interface moderna com Tailwind CSS

## 🚀 Setup Rápido

### 1. Clone e Instale Dependências

```bash
git clone https://github.com/joaocodigoshtmls/UpperView.git
cd UpperView
npm install
```

### 2. Configure o Ambiente

Crie o arquivo `.env` baseado em `.env.example`:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/neondb?sslmode=require"

# NextAuth
AUTH_SECRET="your-secret-key"  # Generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Configure o Banco de Dados

```bash
# Gerar Prisma Client
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# (Opcional) Seed inicial
npm run db:seed
```

### 4. Execute o Projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📖 Documentação

### Autenticação

Para detalhes completos sobre o sistema de autenticação, consulte [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md).

**Rotas disponíveis:**
- `/cadastro` - Criar nova conta
- `/login` - Entrar na aplicação
- `/esqueci-senha` - Recuperar senha
- `/perfil` - Gerenciar perfil e senha

### Estrutura do Projeto

```
UpperView/
├── app/
│   ├── api/auth/         # NextAuth API routes
│   ├── auth/             # Server actions de autenticação
│   ├── login/            # Página de login
│   ├── cadastro/         # Página de registro
│   ├── esqueci-senha/    # Recuperação de senha
│   ├── perfil/           # Perfil do usuário
│   ├── dashboard/        # Dashboard principal
│   ├── transactions/     # Gestão de transações
│   └── settings/         # Configurações
├── lib/                  # Utilitários e helpers
├── prisma/               # Schema e migrations
├── auth.ts               # Configuração NextAuth
└── middleware.ts         # Proteção de rotas
```

## 🛠️ Prisma

O schema Prisma está em `prisma/schema.prisma` e inclui:

- **User**: Usuários com autenticação
- **Account/Session**: Dados de sessão NextAuth
- **PasswordResetToken**: Tokens de recuperação de senha
- **Wallet**: Carteiras financeiras
- **Transaction**: Transações financeiras
- **Category**: Categorias personalizadas
- **Budget**: Orçamentos mensais
- E mais...

## 🔒 Segurança

- Senhas criptografadas com bcryptjs
- Sessões JWT seguras
- Proteção CSRF
- Validação de entrada com Zod
- Middleware de proteção de rotas

## 🧪 Desenvolvimento

```bash
# Lint
npm run lint

# Build
npm run build

# Start production
npm start

# Prisma Studio
npm run prisma:studio
```

## 📝 Blueprint do MVP

Veja `/docs/blueprint` no app para as rotas e telas planejadas.

## 🚧 Roadmap

- [ ] Email verification
- [ ] OAuth providers (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Metas financeiras
- [ ] Carteira de investimentos
- [ ] Relatórios e análises
- [ ] Export de dados

## 📄 Licença

Este projeto é privado.

---

**UpperView** - Controle financeiro pessoal © 2024
