# Regras do Projeto — Muvia

## 📁 Estrutura

```
docs/project_rules/
├── backend.md              ← Regras do backend (AdonisJS)
├── edge_templates.md       ← Regras de templates Edge (Views)
└── frontend/               ← Regras do frontend (UI/UX)
    ├── 01_visao_geral.md
    ├── 02_estrutura_de_diretorios.md
    ├── 03_rotas_e_navegacao.md
    ├── 04_javascript_e_alpinejs.md
    ├── 05_branding.md
    ├── 06_design_system.md
    ├── 07_componentes.md
    └── 08_copy_e_mensagens.md
```

## 📋 Resumo por Arquivo

| Arquivo | Conteúdo |
|---------|----------|
| `backend.md` | Arquitetura, controllers, services, models, validações, banco de dados, middlewares, rotas, testes, segurança, TypeScript/API v7, estrutura de pastas, HMR |
| `edge_templates.md` | Estrutura de views, layouts como componentes, autenticação nos templates, rotas, CSRF, flash messages, componentes Edge, assets Vite, páginas de erro, limpeza de templates |
| `frontend/` | UI/UX, design system, branding, Alpine.js, componentes, navegação, copy |

## 🔄 Referências Cruzadas

- **Task T001** → Aprendizados documentados em `backend.md` (seções 11-13) e `edge_templates.md`
- **Frontend rules** → Complementam `edge_templates.md` para UI/UX

## ✅ Checklist para Nova Funcionalidade

### Backend
- [ ] Controller com nome em CamelCase (ex.: `DemandasController.ts`)
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
