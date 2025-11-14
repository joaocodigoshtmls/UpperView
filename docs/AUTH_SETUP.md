# Autenticação e Segurança - UpperView

Este documento descreve a implementação de autenticação e segurança do UpperView.

## Stack de Autenticação

- **Auth.js (NextAuth v5 beta.30)**: Sistema de autenticação principal
- **Prisma Adapter**: Integração com banco de dados PostgreSQL
- **bcryptjs**: Hash de senhas com fator de custo 10
- **Zod**: Validação de schemas
- **Middleware**: Proteção de rotas

## Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-super-seguro-aqui"
```

Para gerar um secret seguro:
```bash
openssl rand -base64 32
```

### 2. Migrations do Banco de Dados

Execute as migrations para criar as tabelas necessárias:

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 3. Seed do Banco (Opcional)

Para criar um usuário demo e dados de teste:

```bash
npm run db:seed
```

**Credenciais do usuário demo:**
- Email: `demo@local`
- Senha: `Demo123!`

## Funcionalidades Implementadas

### Cadastro de Usuário (`/auth/register`)

- Validação forte de senha (8+ caracteres, maiúscula, minúscula, número)
- Verificação de email duplicado
- Hash seguro de senha com bcrypt
- Auto-login após cadastro bem-sucedido

### Login (`/auth/login`)

- Autenticação via email e senha
- Rate limiting simples (5 tentativas em 5 minutos)
- Mensagens de erro genéricas (não revela se email existe)
- Redirecionamento para `/dashboard` após login

### Logout

- Encerramento de sessão via Auth.js
- Redirecionamento para página de login

### Recuperação de Senha

#### Solicitar Reset (`/auth/forgot-password`)

- Gera token único com validade de 1 hora
- Mensagem neutra (não revela se email existe)
- Token armazenado na tabela `PasswordReset`

**Nota:** O envio de email está mockado. Em produção, integre com:
- SendGrid
- AWS SES
- Resend
- Postmark

#### Redefinir Senha (`/auth/reset-password?token=xxx`)

- Validação de token (não usado, não expirado)
- Nova senha com mesma validação forte
- Marca token como usado após sucesso
- Auto-login não é feito (usuário deve fazer login manualmente)

### Página de Perfil (`/profile`)

Acessível apenas para usuários autenticados.

#### Dados Pessoais
- Nome
- Email (não editável)
- Moeda preferida (BRL/USD)
- Idioma (pt-BR/en-US)

#### Segurança
- Troca de senha
- Requer senha atual
- Validação de nova senha

## Segurança

### Medidas Implementadas

✅ **Passwords nunca em texto puro**
- Hash com bcryptjs (fator de custo 10)
- `passwordHash` nunca retornado em queries

✅ **Validação forte de senha**
- Mínimo 8 caracteres
- Pelo menos 1 maiúscula, 1 minúscula, 1 número

✅ **Rate limiting**
- 5 tentativas de login por email em 5 minutos
- Implementação em memória (simples)

✅ **Proteção de rotas**
- Middleware protege rotas sensíveis
- Redirecionamento automático para login

✅ **Cookies seguros**
- httpOnly, sameSite (padrão do Auth.js)
- Session JWT

✅ **Proteção de dados**
- Queries sempre filtradas por `userId` da sessão
- Nenhum dado sensível em logs ou responses

✅ **Mensagens de erro genéricas**
- Não revelam se email existe
- "Email ou senha inválidos" (não especifica qual)

### Melhorias Futuras

🔄 **Autenticação de Dois Fatores (2FA)**
- TOTP (Google Authenticator, Authy)
- SMS ou email

🔄 **OAuth Providers**
- Google
- GitHub
- Microsoft

🔄 **Rate Limiting Robusto**
- Redis para armazenamento distribuído
- Rate limit por IP + email

🔄 **Logs de Auditoria**
- Histórico de logins
- Mudanças de senha
- Acessos suspeitos

🔄 **Sessões Ativas**
- Listar dispositivos conectados
- Revogar sessões remotamente

🔄 **Email Verification**
- Confirmar email após cadastro
- Re-envio de email de confirmação

🔄 **Senha Comprometida**
- Verificar contra APIs de senhas vazadas (Have I Been Pwned)

## Rotas Protegidas

As seguintes rotas requerem autenticação:

- `/dashboard`
- `/transactions`
- `/settings`
- `/profile`
- `/investments`

Se não autenticado, o usuário é redirecionado para `/auth/login?callbackUrl=[rota-original]`

## Rotas Públicas

- `/` (home)
- `/auth/*` (todas as rotas de autenticação)
- `/docs/*` (documentação)

## Comandos Úteis

```bash
# Validar schema Prisma
npx prisma validate

# Formatar schema Prisma
npx prisma format

# Gerar Prisma Client
npm run prisma:generate

# Criar migration
npm run prisma:migrate

# Seed do banco
npm run db:seed

# Lint
npm run lint

# Build
npm run build

# Dev
npm run dev
```
