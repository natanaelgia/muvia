# Regras do Projeto (Muvia) — Backend

## 01 — Logging

### Formato

- Todo log deve informar a origem no formato **classe + método**.
- A mensagem do log deve começar com o prefixo `Classe.metodo -`.

### Nível do log

- `logger.error`: falhas inesperadas (erros de infraestrutura, bugs, exceções não mapeadas).
- `logger.warn`: situações recuperáveis ou degradação parcial (ex.: serviço externo lento).
- `logger.info`: eventos importantes de negócio (ex.: usuário criado, login realizado).
- `logger.debug`: informações detalhadas para desenvolvimento (ex.: fluxo de execução).

### Quando logar

- Não é necessário logar erros esperados/funcionais.
- Logar eventos de negócio relevantes (criação de entidade, mudanças de estado).
- Logar falhas de infraestrutura e exceções não tratadas.

### Ferramenta

- Utilizar o logger padrão do AdonisJS (Pino), configurado em `config/logger.ts`.
- Em desenvolvimento, logs são síncronos para facilitar debugging.

## 02 — Arquitetura

### Convenções de nomenclatura de arquivos

- Todos os arquivos do backend devem ter o nome igual ao da classe em **CamelCase**.
- Exemplos:
  - `NewAccountController.ts` (não `new_account_controller.ts`)
  - `UserService.ts` (não `user_service.ts`)
  - `SignupValidator.ts` (não `signup_validator.ts`)
  - `CreateUserAdapter.ts` (não `create_user_adapter.ts`)

### Controllers

- Controllers devem conter somente:
  - leitura de request
  - criação de DTOs de request
  - chamada de services
  - escrita de response
  - logging de erros inesperados durante o processamento
- Controllers não devem conter regra de negócio.
- Controllers devem usar os métodos de validação nos services, não diretamente.

### Services

- Toda regra de negócio deve ser isolada em `app/services`.
- Todo service deve ter controle transacional quando modificar dados.
- Validações devem estar nos services e não nas controllers.
- Services devem retornar resultados tipados (nunca `any`).

### Models

- Models representam o esquema do banco e ficam em `app/models/`.
- Models devem conter apenas:
  - definições de colunas e relacionamentos
  - getters computados
  - mixins (ex.: `withAuthFinder`)
- Evitar lógica de negócio nos models.
- Usar migrations para todas as alterações de schema.
- Sempre utilizar soft-deletes

### Tipagem

- Todas as variáveis, parâmetros de métodos e atributos de classes devem ser tipados.
- Evitar `any`; preferir tipos específicos ou `unknown` quando necessário.

### Adapter

- Um método de service que precise receber mais de 3 parâmetros deve obrigatoriamente receber uma classe Adapter.
- Um método de service que precise retornar mais de 1 parâmetros deve obrigatoriamente retornar uma classe Adapter.

### DTO

- DTOs devem existir somente na camada de controllers.
- DTOs devem se auto-construir internamente, sem expor lógica de construção.
- Payloads de request e response da controller devem utilizar classes DTOs para receber e retornar os dados.
- Services não devem receber DTOs nem retornar DTOs.

### Contratos entre camadas

- Services devem receber e retornar Adapters quando necessário.

### Validações

- Utilizar VineJS para validação de dados de entrada.
- Validators ficam em `app/validators/`.
- Validações devem ser chamadas dentro dos services, não nas controllers.
- Mensagens de erro de validação devem ser claras e acionáveis para o usuário.
- Regras de unicidade devem usar `unique` do VineJS com o nome correto da tabela.

### Exceções

- Usar exceções do AdonisJS (`HttpException`, `Exception`) para erros esperados.
- Criar exceções customizadas em `app/exceptions/` apenas quando necessário.
- O handler global (`app/exceptions/handler.ts`) cuida de:
  - retornar páginas de erro em produção (404, 5xx)
  - reportar erros para serviços externos (se configurado)
  - habilitar stack trace apenas em desenvolvimento

