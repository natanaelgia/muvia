# Regras do Projeto (Muvia) — Edge Templates & Views

## 01 — Estrutura de Views

### Organização de pastas

- Views ficam em `resources/views/`.
- **NÃO criar** pasta `resources/views/layouts/` — layouts são componentes.
- Estrutura padrão:
  ```
  resources/views/
  ├── components/        ← Layouts e componentes reutilizáveis
  │   ├── layout.edge    ← Layout principal (obrigatório)
  │   └── ...
  ├── pages/             ← Páginas por feature
  │   ├── auth/
  │   ├── errors/
  │   └── ...
  ├── partials/          ← Partials compartilhados
  └── emails/            ← Templates de email
  ```

### Nomenclatura

- Arquivos Edge: `snake_case.edge` (ex.: `login.edge`, `not_found.edge`).
- Pastas de páginas: nome da feature em `snake_case` ou `kebab-case`.
- Componentes: nome descritivo em `snake_case` (ex.: `button.edge`, `alert_root.edge`).

## 02 — Layouts como Componentes

### Regra fundamental

No AdonisJS v7 com Edge.js v6+, **layouts são componentes**, não templates tradicionais.

- `@layout()` sem parâmetro → resolve automaticamente para `resources/views/components/layout.edge`
- **NÃO usar** `@layout('caminho/completo')` — o Edge resolve automaticamente
- O conteúdo da página é injetado no layout via `{{{ await $slots.main() }}}`

### Exemplo correto de página

```edge
@layout()
  <h1>Minha Página</h1>
  <p>Conteúdo aqui</p>
@end
```

### Exemplo correto de layout (`components/layout.edge`)

```edge
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrfToken }}">
  <title>{{ title ?? 'Muvia' }}</title>
  @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
  <main>
    {{{ await $slots.main() }}}
  </main>
</body>
</html>
```

### O que EVITAR no layout principal

- ❌ `@section('head')` / `@section('scripts')` — podem renderizar como texto puro
- ❌ `@section('title', 'Muvia')` — preferir `{{ title ?? 'Muvia' }}`
- ❌ Lógica complexa de autenticação com `@loggedIn` / `@guest`

### O que USAR no layout principal

- ✅ `{{ title ?? 'Muvia' }}` para título dinâmico
- ✅ `@if(auth.user)` para verificação de autenticação
- ✅ `{{{ await $slots.main() }}}` para injetar conteúdo da página
- ✅ `@vite()` para assets
- ✅ `{{ csrfToken }}` e `{{ csrfField() }}` para CSRF

## 03 — Autenticação nos Templates

### Verificação de usuário logado

**NÃO usar:**
```edge
@loggedIn
  Olá, {{ auth.user.name }}
@end
@guest
  Visitante
@end
```

**USAR:**
```edge
@if(auth.user)
  Olá, {{ auth.user.fullName ?? auth.user.email.split('@')[0] }}
@else
  Visitante
@endif
```

### Razões

1. `@loggedIn` / `@guest` não funcionam corretamente no contexto de layout como componente
2. O campo no modelo User é `fullName`, não `name`
3. Usar fallback com `??` para quando `fullName` é null

### Silent Auth Middleware

- O `silent_auth_middleware` está configurado globalmente
- Executa `auth.check()` que inicializa `auth.user` (será `null` se não logado)
- Templates podem verificar `@if(auth.user)` com segurança

## 04 — Rotas nos Templates

### Nomeação obrigatória

**TODAS** as rotas que serão referenciadas por `route('nome')` nos templates devem ter nome definido:

```ts
// Correto
router.get('login', [controllers.Session, 'create']).as('login')
router.post('logout', [controllers.Session, 'destroy']).as('logout')

// Incorreto (causa erro "Cannot lookup route")
router.get('login', [controllers.Session, 'create'])
```

### Uso nos templates

```edge
<a href="{{ route('login') }}">Entrar</a>
<form action="{{ route('logout') }}" method="POST">
  {{ csrfField() }}
  <button type="submit">Sair</button>
</form>
```

### Rotas padrão do Muvia

| Rota | Nome | Método |
|------|------|--------|
| `/` | `home` | GET |
| `/login` | `login` | GET |
| `/signup` | `signup` | GET |
| `/logout` | `logout` | POST |

## 05 — CSRF Protection

### Formulários

**SEMPRE** incluir `{{ csrfField() }}` em formulários POST/PUT/PATCH/DELETE:

```edge
<form action="/login" method="POST">
  {{ csrfField() }}
  <!-- campos -->
  <button type="submit">Enviar</button>
</form>
```

### Meta tag para JavaScript

```edge
<head>
  <meta name="csrf-token" content="{{ csrfToken }}">
</head>
```

### Configuração

- CSRF está configurado em `config/shield.ts`
- Habilitado para: `POST`, `PUT`, `PATCH`, `DELETE`
- `enableXsrfCookie: false` (não necessário para SSR puro)

## 06 — Flash Messages

### Exibição no layout

```edge
@if (flashMessages.has('success'))
  <div class="alert alert-success" x-data="alert" x-show="isVisible" x-cloak>
    {{ flashMessages.get('success') }}
    <button type="button" class="btn-close" @click="dismiss"></button>
  </div>
@end

@if (flashMessages.has('error'))
  <div class="alert alert-danger" x-data="alert" x-show="isVisible" x-cloak>
    {{ flashMessages.get('error') }}
    <button type="button" class="btn-close" @click="dismiss"></button>
  </div>
@end
```

