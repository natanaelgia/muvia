# 04 — Componentes

## Convenções
- Usar Bootstrap como base e encapsular padrões em componentes Edge em `resources/views/components/`.
- Manter nomes descritivos e API pequena (props simples).

## Componentes base

### Flash Messages
- Área única para mensagens no topo do conteúdo.
- Tipos:
  - `success`: sucesso
  - `error`: erro funcional
  - `warning`: alerta
  - `info`: informação

### Card
- Usar para agrupar blocos de conteúdo e dados resumidos.
- Header opcional e body consistente.

### Button
- Variantes: `primary`, `outline-primary`, `outline-secondary`, `outline-danger`.
- Evitar múltiplos botões `primary` no mesmo bloco.

### Input
- Sempre com label acima do input.
- Usar `type` apropriado (`email`, `password`, etc.).
- Hints opcionais abaixo.

### Empty State
- Título, descrição e ação principal.

## Componentes MVP (pré-definidos)

### Wizard/Steps
Para formulários multi-etapas (publicação):
- Cabeçalho com etapa atual e progresso.
- Botões “Voltar” e “Continuar”.
- Cada etapa deve ter um arquivo .edge uníco
