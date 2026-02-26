<div align="center">

# 🛍️ Bewear — E-commerce Full Stack

**Uma plataforma de e-commerce moderna e completa, construída com as tecnologias mais recentes do ecossistema React.**

[Tecnologias](#-tecnologias) • [Funcionalidades](#-funcionalidades) • [Arquitetura](#-arquitetura) • [Como Rodar](#-como-rodar) • [Estrutura](#-estrutura-do-projeto)

</div>

---

## 🚀 Tecnologias

| Camada             | Tecnologias                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| **Frontend**       | Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Radix UI |
| **Backend**        | Next.js Server Components · Server Actions · API Routes                     |
| **Banco de Dados** | PostgreSQL · Drizzle ORM · Drizzle Kit (migrations)                         |
| **Autenticação**   | BetterAuth (email/senha + Google OAuth)                                     |
| **Pagamentos**     | Stripe Checkout · Stripe Webhooks                                           |
| **Estado & Forms** | TanStack React Query · React Hook Form · Zod                                |
| **UI/UX**          | Embla Carousel · Lucide React · Sonner (toasts) · next-themes               |
| **Dev Tools**      | ESLint · Prettier · prettier-plugin-tailwindcss · tsx                       |

---

## ✨ Funcionalidades

### Catálogo de Produtos

- **6 categorias** com 24 produtos e 60+ variantes de cor
- Navegação por categoria com slugs amigáveis para SEO
- Página de produto com seletor de variantes (cor) e imagens dinâmicas
- Carousel de hero banner e seção de marcas parceiras com scroll infinito

### Carrinho de Compras

- Carrinho persistente no banco de dados (por usuário)
- Adicionar, remover e alterar quantidade de produtos
- Componente Sheet (sidebar) para acesso rápido ao carrinho
- Resumo do pedido com cálculo automático de valores

### Fluxo de Checkout Completo

- **Stepper visual** com 3 etapas: Sacola → Identificação → Pagamento
- Gerenciamento de endereços de entrega (CRUD completo)
- Formulário de endereço com validação Zod e máscara de CEP/CPF
- Integração com Stripe Checkout para pagamento seguro
- Webhook do Stripe para atualização automática do status do pedido
- Página de sucesso com detalhes do pedido

### Autenticação

- Login com email e senha
- Login social com Google (OAuth)
- Sessões gerenciadas pelo BetterAuth com adapter Drizzle

### Acompanhamento de Pedidos

- Página "Meus Pedidos" com histórico completo
- Status do pedido em tempo real (pendente → pago → produção → enviado → entregue)

---

## 🏗️ Arquitetura

### Padrões Aplicados

```
src/
├── actions/          # Server Actions (mutações)
├── data-access/      # Data Access Layer — queries isoladas
├── db/               # Schema do banco + seed
├── components/
│   ├── ui/           # Componentes shadcn/ui (primitivas)
│   └── common/       # Componentes reutilizáveis do projeto
├── hooks/            # Custom hooks
├── lib/              # Configurações (auth, db, utils)
├── helpers/          # Funções utilitárias puras
└── providers/        # React Context Providers
```

#### Data Access Layer (DAL)

Todas as queries ao banco estão isoladas em `src/data-access/`, separando a lógica de acesso a dados dos componentes e Server Actions. Isso garante:

- **Reutilização**: mesma query usada em múltiplas pages/actions
- **Testabilidade**: queries podem ser testadas isoladamente
- **Segurança**: módulos protegidos com `server-only`

#### Server Components vs. Client Components

- **Server Components** para pages que buscam dados (zero JavaScript no cliente)
- **Client Components** apenas onde necessário: interatividade, hooks, estado

#### Server Actions

Mutações organizadas em pastas individuais com schema Zod de validação:

- `add-cart-product` — Adicionar produto ao carrinho
- `remove-cart-product` — Remover produto do carrinho
- `create-shipping-address` — Criar endereço de entrega
- `update-cart-shipping-address` — Vincular endereço ao carrinho
- `create-checkout-session` — Criar sessão de pagamento no Stripe
- `finish-order` — Finalizar pedido

---

## 🗄️ Modelagem do Banco de Dados

```mermaid
erDiagram
    USER ||--o{ SESSION : has
    USER ||--o{ ACCOUNT : has
    USER ||--o{ SHIPPING_ADDRESS : has
    USER ||--|| CART : has
    USER ||--o{ ORDER : places

    CATEGORY ||--o{ PRODUCT : contains
    PRODUCT ||--o{ PRODUCT_VARIANT : has

    CART ||--o{ CART_ITEM : contains
    CART }o--|| SHIPPING_ADDRESS : uses

    CART_ITEM }o--|| PRODUCT_VARIANT : references

    ORDER ||--o{ ORDER_ITEM : contains
    ORDER }o--|| SHIPPING_ADDRESS : references
    ORDER_ITEM }o--|| PRODUCT_VARIANT : references
```

**10 tabelas** com relações bem definidas e integridade referencial via foreign keys e cascade deletes.

---

## 🔐 Segurança

- **BetterAuth** com adapter Drizzle para autenticação robusta
- **Proteção de rotas** via verificação de sessão em Server Components
- **Validação de dados** com Zod em todos os Server Actions
- **Webhook seguro** com verificação de assinatura do Stripe
- **`server-only`** para proteger módulos que não devem rodar no cliente
- **Verificação de propriedade** — usuários só acessam seus próprios pedidos

---

## 💳 Integração Stripe

O fluxo de pagamento funciona da seguinte forma:

1. Usuário finaliza o carrinho → Server Action cria a `checkout session` no Stripe
2. Usuário é redirecionado para a página de pagamento hospedada pelo Stripe
3. Após pagamento, Stripe envia webhook para `/api/stripe/webhook`
4. Webhook verifica assinatura, extrai `orderId` dos metadados e atualiza status para `paid`
5. Usuário é redirecionado para `/checkout/success?orderId=...`

---

## 📦 Como Rodar

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Conta Stripe (para pagamentos)
- Conta Google Cloud (para OAuth — opcional)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/douglastfs/bewear-ecommerce.git
cd bewear-ecommerce

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

### Variáveis de Ambiente

```env
# Banco de Dados
DATABASE_URL=postgresql://user:password@localhost:5432/bewear

# BetterAuth
BETTER_AUTH_SECRET=sua-chave-secreta
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Executando

```bash
# Gerar as migrations e aplicar no banco
npx drizzle-kit push

# Popular o banco com dados de exemplo (6 categorias, 24 produtos, 60+ variantes)
npx tsx src/db/seed.ts

# Iniciar o servidor de desenvolvimento
npm run dev

# Em outro terminal: iniciar o listener de webhooks do Stripe
npm run stripe:webhook
```

Acesse [http://localhost:3000](http://localhost:3000) 🚀

---

## 📂 Estrutura do Projeto

```
bewear/
├── src/
│   ├── actions/                    # 8 Server Actions
│   │   ├── add-cart-product/
│   │   ├── create-checkout-session/
│   │   ├── create-shipping-address/
│   │   ├── finish-order/
│   │   ├── get-cart/
│   │   ├── get-shipping-addresses/
│   │   ├── remove-cart-product/
│   │   └── update-cart-shipping-address/
│   │
│   ├── app/                        # Rotas (App Router)
│   │   ├── authentication/         # Login e registro
│   │   ├── cart/                   # Carrinho + fluxo de checkout
│   │   │   ├── identification/     # Seleção de endereço
│   │   │   └── confirmation/       # Confirmação do pedido
│   │   ├── category/[slug]/        # Listagem por categoria
│   │   ├── checkout/success/       # Página de sucesso
│   │   ├── my-orders/              # Histórico de pedidos
│   │   ├── product-variant/[slug]/ # Detalhes do produto
│   │   └── api/stripe/webhook/     # Webhook do Stripe
│   │
│   ├── components/
│   │   ├── common/                 # 12 componentes reutilizáveis
│   │   └── ui/                     # 16 componentes shadcn/ui
│   │
│   ├── data-access/                # DAL — 5 módulos
│   │   ├── cart.ts
│   │   ├── category.ts
│   │   ├── order.ts
│   │   ├── product.ts
│   │   └── shipping-address.ts
│   │
│   ├── db/
│   │   ├── index.ts                # Conexão com PostgreSQL
│   │   ├── schema.ts               # Schema Drizzle (10 tabelas)
│   │   └── seed.ts                 # Dados de exemplo
│   │
│   ├── hooks/                      # Custom hooks
│   ├── lib/                        # Auth, DB, utils
│   ├── helpers/                    # Funções utilitárias
│   └── providers/                  # React Context Providers
│
├── public/                         # Assets estáticos
├── drizzle.config.ts               # Configuração Drizzle Kit
├── next.config.ts                  # Configuração Next.js
└── package.json
```

---

## 📊 Números do Projeto

| Métrica                   | Quantidade |
| ------------------------- | ---------- |
| Tabelas no banco          | 10         |
| Server Actions            | 8          |
| Módulos DAL               | 5          |
| Componentes UI (shadcn)   | 16         |
| Componentes reutilizáveis | 12         |
| Categorias de produtos    | 6          |
| Produtos                  | 24         |
| Variantes de produto      | 60+        |
| Custom Hooks              | 10         |

---

## 📝 Créditos

Este projeto foi desenvolvido durante o **Bootcamp da [FullStackClub](https://fullstackclub.com.br)** com o professor **Felipe Rocha**, e expandido com implementações adicionais de arquitetura, refatorações e melhorias.

---

<div align="center">

**Desenvolvido por [Douglas Tenório](https://github.com/douglastfs)**

</div>
