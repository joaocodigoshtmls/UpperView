# UpperView MVP - Visual Guide

## 📸 Application Walkthrough

This guide shows what the UpperView application looks like when fully configured with data.

## 🏠 Home Page (/)

![Home Page](https://github.com/user-attachments/assets/8c81831e-bb9a-4b03-8797-75b7258f26c0)

**Features:**
- Clean, modern landing page
- UpperView branding in blue (#2563EB)
- Navigation bar: Início, Dashboard, Transações, Configurações
- Call-to-action buttons
- Feature showcase cards
- Responsive design

**What you see:**
- Welcome message with rocket emoji
- Two CTA buttons: "Ir para Dashboard" and "Ver Transações"
- Three feature cards:
  - 📊 Dashboard Completo
  - 💰 Transações
  - ⚙️ Configurações

---

## 📊 Dashboard (/dashboard)

**With data, the dashboard displays:**

### Top Cards (Side by Side)
```
┌──────────────────────────────────────────────────────────────┐
│                                                                │
│  Receitas (mês)        Despesas (mês)        Resultado       │
│  R$ 5.500,00           R$ 2.115,40           R$ 3.384,60     │
│  (Green border)        (Red border)          (Green border)  │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

**Card Details:**
- **Income (Receitas)**: Sum of all INCOME transactions for current month
  - Green left border
  - Large, bold green text
  - Small gray label "Receitas (mês)"

- **Expenses (Despesas)**: Sum of all EXPENSE transactions for current month
  - Red left border
  - Large, bold red text
  - Small gray label "Despesas (mês)"

- **Result (Resultado)**: Income minus Expenses
  - Green border if positive, red if negative
  - Green text if positive, red if negative
  - Small gray label "Resultado (mês)"

### Accounts Section

```
┌─────────────────────────────────────────────────────────────┐
│ Contas                                                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Conta Mercado Pago                          R$ 1.500,50    │
│  Mercado Pago • PAYMENT_APP • BRL                           │
│                                                               │
│  Conta Corrente Sicredi                      R$ 3.200,00    │
│  Sicredi • CHECKING • BRL                                   │
│                                                               │
│  Investimentos BTG                          R$ 15.000,00    │
│  BTG Pactual • INVESTMENT • BRL                             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Account Cards:**
- Each account in a white card with hover effect
- Account name in bold
- Institution, type, and currency in smaller gray text
- Balance aligned to the right in bold
- Border on hover

### Expense Chart

```
┌─────────────────────────────────────────────────────────────┐
│ Despesas por Categoria                                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [Bar Chart - Recharts]                                     │
│                                                               │
│  ▆▆▆▆▆▆▆▆▆▆▆▆ Moradia         R$ 1.200,00                  │
│  ▆▆▆▆▆▆ Transporte            R$ 350,00                     │
│  ▆▆▆▆▆ Alimentação            R$ 195,50                     │
│  ▆▆▆ Lazer                    R$ 120,00                     │
│  ▆▆ Assinaturas               R$ 49,90                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Chart Features:**
- Blue bars (#2563EB)
- Rounded corners on top of bars
- X-axis: Category names
- Y-axis: Values formatted as BRL currency
- Tooltip on hover with formatted value
- Responsive container (adapts to screen size)
- Shows top 6 categories by expense amount

---

## 💰 Transactions (/transactions)

**Layout:**

### Header
```
┌─────────────────────────────────────────────────────────────┐
│ Transações                              [+ Nova Transação]  │
└─────────────────────────────────────────────────────────────┘
```

### Filters Bar
```
┌─────────────────────────────────────────────────────────────┐
│ [Buscar por descrição...        ] [Todos os tipos ▾] [Filtrar] │
└─────────────────────────────────────────────────────────────┘
```

**Filter Options:**
- Text search: Searches in description field
- Type dropdown: All, Receitas, Despesas, Transferências
- Filter button: Applies filters (GET request)

### Transaction Table
```
┌───────────────────────────────────────────────────────────────────────────┐
│ DATA       │ CONTA              │ CATEGORIA    │ DESCRIÇÃO    │ VALOR     │
├───────────────────────────────────────────────────────────────────────────┤
│ 20/11/2025 │ Conta Corrente     │ Transporte   │ Gasolina     │ -R$ 200,00│
│ 18/11/2025 │ Conta Mercado Pago │ Alimentação  │ Padaria      │ -R$ 65,00 │
│ 15/11/2025 │ Conta Mercado Pago │ -            │ Freelance    │ +R$ 500,00│
│ 15/11/2025 │ Conta Corrente     │ Assinaturas  │ Netflix      │ -R$ 49,90 │
│ 12/11/2025 │ Conta Mercado Pago │ Lazer        │ Cinema       │ -R$ 120,00│
│ 10/11/2025 │ Conta Corrente     │ Transporte   │ Uber         │ -R$ 150,00│
│ 08/11/2025 │ Conta Mercado Pago │ Alimentação  │ Restaurante  │ -R$ 45,00 │
│ 05/11/2025 │ Conta Corrente     │ -            │ Salário      │+R$ 5.000,00│
│ 03/11/2025 │ Conta Mercado Pago │ Alimentação  │ Supermercado │ -R$ 85,50 │
│ 01/11/2025 │ Conta Corrente     │ Moradia      │ Aluguel      │-R$ 1.200,00│
└───────────────────────────────────────────────────────────────────────────┘
```

**Table Features:**
- Sorted by date (most recent first)
- Expenses shown in red with minus sign
- Income shown in green with plus sign
- Hover effect on rows
- No category shown as "-"
- Date formatted as DD/MM/YYYY

### Create Transaction Dialog

When clicking "+ Nova Transação":

```
┌─────────────────────────────────────┐
│ Nova Transação                  [X] │
├─────────────────────────────────────┤
│                                     │
│ Tipo *                              │
│ [Receita ▾]                         │
│                                     │
│ Conta *                             │
│ [Selecione uma conta ▾]            │
│                                     │
│ Categoria                           │
│ [Nenhuma ▾]                        │
│                                     │
│ Valor (R$) *                        │
│ [0.00]                              │
│                                     │
│ Data *                              │
│ [2025-11-14]                        │
│                                     │
│ Descrição                           │
│ [Ex: Compra no supermercado]       │
│                                     │
│ [Cancelar]         [Salvar]        │
│                                     │
└─────────────────────────────────────┘
```

**Dialog Features:**
- Modal overlay (darkened background)
- Form validation
- Required fields marked with *
- Date defaults to today
- Submit button shows "Salvando..." while processing
- Error messages shown at top if validation fails
- Closes and refreshes list on success

---

## ⚙️ Settings (/settings)

**Layout:**

### Accounts Section
```
┌─────────────────────────────────────────────────────────────┐
│ Contas Financeiras                      [+ Nova Conta]      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Conta Mercado Pago                    R$ 1.500,50          │
│  Mercado Pago • PAYMENT_APP • BRL      [Editar] [Excluir]  │
│                                                               │
│  Conta Corrente Sicredi                R$ 3.200,00          │
│  Sicredi • CHECKING • BRL              [Editar] [Excluir]  │
│                                                               │
│  Investimentos BTG                    R$ 15.000,00          │
│  BTG Pactual • INVESTMENT • BRL        [Editar] [Excluir]  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Categories Section
```
┌─────────────────────────────────────────────────────────────┐
│ Categorias                             [+ Nova Categoria]   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🍔 Alimentação [Padrão]               [Editar] [Excluir]  │
│  🚗 Transporte [Padrão]                [Editar] [Excluir]  │
│  🏠 Moradia [Padrão]                   [Editar] [Excluir]  │
│  📚 Educação [Padrão]                  [Editar] [Excluir]  │
│  🏥 Saúde [Padrão]                     [Editar] [Excluir]  │
│  🎮 Lazer [Padrão]                     [Editar] [Excluir]  │
│  📱 Assinaturas [Padrão]               [Editar] [Excluir]  │
│  📄 Impostos [Padrão]                  [Editar] [Excluir]  │
│  📈 Investimentos [Padrão]             [Editar] [Excluir]  │
│  💸 Transferências [Padrão]            [Editar] [Excluir]  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Account Form Dialog

```
┌─────────────────────────────────────┐
│ Nova Conta                      [X] │
├─────────────────────────────────────┤
│                                     │
│ Nome *                              │
│ [Ex: Conta Corrente]                │
│                                     │
│ Tipo *                              │
│ [Conta Corrente ▾]                 │
│   • Conta Corrente                 │
│   • Poupança                       │
│   • Cartão de Crédito              │
│   • Dinheiro                       │
│   • App de Pagamento               │
│   • Investimentos                  │
│                                     │
│ Instituição                         │
│ [Nenhuma ▾]                        │
│   • Mercado Pago                   │
│   • Sicredi                        │
│   • BTG Pactual                    │
│   • C6 Bank                        │
│                                     │
│ Moeda *                             │
│ [BRL (Real) ▾]                     │
│                                     │
│ Saldo *                             │
│ [0.00]                              │
│                                     │
│ [Cancelar]         [Salvar]        │
│                                     │
└─────────────────────────────────────┘
```

### Category Form Dialog

```
┌─────────────────────────────────────┐
│ Nova Categoria                  [X] │
├─────────────────────────────────────┤
│                                     │
│ Nome *                              │
│ [Ex: Alimentação]                   │
│                                     │
│ Ícone (emoji)                       │
│ [🍔]                                │
│                                     │
│ [Cancelar]         [Salvar]        │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎨 Design System

### Colors

**Primary:**
- Blue 600: `#2563EB` - Main brand color, buttons, links
- Slate 50: `#F8FAFC` - Background
- White: `#FFFFFF` - Cards, forms

**Semantic:**
- Green 600: `#16A34A` - Income, positive results
- Red 600: `#DC2626` - Expenses, negative results
- Slate 600: `#475569` - Secondary text
- Slate 800: `#1E293B` - Primary text

### Typography

**Font Family:** System fonts (Inter, SF Pro, Segoe UI, etc.)

**Sizes:**
- Headings (h1): 30px (text-3xl)
- Headings (h2): 24px (text-xl)
- Body: 14px (text-sm)
- Labels: 14px (text-sm)
- Values: 24px (text-2xl)

**Weights:**
- Bold: 700 (headings, values)
- Semibold: 600 (labels, buttons)
- Medium: 500 (navigation)
- Regular: 400 (body text)

### Spacing

- Container max width: 1152px (max-w-6xl)
- Section spacing: 32px (space-y-8)
- Card padding: 24px (p-6)
- Form spacing: 16px (space-y-4)
- Button padding: 12px 24px (px-6 py-3)

### Components

**Cards:**
- Background: White
- Border radius: 8px (rounded-lg)
- Shadow: subtle (shadow-sm)
- Hover: slightly elevated

**Buttons:**
- Primary: Blue 600 background, white text
- Secondary: Slate 200 background, slate 700 text
- Danger: Red 600 text
- Border radius: 8px (rounded-lg)
- Transition: all 200ms

**Forms:**
- Input height: 40px (py-2)
- Border: Slate 300
- Focus: Blue 500 ring
- Border radius: 8px (rounded-lg)

**Navigation:**
- Fixed header
- White background
- Blue brand name
- Slate text with blue hover
- Border bottom

---

## 📱 Responsive Behavior

### Desktop (> 768px)
- Full navigation visible
- Cards in grid (3 columns)
- Chart at full width
- Table scrollable horizontally if needed

### Tablet (768px)
- Navigation collapses to icons
- Cards in 2 columns
- Chart responsive
- Table scrolls horizontally

### Mobile (< 640px)
- Hamburger menu
- Cards stacked (1 column)
- Chart scales down
- Table scrolls horizontally
- Simplified forms

---

## ⚡ Interactions

### Loading States
- Buttons show "Salvando..." while submitting
- Disabled state with opacity: 0.5
- Cursor changes to wait

### Error States
- Red border on invalid inputs
- Error message in red box at top
- Form doesn't close on error

### Success States
- Form closes automatically
- Page refreshes with new data
- No explicit success message (data appears)

### Hover States
- Cards: slight background change
- Buttons: darker background
- Links: underline or color change
- Table rows: light background

---

## 🔄 Data Flow

### Dashboard
1. Server fetches user ID
2. Queries transactions for current month
3. Calculates totals and categories
4. Queries accounts
5. Passes data to components
6. Chart rendered client-side

### Transactions
1. Server fetches user ID
2. Queries transactions with filters
3. Displays in table
4. User clicks "Nova Transação"
5. Modal opens (client state)
6. User fills form
7. Submit triggers Server Action
8. Validation with Zod
9. Insert into database
10. Revalidate `/transactions` and `/dashboard`
11. Modal closes
12. Page refreshes with new data

### Settings
1. Server fetches accounts and categories
2. Displays in lists
3. User clicks "Nova Conta" or "Editar"
4. Modal opens with form
5. Submit triggers Server Action
6. Validation and database operation
7. Revalidate `/settings` and `/dashboard`
8. Modal closes
9. Page refreshes

---

## 🎯 User Flows

### Creating a Transaction
1. Navigate to /transactions
2. Click "+ Nova Transação"
3. Select type (Receita/Despesa)
4. Choose account
5. Optionally select category
6. Enter amount
7. Pick date (defaults to today)
8. Add description
9. Click "Salvar"
10. Transaction appears in list
11. Dashboard updates automatically

### Managing Accounts
1. Navigate to /settings
2. Scroll to "Contas Financeiras"
3. Click "+ Nova Conta"
4. Enter account details
5. Click "Salvar"
6. Account appears in list
7. Account now available in transaction form

### Viewing Financial Summary
1. Navigate to /dashboard
2. See income/expenses/result at a glance
3. Review account balances
4. Analyze spending by category in chart
5. Click account to see details (future feature)

---

## 💡 Tips for Testing

### With Seed Data
After running `npm run db:seed`:
- Dashboard shows R$ 5.500,00 income
- Dashboard shows R$ 2.115,40 expenses
- 10 transactions visible in /transactions
- 3 accounts in both dashboard and settings
- 10 categories in settings

### Creating Test Data
1. Create a few accounts with different types
2. Add transactions across multiple categories
3. Mix income and expense transactions
4. Use different dates to test filtering
5. Try editing and deleting

### Edge Cases to Test
- Empty states (no accounts, no transactions)
- Very large amounts (formatting)
- Special characters in descriptions
- Multiple transactions on same day
- Negative balances (allowed)

---

**Visual Guide Complete!** 🎨

This guide shows all the main screens and interactions of the UpperView MVP. The actual experience is even better with smooth animations and responsive interactions.
