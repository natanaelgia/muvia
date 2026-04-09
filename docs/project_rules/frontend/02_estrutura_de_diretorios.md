# 02 — Estrutura de Diretórios

## Visão geral

O frontend do Muvia segue a estrutura padrão do AdonisJS com Edge templates.

## Organização

```
resources/
├── css/
│   └── app.css              # Estilos globais e customizações
├── js/
│   └── app.js               # JavaScript global e inicializações
├── views/
│   ├── components/          # Componentes Edge reutilizáveis
│   ├── layouts/             # Layouts base (ex.: main.edge)
│   ├── pages/               # Páginas da aplicação
│   │   ├── errors/          # Páginas de erro (404, 500)
│   │   └── ...              # Páginas por contexto
│   └── main.edge            # Layout principal
└── images/
    └── logo.png             # Logo do projeto
```

## Páginas

- Cada página deve ter seu próprio arquivo `.edge` em `resources/views/pages/`.
- Páginas de funcionalidades relacionadas podem ficar em subdiretórios (ex.: `pages/account/`).
- Nomeclatura: snake_case para arquivos (ex.: `my_account.edge`).

## Componentes

- Componentes ficam em `resources/views/components/`.
- Nomeclatura: snake_case descritivo (ex.: `flash_messages.edge`, `empty_state.edge`).
- Componentes devem ser genéricos o suficiente para reutilização.
- Evitar lógica complexa dentro de componentes; preferir props simples.

## Layouts

- O layout principal (`main.edge`) define a estrutura base de todas as páginas.
- Layouts alternativos devem ficar em `resources/views/layouts/`.
- Layouts devem incluir: header, main content area, footer.

## CSS e JavaScript

- CSS global em `resources/css/app.css`.
- Tokens de design system devem ser definidos como CSS variables.
- JavaScript global em `resources/js/app.js`.
- Interações específicas devem usar Alpine.js inline nos componentes.
