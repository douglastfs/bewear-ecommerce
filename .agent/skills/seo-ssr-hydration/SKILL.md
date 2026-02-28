---
description: Padrões e diretrizes completas para auditoria e aplicação de Server-Side Rendering (SSR), Hidratação do React Query e otimização de SEO (LCP).
---

# SEO, SSR & Hydration Guidelines

Sempre que a tarefa envolver a melhoria de performance inicial, redução de "flickering" (piscar de carregamento) na UI ou aprimoramento do SEO e das métricas de Core Web Vitals (ex: LCP), siga rigidamente os tópicos deste documento.

## 1. Hidratação do React Query (SSR para CSR)

A aplicação utiliza `@tanstack/react-query` para gerenciamento de fetch e cache. Não restrinja as chamadas da API exclusivamente para o Client-Side (disparando apenas após a montagem do componente, o que causa layout drops e flickering). Sempre que os dados forem públicos ou necessários para o layout estrutural:

### Como fazer:

1. **Busca no Server Component:** Em arquivos Page ou Layout (SSR - `app/page.tsx`, `app/layout.tsx`), você tem liberdade total para instanciar a chamada original assíncrona da Data Access Layer (DAL) (ex: `await getCategories()`).
2. **Setup do Hook:** Certifique-se de que o hook customizado da query correspondente possua a opção `initialData` na sua assinatura.

```typescript
// Exemplo no Hooks de Query /hooks/queries/use-x.ts
export const useCategories = (params?: { initialData?: Category[] }) => {
  return useQuery({
    queryKey: getUseCategoriesQueryKey(),
    queryFn: () => fetchCategories(),
    initialData: params?.initialData, // Injeção Crítica!
  });
};
```

3. **Passagem de Prop:** Desça o resultado obtido do servidor como parâmetro/prop (ex: `children` ou diretamente na prop principal `categories={categories_do_servidor}`) para o componente cliente que abriga a UI de exibição.
4. **Alimentação Inicial:** No componente de Client (`"use client";`), injete a prop na inicialização do hook:

```typescript
const Navbar = ({ initialCategories }) => {
  const { data: categories } = useCategories({
    initialData: initialCategories,
  });
  // Renderiza de imediato sem delay ou flickering!
};
```

## 2. Largest Contentful Paint (LCP) e Banners

A primeira imagem ou bloco de texto visível na tela (Above the Fold) é a de maior peso para o SEO do Google. O Next.js nativamente aplica _lazy-loading_ em todas as tags `<Image />`, o que estraga o LCP se a imagem for a Hero principal da página.

### Como auditar:

1. Busque por `<Image>` em componentes de cabeçalho, Banners Centrais de Homepage e Imagens destaque de Produtos na tela PDP (Product Detail Page).
2. Se a imagem é renderizada assim que o usuário abre o site sem realizar scroll, **ela é crítica**.

### Como corrigir:

Injete `priority={true}` explícito na tag `<Image>` das imagens principais. Isso obrigará o framework a ejetar conexões `preload` no `<head>` do Documento Root, renderizando ela visualmente instantaneamente para os crawlers de buscadores.

## 3. Identificação de Antipatterns SEO

- Evite `useEffect` encadeado apenas para buscar dados estáticos que seriam idênticos para todos os visitantes da rota. Mova para Server Components e repasse por Props e Hydration (Regra 1).
- Evite usar fundos ou banners via CSS (`background-image`) se aquele banner é crucial contextualmente para o produto (neste caso, troque para o componente `<Image />` nativo).

## 4. Checklist Rápido de Refatoração

Sempre que pedirem um "SEO/SSR Scan", valide:

- [ ] O Header e Footer que derivam de DB estão recebendo carga em `layout.tsx` e fazendo pass-down?
- [ ] `useCategories`, `useCart` (_se couber SSR_), e demais hooks globais têm a porta de `initialData` liberada?
- [ ] Banners (`HeroBanner`, `Carousels` visíveis on-mount) têm suas imagens master carregando na propriedade `priority` do Next.js?
