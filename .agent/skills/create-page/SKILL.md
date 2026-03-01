---
name: create-page
description: Padrões e diretrizes completas para a criação de novas rotas e páginas (Server & Client Components), abordando segurança, redirects, clean code, anti-overengineering e a remoção de antipatterns como blocos try/catch e tipagem "any".
---

# Skill: Criação e Estruturação de Páginas (Create Page)

## Objetivo

Garantir que todas as **novas páginas e rotas** do projeto sigam a mesma arquitetura de segurança, fetching de dados e renderização (SSR) utilizadas nas páginas maduras do sistema. O principal objetivo é manter a consistência, previsibilidade e código tipado no Next.js App Router — **sem overengineering**.

---

## 🧭 Passo 1: Classificar o Perfil da Página

Antes de escrever qualquer código, classifique a página em um dos 4 perfis abaixo. Isso evita adicionar complexidade desnecessária (ex: auth onde não precisa, Client Component onde server resolve).

| Perfil                        | Auth        | Redirect se não autenticado                      | Exemplos Reais                                            |
| ----------------------------- | ----------- | ------------------------------------------------ | --------------------------------------------------------- |
| **Pública**                   | Nenhuma     | N/A                                              | `/`, `/authentication`                                    |
| **Pública com recurso**       | Nenhuma     | `notFound()` se recurso não existe               | `/product-variant/[slug]`, `/category/[slug]`             |
| **Pública com auth opcional** | Opcional    | Nunca redireciona, trata empty state             | `/cart`                                                   |
| **Protegida**                 | Obrigatória | `redirect("/authentication")` ou `redirect("/")` | `/my-orders`, `/cart/identification`, `/checkout/success` |

### Decisões derivadas do perfil:

- **O perfil define se o bloco de auth existe ou não.** Não adicione verificação de sessão em páginas públicas.
- **O perfil define o tipo de early return.** Páginas com recurso dinâmico usam `notFound()`. Páginas protegidas usam `redirect()`.
- **O perfil define se Client Component é necessário.** Se a página não precisa de interatividade em tempo real (ex: `my-orders` é apenas listagem), renderize 100% no server.

---

## 🛑 Antipatterns Banidos (O que NÃO fazer)

1. **Tipar com `any`**: Inaceitável. Use as interfaces da DAL (`src/data-access/`) inferidas pelo Drizzle (ex: `ProductWithVariants`, `CartWithDetails`).
2. **Usar `try/catch` para controle de fluxo**: `redirect()` e `notFound()` funcionam lançando exceções. Colocá-los dentro de `try/catch` bloqueia a navegação.
3. **Lógica de regras de negócios solta na UI**: A `page.tsx` orquestra; busca e montagem de dados complexos pertencem à DAL (`src/data-access/`).
4. **Oscilação de Layout (Layout Shift)**: Sumir com seções repentinamente. Exemplo: se "Produtos Recomendados" existe tanto para carrinho cheio quanto vazio, ela deve ser persistente com lógica de fallback.

---

## ⚠️ Anti-Overengineering (Lições aprendidas no projeto)

Estas regras foram extraídas de casos reais onde complexidade desnecessária foi adicionada e precisou ser removida.

### ❌ NÃO usar `useEffect` + `setMounted(true)` para evitar hydration mismatch

Se os dados já vêm do Server Component via prop `initialData` do React Query, **server e client são idênticos**. Não há hydration mismatch. O padrão `mounted` é necessário **apenas** quando o Client Component depende de APIs exclusivas do browser (ex: `localStorage`, `window.innerWidth`) para decidir o que renderizar.

```tsx
// ❌ ERRADO — overengineering quando temos initialData
const [mounted, setMounted] = useState(false);
useEffect(() => {
  setMounted(true);
}, []);
if (!mounted) return <div />;

// ✅ CORRETO — dados já sincronizados via Server Component
const { data, isLoading } = useMyQuery({ initialData: serverData });
```

