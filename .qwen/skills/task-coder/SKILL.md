---
name: task-coder
description: Analisa e implementa tasks do MVP baseado em arquivos .md em docs/product_analysis/tasks/. Sempre consulta docs/project_rules/ antes de qualquer alteração de código. Use quando o usuário pedir para implementar uma task, executar uma tarefa do roadmap, ou mencionar tasks como T001, T002, etc.
---

# Task Coder

Skill para análise e implementação de tasks do roadmap do Muvia com base na documentação de produto e regras do projeto.

## Fluxo de Execução

Quando ativada, esta skill DEVE seguir obrigatoriamente os passos abaixo:

### Passo 1 — Identificar a Task

1. Se o usuário mencionou um nome de arquivo `.md` (ex: `T001.md`), ler o arquivo em `docs/product_analysis/tasks/<nome>.md`
2. Se o usuário mencionou apenas um ID (ex: `T002`), buscar o arquivo correspondente em `docs/product_analysis/tasks/`
3. Se nenhum arquivo for encontrado, informar o usuário e listar as tasks disponíveis

### Passo 2 — Analizar a Task

1. Ler completamente o arquivo da task
2. Identificar:
   - **Objetivo** da task
   - **Critérios de aceite**
   - **Dependências** de outras tasks
   - **Passos de implementação** listados
   - **Tags** (backend, frontend, devops, etc.)
3. Verificar o **status** atual — se já foi parcialmente ou totalmente concluída

### Passo 3 — Consultar Project Rules (OBRIGATÓRIO)

**ANTES de qualquer alteração de código**, consultar as regras do projeto:

| Regra | Arquivo |
|-------|---------|
| Backend (arquitetura, controllers, services, models, validações, banco de dados, middlewares, rotas, testes, segurança, TypeScript/API v7, estrutura de pastas, HMR) | `docs/project_rules/backend.md` |
| Edge Templates (layouts como componentes, autenticação, rotas, CSRF, flash messages, componentes, assets, páginas de erro, HMR, limpeza de templates) | `docs/project_rules/edge_templates.md` |
| Frontend (UI/UX, design system, branding, Alpine.js, componentes, navegação, copy) | `docs/project_rules/frontend/` |
| Índice geral e checklist | `docs/project_rules/index.md` |

**Regras críticas que NUNCA podem ser violadas:**

1. **Nomenclatura de arquivos backend:** CamelCase igual ao nome da classe (ex: `UserService.ts`, NÃO `user_service.ts`)
2. **Estrutura de pastas:** NUNCA criar pastas duplicadas na raiz. Usar `app/adapters/`, `app/dtos/`, `app/services/`, etc.
3. **Edge layouts:** Layouts são componentes em `resources/views/components/layout.edge`. NUNCA usar `resources/views/layouts/` para o layout principal.
4. **`@layout()` sem parâmetro:** Edge.js v7 resolve automaticamente para `components/layout.edge`
5. **Autenticação nos templates:** Usar `@if(auth.user)` ao invés de `@loggedIn`/`@guest`
6. **Campo do modelo User:** É `fullName`, não `name`
7. **Rotas nomeadas:** TODAS as rotas referenciadas por `route('nome')` devem ter `.as('nome')`
8. **CSRF:** Sempre `{{ csrfField() }}` em formulários POST/PUT/PATCH/DELETE
9. **Redirects:** Usar `response.redirect('/path')`, NÃO `response.redirect().toRoute()`
10. **Paths de arquivos:** Usar `app.makePath()`, NÃO `new URL()`
11. **Sections no layout:** EVITAR `@section` no layout principal. Preferir interpolação direta `{{ title ?? 'Muvia' }}`
12. **Logging:** Formato `Classe.metodo - mensagem`. Usar `logger.error`, `logger.warn`, `logger.info`, `logger.debug`

### Passo 4 — Planejar Implementação

1. Criar um TODO list com todas as ações necessárias
2. Priorizar baseado nas dependências da task
3. Identificar arquivos que precisam ser criados vs modificados
4. Verificar se há tasks anteriores que precisam estar concluídas primeiro

### Passo 5 — Executar Implementação

