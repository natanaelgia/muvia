# 03 — Design System (tokens e regras)

## Tokens

### Cores
- `--color-bg`: `#F8FAFC`
- `--color-surface`: `#FFFFFF`
- `--color-text`: `#0F172A`
- `--color-text-muted`: `#334155`
- `--color-border`: `#E2E8F0`
- `--color-primary`: `#0EA5A5`
- `--color-accent`: `#F59E0B`
- `--color-danger`: `#DC2626`
- `--color-success`: `#16A34A`

Mapeamento para Bootstrap (via CSS variables):
- `--bs-body-bg`, `--bs-body-color`
- `--bs-border-color`
- `--bs-primary`, `--bs-link-color`, `--bs-link-hover-color`
- `--bs-success`, `--bs-danger`, `--bs-warning`, `--bs-info`

### Espaçamento
Usar escala Bootstrap e padronizar:
- Pequeno: `0.25rem` / `0.5rem`
- Médio: `1rem`
- Grande: `1.5rem` / `2rem`

### Bordas e radius
- Bordas: `1px` com `--color-border`
- Radius:
  - pequeno: `0.5rem`
  - médio: `0.75rem`

### Sombras
- Cards/menus: sombra leve e consistente (evitar “pesado”).

## Estados e feedback

### Botões
- Primário: ação principal da tela (apenas 1 por seção).
- Secundário/outline: ações alternativas.
- Perigo: ações destrutivas (logout, cancelar, reprovar).

### Loading
- Preferir estados locais (botão “Carregando…”) e skeleton em listas.
- Evitar spinners globais que bloqueiem a tela inteira.

### Estados vazios
- Sempre mostrar:
  - o que falta (ex.: “Ainda não há propostas”)
  - a próxima ação (ex.: “Publicar demanda”)

### Erros
- Erro funcional: mensagem curta e acionável para o usuário.
- Erro inesperado: mensagem genérica para o usuário; detalhes apenas em logs.

## Acessibilidade (mínimo)
- Foco visível em links/botões/inputs.
- Labels sempre presentes em inputs (sem placeholder como único rótulo).
- Contraste mínimo adequado em textos e botões.
- Mensagens de erro/sucesso anunciáveis e posicionadas acima do formulário.