### ❌ NÃO usar `<div />` vazio como loading

Um `<div />` vazio dá a impressão de bug. Use `<Loader2 />` do lucide-react com `animate-spin` (já usado no projeto) para feedback visual claro.

```tsx
// ❌ ERRADO — parece bug
if (isLoading) return <div className="min-h-[50vh]" />;

// ✅ CORRETO — feedback visual claro
if (isLoading && !initialData) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="text-primary size-8 animate-spin" />
    </div>
  );
}
```

### Regra geral: "Preciso mesmo de Client Component?"

Avalie usando este fluxo:

1. A página tem **interatividade em tempo real** (ex: alteração de quantidade, formulários, cliques que mudam estado)?
   - **Sim** → Client Component necessário → Delegar para `./components/nome-client.tsx`
   - **Não** → Renderize 100% no Server Component (ex: `my-orders`, `category`)
2. O Client Component precisa de **dados revalidáveis** (React Query)?
   - **Sim** → Use `initialData` vindo do Server Component. **NÃO** adicione `mounted` state.
   - **Não** → Props simples do server resolvem.

---

## 🧩 Componentes shadcn/ui (Obrigatório)

Antes de criar qualquer elemento de UI, **consultar se existe um componente shadcn/ui equivalente**. Isso garante consistência visual, acessibilidade embutida e menos código manual.

### Tabela de substituições obrigatórias

| Padrão manual                       | Componente shadcn/ui                               |
| ----------------------------------- | -------------------------------------------------- |
| `<img>` com fallback/placeholder    | `Avatar` (para perfis)                             |
| `<div>` com border/shadow/rounded   | `Card` (`CardHeader`, `CardContent`, `CardFooter`) |
| Botões de toggle com state          | `Toggle` / `ToggleGroup`                           |
| Container de loading/spinners       | `Skeleton`                                         |
| Tooltips com `title` nativo ou CSS  | `Tooltip`                                          |
| Dividers com `<hr>` ou `border-b`   | `Separator`                                        |
| Tabs com state manual               | `Tabs`                                             |
| `<select>` nativo estilizado        | `Select`                                           |
| Modal/popup com state manual        | `Dialog`                                           |
| Drawer lateral com state            | `Sheet`                                            |
| Lista com scroll customizado        | `ScrollArea`                                       |
| Breadcrumbs manuais                 | `Breadcrumb`                                       |
| Accordion com state manual          | `Accordion` / `Collapsible`                        |
| Badges/tags com `<span>` estilizado | `Badge`                                            |
| Carrossel manual                    | `Carousel` (Embla)                                 |

### Regras de composição

- **Variantes do Button**: use `variant` e `size` do `Button` em vez de criar botões com classes inline diferentes.
- **`cn()` utility**: toda merge de classes deve usar `cn()` de `@/lib/utils`.
- **Props de extensão**: componentes devem aceitar `className` para customização, usando `cn()` para merge.
- **Acessibilidade**: componentes shadcn/ui incluem ARIA e keyboard navigation. Preferir eles em vez de implementações manuais sem a11y.

### Como buscar componentes (ferramentas MCP)

```
mcp_shadcn_search_items_in_registries  — buscar por nome ou caso de uso
mcp_shadcn_view_items_in_registries    — ver código-fonte de um componente
mcp_shadcn_get_add_command_for_items   — obter comando de instalação
```

> **Regra**: nunca instalar componente que não será efetivamente usado. Instalar apenas sob demanda.

---

## 📋 Anatomia Padrão de uma Página (`page.tsx`)

A estrutura segue um pipeline ordenado. Cada etapa é um early return potencial.

### Pipeline Canônico (ordem obrigatória)

```
1. Metadata (export estático)
2. Auth Check + Early Return (apenas para perfis que exigem)
3. Validação de parâmetros (params, searchParams) + Early Return
4. Fetch da DAL (com Promise.all se múltiplos fetches independentes)
5. Validação de posse de dados + Early Return
6. Transformação de dados derivados (ex: totalPriceInCents)
7. Renderização (Server Component direto ou delegação ao Client Component)
```

