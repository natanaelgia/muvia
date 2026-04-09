# 03 — Rotas e Navegação

## Rotas Edge

- Rotas que renderizam páginas ficam em `start/routes.ts`.
- Usar `route.makeUrl('nome_da_rota')` para gerar URLs nos templates.
- Nomear rotas importantes para facilitar navegação e redirects.

## Breadcrumbs

- Toda página interna deve ter breadcrumb com caminho navegável.
- Breadcrumb deve ficar no topo do conteúdo, abaixo do header.
- Formato: `Home > Seção > Página atual`.
- Página atual não deve ser clicável.

## Headers de página

- Cada página deve ter um H1 descritivo (apenas um por página).
- H1 deve refletir o propósito da página claramente.
- Subtítulos opcionais podem usar H3/H4.

## Navegação principal

- Menu no header com links para seções principais.
- Destacar item ativo no menu.
- Usuários logados devem ver opções adicionais (ex.: minha conta, logout).
- Usuários guests devem ver opções de login/signup.

## Redirecionamentos

- Após login: redirecionar para dashboard ou última página visitada.
- Após logout: redirecionar para home ou login.
- Após ações de formulário: redirecionar para página de detalhe ou listagem.
- Usar `session.flash()` para mensagens após redirect.

## Estados de navegação

- Manter estado de "página atual" consistente entre header e breadcrumb.
- URLs devem refletir o estado atual da navegação.
- Evitar navegação via JavaScript quando SSR resolve; preferir links normais.

## URLs amigáveis

- Usar kebab-case para URLs (ex.: `/movie-proposals`, `/my-account`).
- Evitar query params quando a rota pode ser semântica.
- Slugs devem ser legíveis e significativos.
