---
name: create-dal
description: Criar ou expandir a Data Access Layer (DAL) — extrair queries do banco de dados de pages, componentes e server actions para arquivos dedicados em src/data-access/
---

# Skill: Criar Data Access Layer (DAL)

## O que é

Esta skill guia o processo de **desacoplar o acesso ao banco de dados** da camada de apresentação (pages, componentes, API routes) e da camada de lógica (server actions), movendo todas as queries para arquivos dedicados em `src/data-access/`.

## Princípio

> **Nenhum arquivo dentro de `src/app/` ou `src/actions/` deve importar diretamente de `@/db` ou `@/db/schema`.**
> Todo acesso ao banco passa pelo DAL em `src/data-access/`.

---

## Quando usar

- Ao criar uma nova feature que precisa buscar dados do banco
- Ao refatorar pages/componentes/actions que acessam o banco diretamente
- Ao identificar acoplamento via busca: `grep "from \"@/db" src/app/` ou `grep "from \"@/db" src/actions/`

---

## Passo a passo

### 1. Identificar acoplamento

Buscar todos os arquivos que importam diretamente do banco:

```bash
# Pages, componentes e API routes
grep -r 'from "@/db' src/app/

# Server actions
grep -r 'from "@/db' src/actions/
```

### 2. Agrupar por domínio

Cada tabela principal tem seu próprio arquivo DAL:

| Domínio    | Arquivo DAL                           | Tabela principal                      |
| ---------- | ------------------------------------- | ------------------------------------- |
| Produtos   | `src/data-access/product.ts`          | `productTable`, `productVariantTable` |
| Categorias | `src/data-access/category.ts`         | `categoryTable`                       |
| Pedidos    | `src/data-access/order.ts`            | `orderTable`, `orderItemTable`        |
| Carrinho   | `src/data-access/cart.ts`             | `cartTable`, `cartItemTable`          |
| Endereços  | `src/data-access/shipping-address.ts` | `shippingAddressTable`                |

### 3. Criar arquivo DAL

Todo arquivo DAL segue esta estrutura:

```typescript
// 1. SEMPRE começar com server-only para proteger de importação no client
import "server-only";

// 2. Importar operadores do Drizzle conforme necessário
import { desc, eq } from "drizzle-orm";

// 3. Importar db e tabelas do schema
import { db } from "@/db";
import { exemploTable } from "@/db/schema";

// 4. Exportar tipo inferido do Drizzle
export type Exemplo = typeof exemploTable.$inferSelect;

// 5. Exportar tipos compostos quando há relações aninhadas
export type ExemploComRelacao = Exemplo & {
  relacao: OutroTipo[];
};

// 6. Criar funções com tipagem de retorno EXPLÍCITA
export const getExemploById = async (
  id: string
): Promise<Exemplo | undefined> => {
  return db.query.exemploTable.findFirst({
    where: eq(exemploTable.id, id),
  });
};
```

### 4. Regras de tipagem

- **Tipos base**: usar `typeof tabela.$inferSelect` — sempre sincronizado com o schema
- **Tipos compostos**: usar interseção `&` para modelar relações aninhadas (ex: `Product & { variants: ProductVariant[] }`)
- **Retorno explícito**: toda função DEVE ter `Promise<Tipo>` no retorno — é o contrato do DAL
- **Reutilizar tipos**: importar tipos de outros DALs com `import type` quando necessário

```typescript
// ✅ Correto: reutiliza tipos de outro DAL
import type { Product, ProductVariant } from "./product";

export type OrderItemWithDetails = OrderItem & {
  productVariant: ProductVariant & {
    product: Product;
  };
};

// ❌ Errado: recriar tipos que já existem em outro DAL
export type ProductVariant = typeof productVariantTable.$inferSelect; // duplicado!
```

### 5. Refatorar a page/componente/action

**Antes** (acoplado):

```typescript
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categoryTable, productTable } from "@/db/schema";

const page = async () => {
  const category = await db.query.categoryTable.findFirst({
    where: eq(categoryTable.slug, slug),
  });
  const products = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, category.id),
    with: { variants: true },
  });
};
```

**Depois** (desacoplado):

```typescript
import { getCategoryBySlug } from "@/data-access/category";
import { getProductsByCategoryId } from "@/data-access/product";

const page = async () => {
  const category = await getCategoryBySlug(slug);
  const products = await getProductsByCategoryId(category.id);
};
```

### 6. Componentes client que usam tipos do schema

Se um componente `"use client"` importa apenas o **tipo** (não a query), trocar por `import type` do DAL:

```typescript
// ❌ Antes: componente client conhece o schema
import { shippingAddressTable } from "@/db/schema";
interface Props {
  addresses: (typeof shippingAddressTable.$inferSelect)[];
}

// ✅ Depois: componente client usa tipo do DAL
import type { ShippingAddress } from "@/data-access/shipping-address";
interface Props {
  addresses: ShippingAddress[];
}
```

> **Nota**: `import type` é removido em tempo de compilação, então não viola o `server-only`.

### 7. Verificar

Após cada refatoração:

```bash
# 1. Compilar sem erros
npx tsc --noEmit

# 2. Confirmar que não há mais imports diretos do banco no /app
grep -r 'from "@/db' src/app/

# 3. Testar a page no browser
```

---

## Checklist rápido

- [ ] `import "server-only"` no topo do arquivo DAL
- [ ] Tipos inferidos exportados (ex: `export type Product = ...`)
- [ ] Tipos compostos para queries com `with:` (ex: `ProductWithVariants`)
- [ ] Retorno explícito em todas as funções (`Promise<Tipo>`)
- [ ] Imports com alias `@/data-access/` (não caminhos relativos)
- [ ] Nenhum `from "@/db"` restante nos arquivos refatorados
- [ ] `npx tsc --noEmit` passa sem erros
- [ ] DRY: não duplicar queries — reutilizar funções existentes

---

## Convenções de nomeação

| Operação      | Padrão de nome            | Exemplo                         |
| ------------- | ------------------------- | ------------------------------- |
| Buscar um     | `get{Entidade}By{Campo}`  | `getCategoryBySlug(slug)`       |
| Buscar vários | `get{Entidades}By{Campo}` | `getProductsByCategoryId(id)`   |
| Buscar todos  | `get{Entidades}`          | `getCategories()`               |
| Criar         | `create{Entidade}`        | `createShippingAddress(data)`   |
| Atualizar     | `update{Entidade}{Campo}` | `updateOrderStatus(id, status)` |
| Deletar       | `delete{Entidade}`        | `deleteCartByUserId(userId)`    |

---