### 1. Metadata / SEO

Toda página com título e descrição específicos deve exportar `metadata`. Se a página não tem contexto próprio, o metadata global do `layout.tsx` cobre.

```tsx
export const metadata = {
  title: "Sacola | BEWEAR",
  description: "Revise os itens da sua sacola antes de finalizar a compra.",
};
```

### 2. Autenticação e Proteção da Rota

Apenas para perfis **Protegida** e **Pública com auth opcional**.

```tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const MinhaPagina = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Perfil Protegida: redirect obrigatório
  if (!session?.user) {
    redirect("/authentication");
  }

  // Se chegou aqui, é seguro usar session.user.id
};
```

Para o perfil **Pública com auth opcional** (ex: `/cart`):

```tsx
// NÃO redireciona — apenas condiciona o fetch
let cart = undefined;
if (session?.user) {
  cart = await getCartByUserId(session.user.id);
}
```

### 3. Validação de Parâmetros (Early Returns)

Para páginas com `params` ou `searchParams`, valide e redirecione sem try/catch.

```tsx
// Página com params dinâmicos (ex: /product-variant/[slug])
interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;
  const product = await getProductVariantBySlug(slug);
  if (!product) return notFound();
  // ...
};

// Página com searchParams (ex: /checkout/success?orderId=xxx)
interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

const SuccessPage = async ({ searchParams }: SuccessPageProps) => {
  const { orderId } = await searchParams;
  if (!orderId) redirect("/");
  // ...
};
```

### 4. Fetch da DAL

Sempre busque os dados via DAL (`src/data-access/`). Se houver múltiplos fetches independentes, use `Promise.all`:

```tsx
// ✅ Fetches paralelos — mais rápido
const [products, categories, newlyCreated] = await Promise.all([
  getProductsWithVariants(),
  getCategories(),
  getNewlyCreatedProducts(),
]);

// ✅ Fetch único — direto
const orders = await getOrdersByUserId(session.user.id);
```

### 5. Validação de Posse de Dados

Após o fetch, verifique se o dado pertence ao usuário logado (quando aplicável):

```tsx
const order = await getOrderById(orderId);
if (!order || order.userId !== session.user.id) {
  redirect("/");
}
```

### 6. Transformação de Dados Derivados

Cálculos simples derivados dos dados (ex: total do carrinho) ficam na `page.tsx`, não no Client Component:

```tsx
const totalPriceInCents = cart.items.reduce((acc, item) => {
  return acc + item.productVariant.priceInCents * item.quantity;
}, 0);
```

### 7. Renderização

Injete propriedades bem tipadas no Client Component (se necessário) ou renderize diretamente:

```tsx
// Com Client Component (interatividade necessária)
return <CartPageClient initialCart={cart} recommendedProducts={products} />;

// Sem Client Component (listagem pura no server)
return (
  <div>
    {orders.map(order => (
      <OrderCard key={order.id} {...order} />
    ))}
  </div>
);
```

---

## 🛠 Padrão para Client Components (`./components/`)

Quando a página precisa de um Client Component:

1. **Crie em** `src/app/minha-rota/components/meu-componente.tsx`
2. **Interface tipada** com as props que o server injeta
3. **React Query com `initialData`** se houver dados revalidáveis
4. **Loading inteligente**: só mostra loader se **não** houver `initialData`
5. **Não adicione `mounted` state** se não usar APIs exclusivas do browser

