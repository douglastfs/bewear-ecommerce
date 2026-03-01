---
description: Padrões e diretrizes para criar Atualizações Otimistas de Interface (Optimistic UI) com caching manual 0ms em DB calls usando React Query + Proteção de Rotas com useIsMutating.
---

# Optimistic UI Mutations: Manipulação de Memória com Zero Latency

Para interfaces modernas que transacionam dados constantemente (exemplo: aumentar e diminuir produtos do carrinho repetidas vezes), aguardar a viagem completa do sinal ao banco de dados cria um "lag de input" perceptivo, resultando em cliques frustrantes (o app parece lerdo) e, por consequência, double/triple calls prejudiciais para recursos de servidor.

Esta skill estabelece a arquitetura-mestra para ludibriar o cérebro humano usando Atualizações Otimistas (Optimistic Updates) nativas do TanStack Query, que reescrevem os pixels na tela do usuário no exato milissegundo em que ocorre o clique, tratando o Backend via Sync Background invisível com auto-rollback em cenários de quebra.

---

## 🏗️ 1. Princípio Otimista com Quarteto Redutor (Centralizing Context)

O `onMutate` nativo do React Query é espetacular mas altamente verboso em sua essência. Toda mutação otimista precisa dos 4 cavaleiros obrigatórios:

1. `cancelQueries()` -- Pausa requests em andamento que podem pisar no cache recente.
2. `getQueryData()` -- Tira o Snapshot de Fallback do estado atual ("rollback" em caso do DB retornar erro de conexão / bug).
3. `setQueryData()` -- Reescreve o JSON vivo em memória RAM instantaneamente (a tela re-renderiza em 0ms).
4. `Context Return` -- Empacota pra garantir que `onError` reviva a tela antiga se o backend travar.

### ❌ Anti-Pattern: Propagar Quarteto Dentro dos Próprios Hooks da UI

Não escreva as quatro partes manualmente direto num Componente `.tsx` nem solto pelo hook. Isso infla letalmente o handler (`> 70 linhas`) se repetindo por `useIncrease`, `useDecrease`, `useRemove`.

### ✅ Good Practice: Factory de Abstração Caching

Agrupe a "Ação do usuário" num Utilitário puro de typescript.

```ts
// src/hooks/mutations/cart-optimistic-update.ts
import { QueryClient } from "@tanstack/react-query";

export const updateCartCacheOptimistically = async ({
  queryClient,
  action,
  targetId,
}: {
  queryClient: QueryClient;
  action: "INCREASE" | "DECREASE";
  targetId: string;
}) => {
  // 1. Congelar tempo
  await queryClient.cancelQueries({ queryKey: getUseCartQueryKey() });

  // 2. Snapshot
  const previousCart =
    queryClient.getQueryData<CartQueryData>(getUseCartQueryKey());

  // 3. Mutação Falsa em RAM
  queryClient.setQueryData<CartQueryData>(
    getUseCartQueryKey(),
    (old: CartQueryData | undefined) => {
      if (!old) return old;

      let newItems = [...old.items];

      if (action === "INCREASE") {
        newItems = newItems.map(item =>
          item.productVariantId === targetId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // ... outras ações de filtro / decrease

      return { ...old, items: newItems };
    }
  );

  return { previousCart };
};
```

Com o Utilitário forjado, o código que o front-end chama morre assim (Clean Code Level Ultra):

```ts
// src/hooks/mutations/use-increase.ts
export const useIncreaseCartProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => addProductToDatabase({ id, quantity: 1 }), // <--- DB Async (demorado)
    onMutate: () =>
      updateCartCacheOptimistically({
        queryClient,
        action: "INCREASE",
        targetId: id,
      }), // <--- RAM imediato
    onError: (_err, _var, context) =>
      rollbackCartCache(queryClient, context as any),
    onSettled: () => syncCartCache(queryClient),
  });
};
```

---

## 🛡️ 2. Proteção de Rota (Guarding the Checkout Escape)

Resolver o clique `0ms` abre a Porta de Pandora para um novo abismo lógico profundo de UX: **A Evasão Falsa de Subtotal** (The Phantom Basket Trap).

Quando a pessoa clicar `+` cinco vezes nas calças super rápidas (como a tela dela vai obedecer instantaneamente), ela tentaria "fugir" clicando no megabotão de Checkout para gerar nota fiscal... **Antes** da chamada paralela de Database ser computada. Com Next.js Server Components, a aba de Pagamento puxaria o carrinho desatualizado.

Para lidar com os mutantes otimistas, utilize interceptação `useIsMutating` travando Avanços em funis cruciais.

### ✅ Passos para Blindar o Botão com "Olheiro de Background":

1. Instancie contadores de rastreio espiando estritamente suas Key de Mutations baseadas na árvore de ação.

```tsx
import { useIsMutating } from "@tanstack/react-query";

const CartSummaryCard = () => {
    // Escutando as keys de add-cart e remove-cart
    const isAdding = useIsMutating({ mutationKey: ["add-cart-product"] });
    const isRemoving = useIsMutating({ mutationKey: ["remove-cart-product"] });

    // Qualquer número > 0 indicará 1+ mutações correndo no fundo escuro.
    const isCartMutating = isAdding > 0 || isRemoving > 0;

    return (
       ...
       {/* Bloqueador de Navigational Flow */}
        {isCartMutating ? (
          <Button disabled className="animate-pulse">
            <Loader2 className="mr-2 animate-spin" />
            Atualizando...
          </Button>
        ) : (
          <Button asChild>
            <Link href="/checkout">Finalizar</Link>
          </Button>
        )}
    )
}
```

O efeito mágico desta arquitetura composta (Optimistic Memory Fake + Mutating Guard) criará o aplicativo 10-estrelas perfeito:
Onde clicar num contador fará um número subir agressivamente sem carregar rodelas.
Mas tentar fugir com o dado sem aprovação trava a navegação numa experiência controlada por você.

**Resumo de Ouro**: Interface interativa Livre, Pipeline Financeira/Crítica Lacrada por `IsMutating(0)`.
