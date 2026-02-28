---
name: review-page
description: Reavaliar páginas já existentes no projeto, identificando oportunidades de refatoração para adequá-las ao padrão mais atualizado da skill create-page — corrigindo overengineering, antipatterns e inconsistências.
---

# Skill: Reavaliação de Páginas Existentes (Review Page)

## Objetivo

Analisar **páginas já criadas** do projeto e gerar um diagnóstico com sugestões de refatoração para adequá-las ao padrão definido na skill `create-page`. A reavaliação é prática e objetiva — foca em encontrar problemas reais, não em reescrever código que já funciona bem.

---

## 🔍 Como Usar

Quando acionada, esta skill deve:

1. **Listar todas as `page.tsx`** do projeto em `src/app/`
2. **Para cada página**, executar o checklist de auditoria abaixo
3. **Gerar um relatório** classificando cada página como ✅ OK, ⚠️ Ajuste menor, ou 🔴 Refatoração necessária
4. **Propor as correções** apenas para os itens que falharam — sem reescrever o que já está correto

---

## 📋 Checklist de Auditoria (por página)

### 1. Classificação de Perfil

- [ ] A página se encaixa em um dos 4 perfis (Pública / Pública com recurso / Pública com auth opcional / Protegida)?
- [ ] A proteção de auth está **adequada** ao perfil? (não falta onde deveria existir, não sobra onde é desnecessária)

### 2. Pipeline e Ordem

- [ ] O pipeline segue a ordem canônica? (metadata → auth → params → fetch → validação posse → transformação → render)
- [ ] `metadata` está exportado com `title` e `description` relevantes?

### 3. Antipatterns

- [ ] Não há `try/catch` envolvendo `redirect()` ou `notFound()`?
- [ ] Não há tipagem `any`?
- [ ] Dados vêm exclusivamente da DAL (`src/data-access/`)?

### 4. Overengineering

- [ ] Não há `useEffect` + `setMounted(true)` desnecessário? (verificar se `initialData` do React Query já resolve)
- [ ] Não há `useState` + `useEffect` para algo que uma prop simples do server resolve?
- [ ] Loading usa `<Loader2 />` em vez de `<div />` vazio?
- [ ] Client Component é **realmente necessário**? (se a página é apenas listagem/exibição, deveria ser 100% server)
- [ ] Imports não utilizados (`useEffect`, `useState`, etc.) foram limpos?

### 5. Performance

- [ ] Fetches independentes usam `Promise.all` em vez de `await` sequencial?
- [ ] Não há cálculos redundantes (ex: `totalPriceInCents` calculado em dois lugares diferentes)?

### 6. Tipagem e Interface

- [ ] `params` e `searchParams` estão tipados como `Promise<{...}>`?
- [ ] Props do Client Component usam `interface` tipada (não `any` ou genéricos vagos)?
- [ ] Tipos inferidos da DAL são reutilizados (ex: `ProductWithVariants`, `Awaited<ReturnType<typeof ...>>`)?

### 7. Layout e UX

- [ ] Listagens recorrentes possuem fallback? (seções como "Recomendados" não desaparecem)
- [ ] Não há oscilação de layout visível ao alterar estado?
- [ ] Componentes locais estão em `./components/` dentro da pasta da rota?

### 8. Conformidade com `general.mdc`

- [ ] Server Actions seguem o padrão `src/actions/{nome}/index.ts` + `schema.ts`?
- [ ] Hooks de query/mutation seguem `src/hooks/queries/` e `src/hooks/mutations/` com query keys exportadas?
- [ ] Preços manipulados em centavos e exibidos via `formatCentsToBRL`?
- [ ] Cores usam tokens do shadcn/Tailwind (sem hex hardcoded)?

### 9. Componentes shadcn/ui

- [ ] Há elementos de UI manuais que poderiam ser substituídos por componentes shadcn/ui? (consultar a tabela de substituições na skill `create-page`)
- [ ] `cn()` está sendo usado para merge de classes (não concatenação manual)?
- [ ] Componentes interativos possuem acessibilidade (ARIA, keyboard navigation)? Se não, verificar se há equivalente shadcn/ui.
- [ ] Ferramentas MCP do shadcn foram consultadas para buscar componentes disponíveis?

---

## 📊 Formato do Relatório

Ao concluir a auditoria, gere um relatório neste formato:

```markdown
# Auditoria de Páginas — [data]

## Resumo

| Página       | Perfil                   | Status         | Itens a corrigir               |
| ------------ | ------------------------ | -------------- | ------------------------------ |
| `/`          | Pública                  | ✅ OK          | —                              |
| `/cart`      | Pública c/ auth opcional | ⚠️ Ajuste      | metadata faltando em sub-rotas |
| `/my-orders` | Protegida                | 🔴 Refatoração | redirect inconsistente         |

## Detalhes por Página

### `/cart` — ⚠️ Ajuste menor

- **O que está bom:** pipeline correto, DAL, tipagem
- **O que precisa ajustar:** [descrição do problema e solução proposta]

### `/my-orders` — 🔴 Refatoração necessária

- **O que está bom:** auth check, listagem server-side
- **O que precisa refatorar:** [descrição e código proposto]
```

---

## ⚡ Regras de Conduta

1. **Não refatore o que já funciona bem.** Se a página está no padrão e não tem problemas, marque como ✅ e siga em frente.
2. **Priorize impacto.** 🔴 primeiro, ⚠️ depois. Não gaste tempo em ajustes cosméticos se há problemas de segurança ou tipagem.
3. **Proponha, não imponha.** O relatório apresenta sugestões — o usuário decide o que aplicar.
4. **Use a skill `create-page` como referência.** Toda sugestão deve apontar para o padrão documentado lá.
5. **Considere o histórico.** Se uma decisão foi tomada conscientemente (ex: `checkout/cancel` é placeholder), anote mas NÃO marque como erro.

---

📝 **Use essa skill periodicamente (ex: ao final de sprints) ou quando sentir que páginas antigas estão desalinhadas com os padrões atuais do projeto.**