```tsx
"use client";

import { Loader2 } from "lucide-react";

import type { ProductWithVariants } from "@/data-access/product";
import { useCart } from "@/hooks/queries/use-cart";
import { useIsMutating } from "@tanstack/react-query";

interface MeuClientProps {
  initialCart?: Awaited<ReturnType<typeof getCart>>;
  products: ProductWithVariants[];
}

const MeuClient = ({ initialCart, products }: MeuClientProps) => {
  const { data: cart, isLoading } = useCart({ initialData: initialCart });

  // 6. Protegendo Navegações de Transações Falsas/Otimistas
  const isAdding = useIsMutating({ mutationKey: ["add-cart-product"] });
  if (isAdding > 0) {
    // Escudo: O banco de dados está sincronizando silenciosamente.
    // É obrigatório travar botões como "Finalizar Compra" aqui.
  }

  // Loading SÓ aparece se NÃO houve dados iniciais do servidor
  if (isLoading && !initialCart) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="text-primary size-8 animate-spin" />
      </div>
    );
  }

  // Renderização normal...
};
```

---

## 🛠 Padrão para Listagens Recorrentes (Ex: Produtos Recomendados)

1. **Evite renderização condicional que "pisca"**: Se "Você também pode gostar" usa dados do carrinho e o usuário esvazia o carrinho, os recomendados **não podem desaparecer**.
2. **Solução Fallback Constante**: Tenha lógica na `page.tsx` para buscar fallbacks seguros (recém-criados, destaques) quando os dados primários estiverem vazios.

```tsx
const recommendedProducts = isCartEmpty
  ? await getNewlyCreatedProducts() // fallback seguro
  : await getProductsByCategoryId(categoryId); // baseado no conteúdo
```

---

## ✅ Checklist de Implementação

Ao criar uma nova página, verifique **todos** os itens aplicáveis:

### Estrutura

- [ ] O perfil da página foi classificado (Pública / Pública com recurso / Pública com auth opcional / Protegida)?
- [ ] A `page.tsx` é um Server Component (`async` function, sem `"use client"`)?
- [ ] O pipeline canônico está na ordem correta (metadata → auth → params → fetch → validação → transformação → render)?
- [ ] `metadata` foi exportado com `title` e `description` relevantes?

### Segurança e Validação

- [ ] Auth check com `auth.api.getSession` existe SE o perfil exige?
- [ ] Auth check NÃO existe se o perfil é público (evitar overengineering)?
- [ ] Early returns usam `redirect()` ou `notFound()` — sem `try/catch`?
- [ ] Validação de posse de dados existe quando aplicável (ex: `order.userId !== session.user.id`)?

### Tipagem e DAL

- [ ] Nenhum tipo `any` restante?
- [ ] Toda tipagem de `params` e `searchParams` usa `Promise<{...}>`?
- [ ] Dados vêm da DAL (`src/data-access/`) e nunca diretamente do `@/db`?
- [ ] Fetches independentes usam `Promise.all`?

### Client Component (se aplicável)

- [ ] Foi avaliado se Client Component é **realmente necessário** (página precisa de interatividade)?
- [ ] Criado em `src/app/rota/components/` com interface tipada?
- [ ] React Query usa `initialData` vindo do server (sem `mounted` state)?
- [ ] Loading usa `<Loader2 />` (não `<div />` vazio)?
- [ ] Hooks de query/mutation seguem o padrão `src/hooks/queries/` e `src/hooks/mutations/`?

### Layout e UX

- [ ] Listagens recorrentes (ex: recomendados) possuem lógica de fallback?
- [ ] Não há oscilação de layout (seções que somem e aparecem)?
- [ ] Componentes locais da página estão em `./components/`?

### Componentes shadcn/ui

- [ ] Elementos de UI usam componentes shadcn/ui quando disponíveis (consultar tabela acima)?
- [ ] `cn()` é usado para merge de classes?
- [ ] Componentes interativos possuem acessibilidade (ARIA, keyboard navigation)?
- [ ] Ferramentas MCP do shadcn foram consultadas antes de implementar elementos manuais?

---

📝 **Use essa skill toda vez que planejar uma nova rota/página no App Router. Classifique o perfil primeiro, siga o pipeline, e questione cada camada de complexidade adicionada.**