1. Executar cada item do TODO list sequencialmente
2. **SEMPRE consultar as project rules antes de criar/modificar qualquer arquivo**
3. Após cada modificação, verificar conformidade com as regras
4. Manter o usuário informado do progresso

### Passo 6 — Verificação Final

1. Executar `npm run typecheck` — deve passar sem erros
2. Executar `npm run lint` — deve passar sem erros
3. Verificar se a implementação atende todos os critérios de aceite da task
4. Se aplicável, testar manualmente com `npm run dev`

### Passo 7 — Atualizar Documentação da Task

1. Se a task foi implementada, atualizar o arquivo `.md` da task com:
   - Novo status (`✅ Concluído`)
   - Resumo do que foi feito
   - Problemas encontrados e soluções (se houver)
2. Commit as alterações (apenas após aprovação do usuário)

## Anti-Patterns (NUNCA FAZER)

- ❌ Criar pastas como `appadapters/`, `appdtos/`, `appservicesauth/` na raiz do projeto
- ❌ Usar `resources/views/layouts/main.edge` como layout principal
- ❌ Usar `@layout('layouts/main')` — usar `@layout()` sem parâmetro
- ❌ Usar `@loggedIn` / `@guest` nos templates — usar `@if(auth.user)`
- ❌ Usar `auth.user.name` — o campo é `fullName`
- ❌ Criar rotas sem `.as('nome')` se forem referenciadas por `route()`
- ❌ Usar `response.redirect().toRoute()` — usar `response.redirect('/path')`
- ❌ Usar `new URL()` para paths de arquivo — usar `app.makePath()`
- ❌ Usar `@section('head')` / `@section('scripts')` no layout principal
- ❌ Colocar regra de negócio em controllers
- ❌ Validar dados diretamente na controller — usar services + VineJS
- ❌ Usar `any` no TypeScript — tipar corretamente
- ❌ Logar dados sensíveis (password, tokens, `request.all()`)
- ❌ Commitar `.env` ou secrets

## Checklist de Nova Funcionalidade

### Backend
- [ ] Controller com nome em CamelCase (ex: `DemandasController.ts`)
- [ ] Service com regra de negócio em `app/services/`
- [ ] Validação com VineJS em `app/validators/`
- [ ] Model em `app/models/` com timestamps
- [ ] Rota nomeada com `.as('nome')`
- [ ] Logging com formato `Classe.metodo - mensagem`

### Frontend
- [ ] Página usa `@layout()` (resolve para `components/layout.edge`)
- [ ] Template usa `@if(auth.user)` ao invés de `@loggedIn`/`@guest`
- [ ] Formulários com `{{ csrfField() }}`
- [ ] Rotas referenciadas com `route('nome')`
- [ ] Flash messages com Alpine.js (`x-data="alert"`)
- [ ] Sem `@section` no layout principal

## Exemplos de Uso

### Exemplo 1: Implementar task existente
```
Usuário: "Implemente a task T002"
Ação da skill:
1. Ler docs/product_analysis/tasks/T002.md
2. Consultar docs/project_rules/
3. Criar TODO list baseado nos passos da task
4. Implementar seguindo as rules
5. Atualizar T002.md com o resultado
```

### Exemplo 2: Analisar task sem implementar
```
Usuário: "Analise a task T003 e me diga o que precisa ser feito"
Ação da skill:
1. Ler docs/product_analysis/tasks/T003.md
2. Consultar docs/project_rules/ para contexto
3. Listar passos necessários
4. Identificar dependências de tasks anteriores
```

### Exemplo 3: Task não documentada
```
Usuário: "Crie uma task para implementar pagamentos"
Ação da skill:
1. Verificar se já existe task relacionada em docs/product_analysis/tasks/
2. Se não existir, criar novo arquivo .md com estrutura padrão de task
3. Incluir: resumo, objetivo, critérios de aceite, passos, estimativa
```

## Referências

- Tasks: `docs/product_analysis/tasks/`
- Project Rules: `docs/project_rules/`
- Backend Rules: `docs/project_rules/backend.md`
- Edge Templates: `docs/project_rules/edge_templates.md`
- Frontend: `docs/project_rules/frontend/`
- Index: `docs/project_rules/index.md`
