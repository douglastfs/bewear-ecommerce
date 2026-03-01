---
name: frontend-responsive
description: Guia para construir e tornar responsivo o frontend do projeto, reaproveitando componentes existentes, seguindo os design tokens e patterns estabelecidos
---

# Skill: Frontend Responsivo

## Objetivo

Guiar a construção e responsividade do frontend, reaproveitando componentes existentes, seguindo tokens de design e patterns do projeto, com referência visual do Figma via MCP.

---

## Workflow com Figma MCP

Ao receber um design do Figma para implementar:

1. **Obter contexto** — usar `get_design_context` ou `get_screenshot` do MCP Figma para entender o layout
2. **Mapear componentes** — identificar quais componentes existentes cobrem o design (ver inventário abaixo)
3. **Implementar** — criar/modificar apenas o necessário, reutilizando ao máximo
4. **Verificar** — comparar resultado com o screenshot do Figma

---

## Inventário de Componentes

Antes de criar qualquer componente, verificar se já existe um que atenda:

### `src/components/common/` (componentes de negócio reutilizáveis)

| Componente              | Tipo   | Descrição                                                              |
| ----------------------- | ------ | ---------------------------------------------------------------------- |
| `header.tsx`            | client | Header com logo, carrinho e menu lateral (Sheet)                       |
| `footer.tsx`            | server | Footer simples com copyright                                           |
| `hero-banner.tsx`       | client | Carousel de banners com autoplay, setas e indicadores                  |
| `product-item.tsx`      | server | Card de produto (imagem, nome, descrição, preço)                       |
| `product-list.tsx`      | client | Lista horizontal scrollável de produtos                                |
| `category-selector.tsx` | server | Grid 2 colunas de botões de categoria                                  |
| `cart.tsx`              | client | Drawer lateral do carrinho (Sheet)                                     |
| `cart-item.tsx`         | client | Item do carrinho com controles de quantidade                           |
| `cart-summary.tsx`      | server | Resumo do pedido (preços + lista de itens) com link "Editar"           |
| `checkout-steps.tsx`    | client | Stepper visual de 3 etapas do checkout (Dice UI)                       |
| `address-card.tsx`      | server | Card de identificação/endereço com link "Alterar" e suporte a children |
| `partners-brands.tsx`   | server | Carousel infinito de logos de parceiros                                |

### `src/components/ui/` (shadcn/ui)

Avatar, Button, Card, Carousel, Collapsible, Dialog, Form, Input, Label, RadioGroup, ScrollArea, Separator, Sheet, Sonner (Toast), Stepper (Dice UI), Tabs.

> **Regra**: Sempre usar componentes shadcn/ui antes de criar customizados. Consultar o MCP do shadcn para componentes disponíveis que ainda não estão instalados.

---

## Design Tokens

**NUNCA usar cores hardcoded** (ex: `text-[#656565]`, `bg-[#F4EFFF]`).

Sempre usar tokens shadcn/Tailwind:

| Token                                        | Uso                            |
| -------------------------------------------- | ------------------------------ |
| `bg-background` / `text-foreground`          | Fundo e texto principal        |
| `bg-primary` / `text-primary-foreground`     | Ações principais, CTAs         |
| `bg-secondary` / `text-secondary-foreground` | Ações secundárias              |
| `bg-muted` / `text-muted-foreground`         | Textos secundários, descrições |
| `bg-accent` / `text-accent-foreground`       | Destaques, hover states        |
| `bg-card` / `text-card-foreground`           | Cards                          |
| `bg-destructive`                             | Ações de exclusão/erro         |
| `border-border`                              | Bordas                         |
| `ring-ring`                                  | Focus rings                    |

Se o design do Figma exige uma cor que não existe nos tokens, **criar uma variável CSS** em `globals.css` ao invés de usar valor hardcoded.

---

## Responsividade

### Abordagem: Mobile-First

O projeto segue mobile-first. Implementar sempre o layout mobile **primeiro** e depois adicionar breakpoints para desktop.

### Breakpoints do Tailwind

| Prefixo  | Largura mínima | Uso              |
| -------- | -------------- | ---------------- |
| (nenhum) | < 640px        | Mobile (padrão)  |
| `sm:`    | ≥ 640px        | Mobile landscape |
| `md:`    | ≥ 768px        | Tablet           |
| `lg:`    | ≥ 1024px       | Desktop          |
| `xl:`    | ≥ 1280px       | Desktop grande   |
| `2xl:`   | ≥ 1536px       | Telas ultra-wide |

### Patterns de responsividade comuns

```tsx
{/* Grid: 1 coluna no mobile → 2 no tablet → 4 no desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

{/* Padding: menor no mobile, maior no desktop */}
<div className="px-5 lg:px-20">

{/* Flex direction: coluna no mobile → linha no desktop */}
<div className="flex flex-col lg:flex-row gap-6">

{/* Mostrar/esconder: menu hambúrguer no mobile, nav no desktop */}
<nav className="hidden lg:flex">{/* Nav desktop */}</nav>
<Sheet>{/* Menu mobile */}</Sheet>

{/* Scroll horizontal no mobile → grid no desktop */}
<div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4">

{/* Tamanho de texto responsivo */}
<h1 className="text-2xl lg:text-4xl font-bold">

{/* Container com max-width no desktop */}
<div className="mx-auto max-w-7xl">
```