## 03 — Banco de Dados

### Migrations

- Todas as alterações de schema devem ser feitas via migrations.
- Nomeclatura: `criar_tabela_nome.ts`, `adicionar_coluna_x_em_tabela.ts`.
- Sempre definir `down()` para rollback seguro.
- Usar colunas `timestamps()` (created_at, updated_at) em todas as tabelas.
- Sempre utilizar soft-deletes

### Convenções de nomenclatura

- Tabelas: plural em snake_case (ex.: `users`, `movie_proposals`).
- Colunas: snake_case (ex.: `full_name`, `created_at`).
- Chaves estrangeiras: `fk_{singular_table}_id` (ex.: `fk_user_id`).

### Seeds e Factories

- Usar seeds para dados iniciais obrigatórios (ex.: configurações do sistema).
- Usar factories para dados de teste.
- Não incluir seeds de dados sensíveis ou de produção.

### Consultas

- Preferir consultas com Lucid ORM ao invés de raw SQL.
- Usar `query().preload()` para relacionamentos.
- Evitar N+1 queries; usar `preload` ou `withCount` quando necessário.
- Para consultas complexas, usar `query().from()` ou raw SQL com moderação.

### Transações

- Usar `Db.transaction()` quando uma operação modificar múltiplas tabelas.
- Services devem encapsular a lógica transacional.
- Rollback automático em caso de erro.

## 04 — Middlewares

### Quando criar middlewares

- Proteger rotas que requerem autenticação/autorização.
- Transformar requests antes de chegarem às controllers.
- Adicionar headers ou dados ao contexto.
- Bloquear acesso baseado em condições (ex.: usuário já logado, manutenção).

### Padrões de autenticação

- `auth_middleware`: proteger rotas que exig usuário logado.
- `guest_middleware`: redirecionar usuários já logados (ex.: tela de login).
- `silent_auth_middleware`: verificar autenticação sem interromper fluxo (ex.: para exibir UI condicional).

### Organização

- Middlewares globais ficam registrados em `start/kernel.ts`.
- Middlewares de rota são aplicados via `route.group().middleware()`.
- Manter middlewares simples e com responsabilidade única.

## 05 — Rotas

### Organização

- Rotas ficam em `start/routes.ts`.
- Agrupar rotas por contexto usando `route.group()`.
- Nomear rotas importantes com `.as('nome')` para facilitar redirects.
- Usar middleware de autenticação nos grupos apropriados.

### Padrões de URL

- CRUDs seguem padrão REST: `/recurso`, `/recurso/:id`, `/recurso/:id/edit`.
- Ações específicas: `/recurso/:id/acao` (ex.: `/users/1/activate`).
- Usar kebab-case para URLs (ex.: `/movie-proposals`).

### Controllers nas rotas

- Usar import lazy com `() => import('#controllers/...')`.
- Manter nomes de métodos descritivos (`index`, `create`, `store`, `show`, `edit`, `update`, `destroy`).

## 06 — Testes

### Framework

- Utilizar Japa (configurado em `tests/bootstrap.ts`).
- Suites disponíveis: `browser`, `functional`, `e2e`.

### Tipos de testes

- **Unitários**: testar services, adapters e utilitários isoladamente.
- **Funcionais**: testar endpoints e fluxos completos via HTTP.
- **Browser**: testar renderização de páginas e interação com o frontend.

### Convenções

- Arquivos de teste em `tests/` com sufixo `.spec.ts`.
- Nomeclatura: `{nome_do_modulo}.spec.ts`.
- Usar factories para criar dados de teste.
- Cada teste deve ser independente quando possível.

### Cobertura

- Priorizar cobertura de services e controllers.
- Testar caminhos felizes e casos de erro.
- Validadores devem ter testes para dados válidos e inválidos.

## 07 — Eventos e Listeners (quando aplicável)

### Quando usar

- Ações que disparam efeitos colaterais assíncronos (ex.: enviar email após cadastro).
- Desacoplar lógica de negócio entre módulos.
- Notificações em tempo real (via WebSockets).

