---
name: refactor-shadcn
description: Analisar código existente e identificar oportunidades de refatoração usando componentes shadcn/ui, tornando o código mais simples, legível e consistente com o design system
---

# Skill: Refatoração com shadcn/ui

## Objetivo

Analisar o código de um ou mais arquivos/componentes e identificar onde **componentes do shadcn/ui** podem substituir implementações manuais, simplificando o código, melhorando acessibilidade e mantendo consistência visual com o design system do projeto.

---

## Quando usar

- Após implementar uma feature nova e querer polir o código
- Ao encontrar componentes com lógica de UI complexa feita manualmente
- Ao revisar código que poderia usar primitivos já disponíveis
- `/refactor-shadcn`

---

## Passo a passo

### 1. Levantar componentes shadcn/ui instalados

Verificar o que já está disponível em `src/components/ui/`:

```bash
ls src/components/ui/
```

### 2. Consultar o registro shadcn/ui

Usar as ferramentas MCP do shadcn para pesquisar componentes disponíveis:

- `mcp_shadcn_get_project_registries` — ver registros configurados
- `mcp_shadcn_search_items_in_registries` — buscar componentes por nome ou caso de uso
- `mcp_shadcn_view_items_in_registries` — ver código-fonte e exemplos de um componente
- `mcp_shadcn_get_item_examples_from_registries` — ver demos de uso

**Sempre verificar antes de recomendar** se o componente existe no registro `@shadcn`.

### 3. Analisar o código-alvo

Para cada arquivo/componente a ser analisado, verificar:

#### 3.1. Substituições diretas

Padrões manuais que têm equivalente shadcn/ui pronto:

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
| Input numérico com +/-              | `NumberInput` (padrão customizado)                 |
| Carrossel manual                    | `Carousel` (Embla)                                 |

#### 3.2. Composição e padrões

Verificar se o código pode ser melhorado com **composição** de shadcn/ui:

- **Variantes de Button**: ao invés de criar botões com classes inline diferentes, usar `variant` e `size` do `Button`
- **`cn()` utility**: garantir que toda merge de classes use `cn()` de `@/lib/utils`
- **Props de extensão**: componentes devem aceitar `className` para customização externa, usando `cn()` para merge
- **Consistência de spacing**: verificar se os espaçamentos seguem o design system (gap, padding)

#### 3.3. Acessibilidade

Componentes shadcn/ui incluem acessibilidade (ARIA, keyboard navigation) que implementações manuais frequentemente não têm:

- `<button>` sem `aria-label` → componente shadcn com a11y embutido
- Menus sem navegação por teclado → `DropdownMenu`, `NavigationMenu`
- Imagens sem texto alternativo adequado → verificar `alt` descritivo

### 4. Gerar relatório de refatoração

Para cada oportunidade identificada, documentar:

```markdown
### [Nome do componente/arquivo]

**Problema**: [Descrição do código atual]
**Solução**: [Componente shadcn/ui recomendado]
**Impacto**: 🟢 Baixo | 🟡 Médio | 🔴 Alto
**Justificativa**: [Por que vale a pena refatorar]

**Antes**:
\`\`\`tsx
// código atual
\`\`\`

**Depois**:
\`\`\`tsx
// código refatorado
\`\`\`
```

### 5. Classificar por prioridade

Ordenar as oportunidades:

1. **Impacto alto** — Reduz significativamente o código OU resolve um bug/accessibility issue
2. **Impacto médio** — Simplifica lógica mas funcionalidade já está ok
3. **Impacto baixo** — Melhoria cosmética/consistência

### 6. Instalar componente se necessário

Se um componente recomendado não está instalado, usar o MCP tool:

```
mcp_shadcn_get_add_command_for_items(["@shadcn/nome-do-componente"])
```

E executar o comando retornado.

### 7. Aplicar refatoração

- Fazer **um componente por vez**
- Testar no browser após cada mudança
- Manter o comportamento visual idêntico
- Preservar responsividade existente

---

## Regras importantes

1. **Nunca refatorar por refatorar** — só substituir se o componente shadcn/ui for genuinamente melhor (mais simples, mais acessível, ou mais consistente)
2. **Manter o visual** — a refatoração não deve alterar a aparência. Se o shadcn/ui tem estilo diferente do Figma, customizar via `className` ou variants
3. **Respeitar os padrões do projeto** — usar `cn()` para merge de classes, `import type` para tipos, aliases `@/`
4. **Não instalar tudo** — instalar apenas os componentes que serão efetivamente usados
5. **Documentar** — se a refatoração for significativa, explicar o "porquê" em comentário ou no PR

---

## Checklist antes de finalizar

- [ ] Verificou todos os arquivos do escopo solicitado
- [ ] Consultou o registro shadcn/ui para componentes disponíveis
- [ ] Cada sugestão tem código antes/depois
- [ ] Componentes necessários foram instalados
- [ ] Testou no browser após cada mudança
- [ ] Visual e comportamento mantidos
- [ ] Acessibilidade verificada

---

## Exemplo de uso

```
Usuário: "Roda a skill de refatoração shadcn nos componentes da PDP"

Ação:
1. Listar componentes instalados em src/components/ui/
2. Analisar src/app/product-variant/[slug]/ e seus components/
3. Pesquisar no registro shadcn componentes relevantes
4. Identificar: botões de quantidade manual → poderia usar ToggleGroup?
   thumbnails → poderia ser um Carousel vertical?
5. Gerar relatório com antes/depois para cada oportunidade
6. Aplicar as mudanças aprovadas pelo usuário
```