### Alpine.js para auto-dismiss

O componente `alert` já está configurado em `resources/js/app.js`:

```js
Alpine.data('alert', function () {
  return {
    isVisible: false,
    dismiss() { this.isVisible = false },
    init() {
      setTimeout(() => { this.isVisible = true }, 80)
      setTimeout(() => { this.dismiss() }, 5000)
    },
  }
})
```

### Uso nos controllers

```ts
// Definir flash message
session.flash('success', 'Operação realizada com sucesso!')
session.flash('error', 'Erro ao processar solicitação.')

// Redirect com flash
response.redirect('/login').flashMessage('success', 'Login realizado!')
```

## 07 — Componentes Edge

### Estrutura de componentes

Componentes reutilizáveis ficam em `resources/views/components/`:

```
components/
├── alert/
│   ├── root.edge
│   ├── title.edge
│   └── description.edge
├── avatar.edge
├── button.edge
├── checkbox/
│   ├── control.edge
│   └── group.edge
├── field/
│   ├── root.edge
│   ├── label.edge
│   └── error.edge
├── form/
│   └── index.edge
├── input/
│   └── control.edge
├── link.edge
├── radio/
│   ├── control.edge
│   └── group.edge
├── select/
│   └── control.edge
└── textarea/
    └── control.edge
```

### Uso de componentes

```edge
@!button({ text: 'Enviar', type: 'submit' })
@!link({ route: 'login', text: 'Entrar' })
@!avatar({ initials: auth.user.initials })
```

### Nomenclatura de componentes

- `root.edge` — componente principal de um grupo (ex.: `alert/root.edge`)
- `control.edge` — elemento de controle (input, checkbox, etc.)
- `label.edge`, `error.edge` — elementos auxiliares de formulário

## 08 — Frontend Assets (Vite + Bootstrap + Alpine.js)

### CSS (`resources/css/app.css`)

```css
@import 'bootstrap/dist/css/bootstrap.min.css';

:root {
  --muvia-primary: #2563eb;
  --muvia-secondary: #64748b;
  --muvia-success: #22c55e;
  --muvia-danger: #ef4444;
  --muvia-warning: #f59e0b;
}
```

### JavaScript (`resources/js/app.js`)

```js
import Alpine from 'alpinejs'
import * as bootstrap from 'bootstrap'

// Alpine components...
Alpine.start()
```

### Vite config

- Entry points: `resources/css/app.css` e `resources/js/app.js`
- Hot reload configurado para templates Edge
- Assets compilados servidos via middleware

## 09 — Páginas de Erro

### Templates obrigatórios

- `resources/views/pages/errors/not_found.edge` — erro 404
- `resources/views/pages/errors/server_error.edge` — erro 500

### Estrutura padrão

```edge
@layout()
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6 text-center">
        <h1 class="display-1 fw-bold text-muted">404</h1>
        <h2>Página não encontrada</h2>
        <p>A página que você procura não existe ou foi removida.</p>
        <a href="{{ route('home') }}" class="btn btn-muvia">Voltar ao início</a>
      </div>
    </div>
  </div>
@end
```

### Handler

- Configurado em `app/exceptions/handler.ts`
- `renderStatusPages = app.inProduction` (apenas em produção)
- Status codes: `404` e `500..599`

## 10 — HMR e Desenvolvimento

### Hot Module Replacement

- `npm run dev` usa `--hmr` para hot reload
- Controllers e middleware: hot reload automático
- Templates Edge: hot reload via Vite
- Assets CSS/JS: hot reload via Vite

### Quando reiniciar o servidor

**Reiniciar manualmente** (`npm run dev`) quando:
- Adicionar/remover arquivos Edge
- Alterar estrutura de pastas
- Modificar `vite.config.ts`
- Mudar import aliases no `package.json`
- HMR não reconhecer mudanças após 5+ segundos

## 11 — Limpeza de Templates

### Remover templates de template do AdonisJS

Ao inicializar um projeto, remover imediatamente:
- `resources/views/pages/welcome.edge` (ou `home.edge` genérico)
- `resources/views/partials/header.edge` (se duplicado pelo layout)
- Qualquer componente genérico do AdonisJS não customizado

### Substituir por templates do Muvia

- Criar páginas customizadas para cada feature
- Usar componentes Edge do Muvia (`@!button`, `@!link`, etc.)
- Seguir design system e branding definidos

## 12 — Estrutura do Projeto (Pastas)

### Regra de ouro

**NUNCA** criar pastas duplicadas na raiz do projeto. Usar sempre a estrutura padrão do AdonisJS:

| ❌ Não Fazer | ✅ Fazer |
|-------------|----------|
| `appadapters/` na raiz | `app/adapters/` |
| `appdtos/` na raiz | `app/dtos/` |
| `appservicesauth/` na raiz | `app/services/auth/` |
| `databaseseeders/` na raiz | `database/seeders/` |
| `resourcesviewscomponents/` na raiz | `resources/views/components/` |

### Pastas válidas na raiz

- `app/`, `bin/`, `config/`, `database/`, `docs/`, `logs/`, `public/`, `resources/`, `start/`, `tests/`, `tmp/`
- Arquivos de configuração: `.env`, `.gitignore`, `ace.js`, `adonisrc.ts`, `package.json`, `tsconfig.json`, `vite.config.ts`

### Pastas temporárias (ignoradas pelo git)

- `logs/` — logs de produção (ignorado, exceto `.gitkeep`)
- `tmp/` — uploads temporários (ignorado, exceto `.gitkeep`)