### Header responsivo

O header mobile (hambúrguer + Sheet) já existe. Para desktop, adicionar:

- Navegação inline (`hidden lg:flex`) com categorias
- Ações do usuário visíveis (ao invés do Sheet)
- Logo maior
- Manter o componente `Cart` (Sheet) inalterado

### Product list responsiva

A lista de produtos (`product-list.tsx`) é scroll horizontal no mobile. Para desktop:

- Considerar grid de 4 colunas (`lg:grid lg:grid-cols-4`)
- Manter scroll horizontal como fallback ou opção de carousel

### Fluxo de Checkout

O checkout é composto por 3 páginas que reutilizam os mesmos componentes:

| Página                | Step | Componentes usados                                                   |
| --------------------- | ---- | -------------------------------------------------------------------- |
| `cart/identification` | 1    | `CheckoutSteps(1)` + `Addresses` + `CartSummary`                     |
| `cart/confirmation`   | 2    | `CheckoutSteps(2)` + `AddressCard` + `CartSummary`                   |
| `checkout/success`    | 3    | `CheckoutSteps(3)` + `AddressCard` + `CartSummary` + `SuccessDialog` |

**Padrão de composição**: `AddressCard` aceita `children` para conteúdo extra (ex: `FinishOrderButton` na confirmation). Componentes específicos de página ficam em `src/app/{page}/components/`.

---

## Patterns de Código

### Estrutura de componentes

```tsx
// 1. Server Component (padrão) — sem "use client"
const MeuComponente = ({ data }: Props) => {
  return <div>...</div>;
};
export default MeuComponente;

// 2. Client Component — apenas quando necessário (interatividade, hooks)
("use client");
const MeuComponenteInterativo = () => {
  const [state, setState] = useState();
  return <div>...</div>;
};
export default MeuComponenteInterativo;
```

### Quando usar `"use client"`

- Hooks (`useState`, `useEffect`, `useRef`)
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`window`, `document`)
- Bibliotecas client-only (React Query, embla-carousel)

**Nunca** marcar como client se o componente só renderiza dados.

### Classificar classes com `cn()`

```tsx
import { cn } from "@/lib/utils";

// Para classes condicionais
<div
  className={cn(
    "base-classes",
    isActive && "active-classes",
    className // prop para customização externa
  )}
/>;
```

### Tipagem de props

Usar tipos do DAL, nunca do schema:

```tsx
// ✅ Correto
import type { ProductWithVariants } from "@/data-access/product";
interface Props {
  product: ProductWithVariants;
}

// ❌ Errado
import { productTable } from "@/db/schema";
interface Props {
  product: typeof productTable.$inferSelect;
}
```

### Imagens e LCP (Largest Contentful Paint)

O Google mede severamente o tempo que a maior imagem útil demora para carregar. Para imagens de Hero Banner, Logos ou as 4 primeiras fotos da `product-list`, a tag nativa atrasaria-as (Lazy Load). **Sempre** force Prioridade para elementos acima da dobra (_Above The Fold_).

```tsx
<Image
  src={imageUrl}
  alt={descricao}
  width={0}
  height={0}
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
  priority={true} // <-- EXTREMAMENTE IMPORTANTE se for topo de página! Mata o F5 Flicker.
  fetchPriority="high" // <-- Apenas para LCPs supremos (ex: Logo do site)
  className="h-auto w-full rounded-3xl"
/>
```

### Preços

Sempre usar `formatCentsToBRL` de `@/helpers/money.ts`:

```tsx
import { formatCentsToBRL } from "@/helpers/money";
<p>{formatCentsToBRL(variant.priceInCents)}</p>;
```

---

## Organização de Arquivos

| Tipo                       | Localização                                    | Exemplo                                 |
| -------------------------- | ---------------------------------------------- | --------------------------------------- |
| Reutilizável entre páginas | `src/components/common/`                       | `header.tsx`, `footer.tsx`              |
| Específico de uma página   | `src/app/{page}/components/`                   | `addresses.tsx`, `variant-selector.tsx` |
| shadcn/ui                  | `src/components/ui/`                           | `button.tsx`, `card.tsx`                |
| Hooks                      | `src/hooks/queries/` ou `src/hooks/mutations/` | `use-cart.ts`                           |

---

## Checklist por componente

- [ ] Reutiliza componentes existentes quando possível
- [ ] Usa tokens de cor (nunca hardcoded)
- [ ] Mobile-first: layout mobile funciona sem breakpoints
- [ ] Breakpoints adicionados para desktop (`lg:`)
- [ ] `next/image` com `sizes` responsivo
- [ ] `cn()` para classes condicionais
- [ ] Tipos do DAL (nunca do schema direto)
- [ ] `"use client"` apenas se necessário
- [ ] Acessibilidade: `aria-label` em botões de ícone, `alt` em imagens
