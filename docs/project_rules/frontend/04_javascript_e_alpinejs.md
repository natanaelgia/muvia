# 04 — JavaScript e Alpine.js

## Quando usar JavaScript

- Priorizar SSR com Edge para renderização inicial.
- Usar JavaScript apenas para:
  - interações dinâmicas (modais, dropdowns, tooltips)
  - validação client-side complementar
  - animações e transições
  - comunicação assíncrona (AJAX/fetch) quando SSR não for viável

## Alpine.js

### Quando usar

- Componentes com estado local simples (ex.: toggle, dropdown).
- Interações que não justificam um framework completo.
- Manipulação de visibilidade e classes CSS dinâmicas.

### Padrões

- Usar `x-data` inline nos elementos HTML, não em arquivos separados.
- Manter expressões curtas dentro de `x-data`; extrair lógica complexa para funções globais.
- Nomear funções no escopo global com prefixo do contexto (ex.: `modalOpen()`, `dropdownToggle()`).

### Exemplo de componente

```html
<div x-data="{ open: false }">
  <button @click="open = !open" :aria-expanded="open">
    Menu
  </button>
  <div x-show="open" @click.outside="open = false">
    <!-- conteúdo do dropdown -->
  </div>
</div>
```

## Validação client-side

- Validação client-side é complementar; validação server-side é obrigatória.
- Usar HTML5 validation attributes (`required`, `pattern`, `minlength`, etc.).
- Alpine.js pode ser usado para feedback visual em tempo real.
- Mensagens de erro devem ser consistentes com as do servidor.

## Comunicação assíncrona

- Preferir form submissions normais (SSR) quando possível.
- Usar `fetch()` ou `XMLHttpRequest` para:
  - uploads de arquivo com progresso
  - busca em tempo real (autocomplete)
  - atualizações parciais sem reload

### Padrão de requisições

- Incluir CSRF token em requisições POST/PUT/DELETE.
- Tratar loading states e erros de rede.
- Exibir feedback visual para o usuário.

## Performance

- Carregar JavaScript de forma assíncrona (`defer` ou `type="module"`).
- Evitar JavaScript inline grande; preferir arquivos separados.
- Minimizar uso de `x-init` com lógica complexa.
- Lazy-load de recursos quando aplicável (ex.: imagens com `loading="lazy"`).

## Acessibilidade com JavaScript

- Manter foco visível em elementos interativos.
- Usar `aria-*` attributes para componentes dinâmicos.
- Garantir que modais trapem foco corretamente.
- Fornecer alternativas para funcionalidades JavaScript-dependent.