### Organização

- Events ficam em `app/events/`.
- Listeners ficam em `app/listeners/`.
- Registrar listeners em `providers/app_provider.ts` ou arquivo dedicado.

### Padrões

- Events devem conter apenas os dados necessários.
- Listeners devem ter responsabilidade única.
- Logar execução de listeners importantes.

## 08 — Policies e Abilities (quando aplicável)

### Quando usar

- Autorização complexa que depende de regras de negócio.
- Controle de acesso granular a recursos.
- Diferenciar permissões por papel (admin, user, etc.).

### Organização

- Policies ficam em `app/policies/`.
- Abilities ficam em `app/abilities/`.
- Usar `@.` do AdonisJS para definir habilidades.

### Padrões

- Uma policy por modelo/recurso.
- Métodos de policy devem retornar boolean.
- Logar negações de acesso para auditoria.

## 09 — Segurança

### Dados sensíveis

- Nunca logar: `password`, tokens, cookies, `Authorization`, payload completo (`request.all()`), conteúdo de sessão.
- Usar `env.get()` para variáveis sensíveis, nunca hardcode.
- Arquivo `.env` nunca deve ser commitado.

### Autenticação e Sessão

- Sessions configuradas em `config/session.ts`.
- Usar HTTPS em produção para proteger cookies de sessão.
- Regenerar session ID após login.

### Validações de entrada

- Validar todos os dados de entrada com VineJS.
- Usar `trim`, `normalizeEmail`, etc. quando apropriado.
- Sanitizar inputs antes de persistir.

### Headers e CORS

- Configurar CORS em `config/cors.ts` se houver API externa.
- Usar `@adonisjs/shield` para proteção contra XSS, CSRF, etc.

## 10 — Documentação de API (quando aplicável)

### Padrão

- Documentar endpoints públicos e protegidos.
- Incluir: método, URL, headers, body, response (sucesso e erros).
- Usar ferramentas como Swagger/OpenAPI se a API crescer.

### Versionamento

- Se necessário, versionar API na URL: `/api/v1/...`.
- Manter changelog de versões.

## 12 — Estrutura do Projeto (Pastas)

### Regra de ouro

**NUNCA** criar pastas duplicadas na raiz do projeto. Usar sempre a estrutura padrão do AdonisJS:

| ❌ Não Fazer (na raiz) | ✅ Fazer |
|------------------------|----------|
| `appadapters/` | `app/adapters/` |
| `appdtos/` | `app/dtos/` |
| `appevents/` | `app/events/` |
| `appjobs/` | `app/jobs/` |
| `applisteners/` | `app/listeners/` |
| `appservicesauth/` | `app/services/auth/` |
| `databaseseeders/` | `database/seeders/` |
| `resourcesviewscomponents/` | `resources/views/components/` |
| `tmpuploads/` | `tmp/uploads/` |

### Pastas válidas na raiz

- `app/`, `bin/`, `config/`, `database/`, `docs/`, `logs/`, `public/`, `resources/`, `start/`, `tests/`, `tmp/`
- Arquivos de configuração: `.env`, `.gitignore`, `ace.js`, `adonisrc.ts`, `package.json`, `tsconfig.json`, `vite.config.ts`

### Pastas temporárias (ignoradas pelo git)

- `logs/` — logs de produção (ignorado pelo git, exceto `.gitkeep`)
- `tmp/` — uploads temporários (ignorado pelo git, exceto `.gitkeep`)

### .gitignore

Adicionar ao `.gitignore`:
```
# Dependencies and build
node_modules
build

# Environment
.env
.env.*

# Logs
logs/*
!logs/.gitkeep

# Temp uploads
tmp/*
!tmp/.gitkeep

# Compiled assets
public/assets
```

## 13 — HMR e Desenvolvimento

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

---

**Referência:** Aprendizados da Task T001 — Configurar Projeto AdonisJS
