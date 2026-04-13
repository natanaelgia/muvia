# 📋 Tarefas MVP - Muvia

**Documento de Referência:** [roadmap_muvia_mvp.md](../roadmap_muvia_mvp.md)  
**Versão:** 1.0  
**Data de Criação:** 13 de Abril de 2026  
**Status:** Planejamento  

---

## 🏷️ Legenda de Tags

| **Tag** | **Significado** |
|---------|-----------------|
| `#backend` | Desenvolvimento backend (AdonisJS) |
| `#frontend` | Desenvolvimento frontend (Edge.js + Bootstrap + Alpine.js) |
| `#database` | Migrations, models, queries PostgreSQL |
| `#auth` | Autenticação e autorização |
| `#kyc` | Know Your Customer - verificação de identidade |
| `#wallet` | Sistema de carteira/financeiro |
| `#logging` | Logs e auditoria |
| `#demandas` | Publicação e gerenciamento de demandas |
| `#upload` | Upload e gerenciamento de arquivos |
| `#geolocation` | Geolocalização e mapas |
| `#notifications` | Sistema de notificações |
| `#matching` | Matching entre demandas e parceiros |
| `#bidding` | Sistema de lances/propostas |
| `#chat` | Chat e comunicação |
| `#antifraud` | Anti-fraude e moderação |
| `#payments` | Integração com gateway de pagamento |
| `#escrow` | Sistema de custódia financeira |
| `#webhooks` | Recebimento e processamento de webhooks |
| `#execution` | Execução do serviço |
| `#delivery` | Confirmação de entrega |
| `#qrcode` | QR Code e tokens |
| `#lgpd` | Conformidade com LGPD |
| `#testing` | Testes (unitários, funcionais, integração) |
| `#docs` | Documentação |
| `#devops` | Deploy, CI/CD, infraestrutura |
| `#security` | Segurança geral |
| `#validation` | Validação de dados |
| `#edge-case` | Tratamento de edge cases críticos |

---

## 🔧 FASE 1 - INFRAESTRUTURA & SEGURANÇA

**Sprints:** 1-2 (4 semanas)  
**Objetivo:** Base sólida para evitar retrabalho e garantir segurança  

---

### **T001** - Configurar projeto AdonisJS com estrutura base
**Tags:** `#backend` `#devops` `#docs`  
**Descrição:** Inicializar projeto AdonisJS v7+ com todas as dependências necessárias configuradas.  
**Subtarefas:**
- [ ] Instalar AdonisJS v7+ com TypeScript
- [ ] Configurar `@adonisjs/auth` para session-based auth
- [ ] Configurar `@adonisjs/session` com driver adequado
- [ ] Configurar Vite para build de assets
- [ ] Configurar Pino para logging estruturado
- [ ] Configurar ESLint + Prettier
- [ ] Configurar `.env` e `.env.example` com variáveis necessárias
- [ ] Instalar e configurar VineJS para validação
- [ ] Criar estrutura de pasturas base (Controllers, Services, Models, Middleware, Validators, Adapters, DTOs)
- [ ] Configurar arquivo `ace.js` para comandos customizados
**Critérios de Aceite:**
- Projeto inicializa sem erros (`node ace serve`)
- Todos os pacotes instalados e importáveis
- Estrutura de pastas seguindo padrão Controllers → Services → Models
**Dependências:** Nenhuma  
**Prioridade:** 🔴 Crítica  

---

### **T002** - Criar migrations para tabela de usuários
**Tags:** `#database` `#auth` `#lgpd`  
**Descrição:** Criar migration para tabela `users` com campos necessários para autenticação e perfil.  
**Subtarefas:**
- [ ] Criar migration `users` com campos: id, name, email, cpf_cnpj (único, criptografado), password_hash, role (cliente/profissional/ambos), kyc_status, created_at, updated_at, deleted_at (soft delete)
- [ ] Adicionar índice único em `cpf_cnpj`
- [ ] Adicionar índice em `email`
- [ ] Criar migration com rollback testado
**Critérios de Aceite:**
- Migration roda com sucesso (`node ace migration:run`)
- Rollback funciona (`node ace migration:rollback`)
- CPF/CNPJ é único no banco
**Dependências:** T001  
**Prioridade:** 🔴 Crítica  

---

### **T003** - Implementar validação de CPF/CNPJ
**Tags:** `#backend` `#validation` `#security`  
**Descrição:** Criar validator customizado para CPF e CNPJ com algoritmo de verificação de dígitos.  
**Subtarefas:**
- [ ] Criar service `CpfCnpjValidator` com métodos `validateCpf()` e `validateCnpj()`
- [ ] Implementar algoritmo de verificação de dígitos verificadores
- [ ] Criar regras VineJS customizadas `isCpf()` e `isCnpj()`
- [ ] Criar testes unitários para CPFs/CNPJs válidos e inválidos
- [ ] Adicionar testes para CPFs/CNPJs famosos (111.111.111-11, etc.)
**Critérios de Aceite:**
- Validação rejeita CPFs/CNPJs inválidos em < 100ms
- Validação aceita CPFs/CNPJs válidos
- 100% de cobertura nos testes unitários
**Dependências:** T001  
**Prioridade:** 🔴 Crítica  

---

### **T004** - Implementar sistema de registro (signup)
**Tags:** `#backend` `#frontend` `#auth` `#validation`  
**Descrição:** Criar fluxo completo de registro com validação de CPF/CNPJ e criação de sessão.  
**Subtarefas:**
- [ ] Criar validator de registro com VineJS (name, email, cpf_cnpj, password, password_confirmation)
- [ ] Criar controller `AuthController` com método `signup()`
- [ ] Criar service `AuthService` com lógica de registro
- [ ] Implementar verificação de duplicidade de CPF/CNPJ antes de criar
- [ ] Implementar hashing de senha com bcrypt
- [ ] Criar template Edge para formulário de registro
- [ ] Implementar validação client-side com Alpine.js
- [ ] Implementar mensagem de erro clara para CPF/CNPJ duplicado (CA1)
- [ ] Criar rota POST `/signup`
- [ ] Adicionar rate limiting (máx 5 tentativas/hora por IP)
**Critérios de Aceite:**
- CA1: Sistema rejeita cadastro com CPF/CNP já existente (validação no banco em < 100ms)
- Formulário exibe mensagens de erro claras
- Usuário é logado automaticamente após registro
**Dependências:** T002, T003  
**Prioridade:** 🔴 Crítica  

---

### **T005** - Implementar sistema de login/logout
**Tags:** `#backend` `#frontend` `#auth` `#security`  
**Descrição:** Criar fluxo de login com email+senha e logout seguro.  
**Subtarefas:**
- [ ] Criar validator de login (email, password)
- [ ] Criar método `login()` no `AuthController`
- [ ] Implementar verificação de credenciais no `AuthService`
- [ ] Criar template Edge para login
- [ ] Implementar proteção contra brute-force (máx 5 tentativas falhas bloqueia por 15min)
- [ ] Criar método `logout()` com destruição de sessão
- [ ] Criar middleware `AuthGuard` para rotas protegidas
- [ ] Criar rota POST `/login` e POST `/logout`
**Critérios de Aceite:**
- Login funciona com credenciais válidas
- Login falha com credenciais inválidas (mensagem genérica)
- Logout destrói sessão completamente
- Brute-force protection funcional
**Dependências:** T004  
**Prioridade:** 🔴 Crítica  

---

### **T006** - Implementar perfis dinâmicos (Cliente ↔ Profissional)
**Tags:** `#backend` `#frontend` `#database`  
**Descrição:** Permitir que usuário alterne entre perfil de cliente e profissional.  
**Subtarefas:**
- [ ] Criar migration para tabela `user_profiles` (id, user_id, profile_type, is_active, created_at)
- [ ] Criar model `UserProfile` com relacionamento belongsTo User
- [ ] Criar service `ProfileService` para alternar perfis
- [ ] Criar controller método `switchProfile()`
- [ ] Criar middleware `SwitchProfile` para verificar permissões
- [ ] Criar UI (dropdown) para alternar perfis
- [ ] Implementar verificação: usuário pode ter ambos perfis ativos
**Critérios de Aceite:**
- Usuário pode alternar entre perfis sem re-login
- Cada perfil tem permissões/visualizações diferentes
- Sistema registra qual perfil está ativo na sessão
**Dependências:** T005  
**Prioridade:** 🟡 Alta  

---

### **T007** - Criar migrations para KYC
**Tags:** `#database` `#kyc` `#lgpd`  
**Descrição:** Criar tabela `kyc_documents` para armazenar documentos de verificação.  
**Subtarefas:**
- [ ] Criar migration `kyc_documents` com: id, user_id, document_type (RG/CNH), document_url, status (pendente/aprovado/rejeitado), rejection_reason, reviewed_by, reviewed_at, created_at, updated_at
- [ ] Criar índices em `user_id` e `status`
- [ ] Adicionar foreign key para `users` com cascade delete
- [ ] Criar model `KycDocument` com relacionamentos
**Critérios de Aceite:**
- Migration e rollback testados
- Model com relacionamentos funcionais
**Dependências:** T002  
**Prioridade:** 🔴 Crítica  

---

### **T008** - Implementar upload de documentos KYC
**Tags:** `#backend` `#frontend` `#upload` `#kyc` `#edge-case`  
**Descrição:** Criar sistema de upload de documentos (RG/CNH) com validações.  
**Subtarefas:**
- [ ] Configurar driver de armazenamento (S3 local ou Cloudflare R2)
- [ ] Criar validator para uploads (apenas JPG/PNG, máx 5MB)
- [ ] Criar controller método `uploadDocument()`
- [ ] Criar service `KycService` com lógica de upload
- [ ] Implementar compressão de imagem se > 2MB
- [ ] Criar template Edge para upload com preview
- [ ] Implementar validação de legibilidade (mínimo de resolução)
- [ ] Adicionar guidelines visuais antes do upload
- [ ] Criar endpoint GET `/kyc/status` para verificar status
- [ ] Implementar retry automático em caso de timeout de upload
- [ ] Criar testes funcionais para uploads válidos e inválidos
**Critérios de Aceite:**
- CA2: Upload aceita apenas JPG/PNG até 5MB
- Rejeita outros formatos com mensagem clara
- Preview do documento antes de enviar
- Upload com retry em caso de falha
**Dependências:** T006, T007  
**Prioridade:** 🔴 Crítica  

---

### **T009** - Implementar revisão de KYC (admin)
**Tags:** `#backend` `#frontend` `#kyc`  
**Descrição:** Criar interface para revisão e aprovação/rejeição de documentos KYC.  
**Subtarefas:**
- [ ] Criar controller admin `KycReviewController`
- [ ] Criar método `listPending()` para documentos pendentes
- [ ] Criar método `review()` com aprovação/rejeição
- [ ] Criar template Edge para revisão (visualizar documento + buttons approve/reject)
- [ ] Criar service `KycReviewService` para processar revisão
- [ ] Implementar notificação ao usuário após revisão (email)
- [ ] Criar rota GET `/admin/kyc/pending` e POST `/admin/kyc/review`
- [ ] Proteger rotas com middleware `AdminOnly`
**Critérios de Aceite:**
- Admin pode listar documentos pendentes
- Aprovação/rejeição atualiza status corretamente
- Usuário recebe notificação por email
**Dependências:** T008  
**Prioridade:** 🟡 Alta  

---

### **T010** - Criar migrations para wallet
**Tags:** `#database` `#wallet`  
**Descrição:** Criar tabelas `wallets` e `wallet_transactions` para sistema financeiro.  
**Subtarefas:**
- [ ] Criar migration `wallets` com: id, user_id, balance (decimal), asaas_customer_id, created_at, updated_at
- [ ] Criar migration `wallet_transactions` com: id, wallet_id, type (credit/debit), amount, description, reference_id, reference_type, balance_after, created_at
- [ ] Criar modelos `Wallet` e `WalletTransaction` com relacionamentos
- [ ] Adicionar constraints: `balance >= 0`
- [ ] Criar seed para criar wallets para usuários existentes
**Critérios de Aceite:**
- Migrations e rollbacks testados
- Models com relacionamentos funcionais
- Seed cria wallets para todos os usuários
**Dependências:** T002  
**Prioridade:** 🔴 Crítica  

---

### **T011** - Implementar criação automática de wallet
**Tags:** `#backend` `#wallet`  
**Descrição:** Criar wallet automaticamente após aprovação de KYC.  
**Subtarefas:**
- [ ] Criar service `WalletService` com método `createWallet()`
- [ ] Criar listener/event para `KycApproved` → criar wallet
- [ ] Implementar criação de wallet em até 2s após aprovação (CA3)
- [ ] Criar método `getBalance()` para consultar saldo
- [ ] Criar método `addTransaction()` para registrar transações
- [ ] Implementar validação de saldo (nunca negativo)
**Critérios de Aceite:**
- CA3: Wallet criada automaticamente em até 2s após aprovação KYC
- Saldo inicial é zero
- Transações registradas com timestamp e referência
**Dependências:** T009, T010  
**Prioridade:** 🔴 Crítica  

---

### **T012** - Integrar com Asaas (sandbox)
**Tags:** `#backend` `#wallet` `#edge-case`  
**Descrição:** Implementar integração com API Asaas para criação de customer e pagamentos.  
**Subtarefas:**
- [ ] Criar service `AsaasService` com métodos básicos
- [ ] Implementar método `createCustomer()` (sincronizar com wallet)
- [ ] Implementar método `getCustomerById()`
- [ ] Configurar timeout de 10s para requests
- [ ] Implementar retry com backoff exponencial (3 retries)
- [ ] Implementar idempotência por request ID
- [ ] Criar adapter para mapear dados internos → dados Asaas
- [ ] Configurar variáveis de ambiente para sandbox
- [ ] Criar testes de integração com mocks
- [ ] Implementar fallback: modo sandbox com mensagem de indisponibilidade
**Critérios de Aceite:**
- CA5: Integração com timeout 10s, 3 retries com backoff, idempotência
- Customer criado no Asaas quando wallet é criada
- Fallback funcional quando API está indisponível
**Dependências:** T011  
**Prioridade:** 🔴 Crítica  

---

### **T013** - Criar migrations para logs de auditoria
**Tags:** `#database` `#logging` `#security` `#lgpd`  
**Descrição:** Criar tabela `audit_logs` para registrar ações críticas.  
**Subtarefas:**
- [ ] Criar migration `audit_logs` com: id, user_id, action, entity_type, entity_id, old_value (JSONB), new_value (JSONB), ip_address, user_agent, request_id, created_at
- [ ] Criar índices em `user_id`, `entity_type`, `entity_id`, `created_at`
- [ ] Criar model `AuditLog` com relacionamento belongsTo User
- [ ] Criar política de retenção: logs retidos por 3 anos
**Critérios de Aceite:**
- Migration e rollback testados
- Índices otimizados para queries de auditoria
**Dependências:** T002  
**Prioridade:** 🔴 Crítica  

---

### **T014** - Implementar sistema de logs de auditoria
**Tags:** `#backend` `#logging` `#security`  
**Descrição:** Criar service para registrar logs de auditoria em todas as operações críticas.  
**Subtarefas:**
- [ ] Criar service `AuditService` com método `log()`
- [ ] Implementar registro automático via middleware para rotas críticas
- [ ] Criar decorator/macro para registrar ações em services
- [ ] Implementar anonimização de dados sensíveis (CPF parcial, sem senhas/tokens)
- [ ] Adicionar request ID correlacionável em todos os logs
- [ ] Criar método `getLogsByEntity()` para consultas de auditoria
- [ ] Implementar log estruturado com Pino (JSON format)
- [ ] Criar comando Ace `audit:export` para exportar logs por período
**Critérios de Aceite:**
- CA4: Logs registram timestamp, usuário, ação e entidade para operações financeiras
- Dados sensíveis anonimizados
- Request ID correlacionável em todos os logs
**Dependências:** T013  
**Prioridade:** 🔴 Crítica  

---

### **T015** - Implementar criptografia de dados sensíveis
**Tags:** `#backend` `#security` `#lgpd` `#database`  
**Descrição:** Criptografar dados sensíveis (CPF, documentos) no banco de dados.  
**Subtarefas:**
- [ ] Criar service `EncryptionService` com métodos `encrypt()` e `decrypt()`
- [ ] Configurar AES-256 para criptografia
- [ ] Criar hook no model User para criptografar `cpf_cnpj` automaticamente
- [ ] Criar hook no model KycDocument para criptografar referências
- [ ] Implementar getter para descriptografar ao acessar campos
- [ ] Testar performance de criptografia/descriptografia (< 50ms)
- [ ] Documentar padrão de criptografia usado
**Critérios de Aceite:**
- CPF/CNPJ criptografados no banco
- Descriptografia transparente ao acessar via model
- Performance < 50ms para operações de criptografia
**Dependências:** T002, T013  
**Prioridade:** 🔴 Crítica  

---

### **T016** - Implementar rate limiting global
**Tags:** `#backend` `#security`  
**Descrição:** Criar middleware de rate limiting para proteger endpoints críticos.  
**Subtarefas:**
- [ ] Criar middleware `RateLimiter`
- [ ] Implementar configuração por rota (login: 5/hora, signup: 5/hora, chat: 30/min)
- [ ] Usar Redis ou memória para contadores
- [ ] Retornar headers `X-RateLimit-Limit` e `X-RateLimit-Remaining`
- [ ] Retornar HTTP 429 quando limite excedido
- [ ] Criar configuração em `.env` para limites
- [ ] Testar com múltiplas requisições simultâneas
**Critérios de Aceite:**
- Rate limiting funcional em endpoints críticos
- Headers retornados corretamente
- HTTP 429 com mensagem clara
**Dependências:** T001  
**Prioridade:** 🟡 Alta  

---

### **T017** - Implementar endpoint de exportação de dados (LGPD)
**Tags:** `#backend` `#lgpd`  
**Descrição:** Criar endpoint para usuário exportar todos os seus dados (direito de acesso LGPD).  
**Subtarefas:**
- [ ] Criar rota GET `/account/data-export`
- [ ] Criar controller método `exportData()`
- [ ] Criar service `LgpdService` para coletar todos os dados do usuário
- [ ] Exportar em formato JSON estruturado
- [ ] Incluir: dados pessoais, demandas, propostas, transações, logs
- [ ] Proteger rota com middleware `AuthGuard`
- [ ] Implementar tempo de geração < 10s
- [ ] Criar testes funcionais
**Critérios de Aceite:**
- Exportação contém todos os dados do usuário
- Formato JSON estruturado e legível
- Endpoint protegido por autenticação
**Dependências:** T005, T008, T010, T014  
**Prioridade:** 🟢 Média  

---

### **T018** - Implementar endpoint de deleção de conta (LGPD)
**Tags:** `#backend` `#lgpd` `#database`  
**Descrição:** Criar endpoint para usuário solicitar deleção de conta (exceto dados com obrigação legal).  
**Subtarefas:**
- [ ] Criar rota POST `/account/delete`
- [ ] Criar controller método `requestDeletion()`
- [ ] Implementar soft delete para usuário
- [ ] Anonimizar dados pessoais (exceto CPF/CNPJ e documentos - retenção legal 5 anos)
- [ ] Cancelar demandas e propostas ativas
- [ ] Notificar equipe sobre solicitação
- [ ] Implementar período de graça (7 dias) antes de efetivar deleção
- [ ] Criar comando Ace `account:purge` para deletar contas após período de graça
- [ ] Documentar política de retenção
**Critérios de Aceite:**
- Conta marcada para deleção
- Dados pessoais anonimizados
- Dados com obrigação legal mantidos
- Período de graça de 7 dias
**Dependências:** T017  
**Prioridade:** 🟢 Média  

---

### **T019** - Criar testes unitários da Fase 1
**Tags:** `#testing` `#backend`  
**Descrição:** Escrever testes unitários para todos os services criados na Fase 1.  
**Subtarefas:**
- [ ] Testes para `CpfCnpjValidator` (> 90% cobertura)
- [ ] Testes para `AuthService` (signup, login, logout)
- [ ] Testes para `KycService` (upload, validação)
- [ ] Testes para `WalletService` (criação, transações)
- [ ] Testes para `AsaasService` (mock de API)
- [ ] Testes para `AuditService` (logging)
- [ ] Testes para `EncryptionService` (encrypt/decrypt)
- [ ] Testes para `LgpdService` (exportação)
- [ ] Configurar relatório de cobertura (> 80%)
**Critérios de Aceite:**
- Todos os services com > 80% cobertura
- Testes passando sem falhas
- Relatório de cobertura gerado
**Dependências:** T001-T018  
**Prioridade:** 🟡 Alta  

---

### **T020** - Criar testes funcionais da Fase 1
**Tags:** `#testing` `#backend` `#frontend`  
**Descrição:** Escrever testes funcionais para endpoints e fluxos da Fase 1.  
**Subtarefas:**
- [ ] Teste funcional POST `/signup` (válido e inválido)
- [ ] Teste funcional POST `/login` (válido e inválido)
- [ ] Teste funcional POST `/logout`
- [ ] Teste funcional upload de documentos (multipart)
- [ ] Teste funcional GET `/kyc/status`
- [ ] Teste funcional GET `/account/data-export`
- [ ] Teste funcional POST `/account/delete`
- [ ] Teste de rate limiting (429 responses)
**Critérios de Aceite:**
- Todos os endpoints críticos testados
- Casos válidos e inválidos cobertos
- Testes passando sem falhas
**Dependências:** T019  
**Prioridade:** 🟡 Alta  

---

### **T021** - Configurar deploy em staging
**Tags:** `#devops` `#docs`  
**Descrição:** Configurar ambiente de staging para homologação.  
**Subtarefas:**
- [ ] Configurar servidor de staging
- [ ] Configurar banco de dados PostgreSQL em staging
- [ ] Configurar variáveis de ambiente (.env de staging)
- [ ] Configurar CI/CD para deploy automático em staging
- [ ] Configurar health check endpoint
- [ ] Configurar monitoring básico (uptime, logs)
- [ ] Documentar processo de deploy
**Critérios de Aceite:**
- Staging acessível via URL
- Deploy automático via git push
- Health check retornando 200 OK
**Dependências:** T001-T020  
**Prioridade:** 🟢 Média  

---

## 📱 FASE 2 - CORE BUSINESS - PUBLICAÇÃO

**Sprints:** 3-4 (4 semanas)  
**Objetivo:** Permitir que clientes publiquem demandas de forma segura  

---

### **T022** - Criar migrations para demandas
**Tags:** `#database` `#demandas`  
**Descrição:** Criar tabela `demandas` para armazenar publicações de clientes.  
**Subtarefas:**
- [ ] Criar migration `demandas` com: id, client_id, title, description, demand_type, inventory (JSONB), origin_address (JSONB, criptografado), destination_address (JSONB, criptografado), origin_neighborhood, destination_neighborhood, origin_lat, origin_lng, destination_lat, destination_lng, status (rascunho/publicada/em_andamento/concluida/cancelada), scheduled_date, created_at, updated_at, published_at
- [ ] Criar índices em `client_id`, `status`, `origin_neighborhood`, `destination_neighborhood`
- [ ] Criar model `Demanda` com relacionamentos
- [ ] Criar enum para `demand_type` e `status`
**Critérios de Aceite:**
- Migration e rollback testados
- Model com relacionamentos funcionais
- JSONB para inventário funcionando
**Dependências:** T002  
**Prioridade:** 🔴 Crítica  

---

### **T023** - Implementar wizard de publicação - Passo 1 (Tipo)
**Tags:** `#backend` `#frontend` `#demandas` `#validation`  
**Descrição:** Criar primeira etapa do wizard de publicação (seleção de tipo de demanda).  
**Subtarefas:**
- [ ] Criar validator para tipo de demanda (mudança residencial, mudança comercial, entrega, outro)
- [ ] Criar controller `DemandasController` com método `createStep1()`
- [ ] Criar template Edge para seleção de tipo com cards visuais
- [ ] Implementar Alpine.js para seleção interativa
- [ ] Salvar rascunho no servidor automaticamente
- [ ] Criar rota GET `/demandas/nova` e POST `/demandas/nova/tipo`
- [ ] Implementar auto-save a cada 30 segundos
**Critérios de Aceite:**
- Tipo de demanda selecionado e validado
- Rascunho salvo automaticamente
- Formulário não avança sem seleção válida
**Dependências:** T005, T022  
**Prioridade:** 🔴 Crítica  

---

### **T024** - Implementar wizard de publicação - Passo 2 (Inventário)
**Tags:** `#backend` `#frontend` `#demandas` `#upload`  
**Descrição:** Criar segunda etapa do wizard (inventário de itens com fotos).  
**Subtarefas:**
- [ ] Criar validator para inventário (array de itens com nome, quantidade, categoria, fotos)
- [ ] Criar método `createStep2()` no controller
- [ ] Criar template Edge para inventário com lista dinâmica (Alpine.js)
- [ ] Implementar adição/remoção de itens dinamicamente
- [ ] Implementar upload de fotos por item (múltiplas fotos)
- [ ] Implementar compressão de fotos para máx 2MB (CA2)
- [ ] Implementar preview de fotos antes de enviar
- [ ] Implementar categorização automática por palavra-chave
- [ ] Limitar a 50 itens por demanda (com paginação se necessário)
- [ ] Salvar rascunho automaticamente a cada 30s
**Critérios de Aceite:**
- CA2: Fotos comprimidas para máx 2MB cada
- Inventário salvo como JSONB
- Limite de 50 itens respeitado
- Auto-save a cada 30 segundos
**Dependências:** T023  
**Prioridade:** 🔴 Crítica  

---

### **T025** - Implementar wizard de publicação - Passo 3 (Localização)
**Tags:** `#backend` `#frontend` `#demandas` `#geolocation`  
**Descrição:** Criar terceira etapa do wizard (endereços de origem e destino).  
**Subtarefas:**
- [ ] Criar validator para endereços (cep, rua, número, bairro, cidade, estado, complemento)
- [ ] Criar método `createStep3()` no controller
- [ ] Criar template Edge para formulário de endereços
- [ ] Integrar com API de geocodificação (OpenStreetMap/Nominatim)
- [ ] Implementar autocomplete de endereços
- [ ] Calcular coordenadas (lat/lng) dos endereços
- [ ] Extrair e armazenar apenas bairros (ocultar rua/número)
- [ ] Calcular distância aproximada entre origem e destino
- [ ] Criptografar endereços completos antes de salvar
- [ ] Implementar sugestões alternativas se endereço não encontrado
- [ ] Criar rota POST `/demandas/nova/localizacao`
**Critérios de Aceite:**
- CA3: Apenas bairros exibidos no mapa (rua/número ocultos)
- Endereços criptografados no banco
- Distância aproximada calculada
- Sugestões alternativas se endereço não encontrado
**Dependências:** T015, T024  
**Prioridade:** 🔴 Crítica  

---

### **T026** - Implementar preview e publicação final
**Tags:** `#backend` `#frontend` `#demandas`  
**Descrição:** Criar etapa de preview antes de publicar demanda.  
**Subtarefas:**
- [ ] Criar método `preview()` no controller
- [ ] Criar template Edge para preview (resumo de todos os dados)
- [ ] Exibir inventário com fotos em miniatura
- [ ] Exibir bairros de origem e destino no mapa
- [ ] Exibir tipo de demanda e data agendada
- [ ] Implementar botão "Publicar" com confirmação
- [ ] Criar método `publish()` que altera status para `publicada`
- [ ] Registrar timestamp de publicação
- [ ] Disparar evento `DemandaPublicada` para notificações
**Critérios de Aceite:**
- Preview mostra todos os dados corretamente
- Publicação altera status e registra timestamp
- Evento disparado para notificações
**Dependências:** T025  
**Prioridade:** 🟡 Alta  

---

### **T027** - Implementar sistema de rascunhos
**Tags:** `#backend` `#database` `#demandas`  
**Descrição:** Criar sistema de salvamento e recuperação de rascunhos.  
**Subtarefas:**
- [ ] Criar método `saveDraft()` no service `DemandaService`
- [ ] Criar método `getDrafts()` para listar rascunhos do usuário
- [ ] Criar método `loadDraft()` para recuperar rascunho específico
- [ ] Criar endpoint GET `/demandas/rascunhos` e POST `/demandas/rascunho`
- [ ] Implementar auto-save a cada 30 segundos (AJAX com Alpine.js)
- [ ] Implementar recuperação de rascunhos por até 7 dias (CA5)
- [ ] Criar job agendado para limpar rascunhos expirados (> 7 dias)
- [ ] Criar template Edge para listar rascunhos
**Critérios de Aceite:**
- CA5: Rascunho salvo automaticamente a cada 30s
- Rascunho recuperável por até 7 dias
- Rascunhos expirados limpos automaticamente
**Dependências:** T023  
**Prioridade:** 🟡 Alta  

---

### **T028** - Implementar upload de fotos com compressão
**Tags:** `#backend` `#upload`  
**Descrição:** Criar service de upload com compressão e validação server-side.  
**Subtarefas:**
- [ ] Criar service `ImageUploadService` com método `upload()`
- [ ] Implementar compressão de imagem (sharp ou similar)
- [ ] Validar formato (JPG/PNG apenas) server-side
- [ ] Validar tamanho (máx 5MB antes da compressão, máx 2MB após)
- [ ] Gerar thumbnails automáticas
- [ ] Salvar em S3/R2 com path estruturado
- [ ] Implementar retry automático em caso de falha
- [ ] Criar testes funcionais para uploads válidos e inválidos
**Critérios de Aceite:**
- Imagens comprimidas corretamente
- Validação server-side funcional
- Retry em caso de falha
- Thumbnails geradas
**Dependências:** T001  
**Prioridade:** 🔴 Crítica  

---

### **T029** - Implementar geolocalização e cálculo de distância
**Tags:** `#backend` `#geolocation`  
**Descrição:** Criar service para geocodificação e cálculo de distância.  
**Subtarefas:**
- [ ] Criar service `GeolocationService` com método `geocodeAddress()`
- [ ] Integrar com OpenStreetMap/Nominatim API
- [ ] Implementar cache de geocodificação (evitar chamadas repetidas)
- [ ] Criar método `calculateDistance()` (fórmula de Haversine)
- [ ] Implementar fallback para Google Maps API se necessário
- [ ] Criar testes unitários para cálculo de distância
- [ ] Criar testes de integração com API de geocodificação
**Critérios de Aceite:**
- Geocodificação retornando coordenadas corretas
- Cálculo de distância com margem de erro < 5%
- Cache funcional
**Dependências:** T001  
**Prioridade:** 🟡 Alta  

---

### **T030** - Implementar sistema de notificações para parceiros
**Tags:** `#backend` `#notifications`  
**Descrição:** Criar sistema de notificação para parceiros sobre novas demandas.  
**Subtarefas:**
- [ ] Criar migration `notifications` (id, user_id, type, title, message, read_at, created_at)
- [ ] Criar model `Notification` com relacionamento
- [ ] Criar service `NotificationService` com método `sendToPartners()`
- [ ] Implementar filtro de parceiros por região (raio de 15km)
- [ ] Implementar limite de notificações por hora (anti-spam)
- [ ] Criar listener para evento `DemandaPublicada`
- [ ] Implementar envio de notificação por email (session flash no MVP)
- [ ] Criar endpoint GET `/notifications` para listar notificações
- [ ] Criar endpoint POST `/notifications/:id/read` para marcar como lida
**Critérios de Aceite:**
- CA4: Parceiros recebem notificações de demandas num raio de 15km
- Limite de notificações por hora respeitado
- Notificações marcadas como lidas
**Dependências:** T026, T029  
**Prioridade:** 🟡 Alta  

---

### **T031** - Implementar listagem e detalhes de demandas
**Tags:** `#backend` `#frontend` `#demandas`  
**Descrição:** Criar endpoints e templates para listar e visualizar demandas.  
**Subtarefas:**
- [ ] Criar método `index()` no controller para listar demandas publicadas
- [ ] Implementar filtros: por tipo, bairro, data, status
- [ ] Implementar paginação
- [ ] Criar método `show()` para exibir detalhes de uma demanda
- [ ] Exibir apenas bairros (endereço completo oculto)
- [ ] Exibir inventário com fotos
- [ ] Criar templates Edge para listagem e detalhes
- [ ] Implementar Alpine.js para filtros dinâmicos
**Critérios de Aceite:**
- Listagem com filtros funcionais
- Detalhes exibem apenas informações permitidas
- Paginação funcional
**Dependências:** T026  
**Prioridade:** 🟡 Alta  

---

### **T032** - Implementar rate limiting para publicação de demandas
**Tags:** `#backend` `#security` `#edge-case`  
**Descrição:** Limitar número de demandas publicadas por usuário por dia.  
**Subtarefas:**
- [ ] Implementar rate limiting específico para publicação (máx 5/dia por usuário)
- [ ] Criar middleware `DemandaRateLimiter`
- [ ] Retornar mensagem clara quando limite excedido
- [ ] Criar contador no Redis ou banco de dados
- [ ] Resetar contador à meia-noite
**Critérios de Aceite:**
- Máximo 5 demandas publicadas por dia por usuário
- Mensagem clara quando limite excedido
**Dependências:** T016, T026  
**Prioridade:** 🟢 Média  

---

### **T033** - Criar testes da Fase 2
**Tags:** `#testing` `#backend` `#frontend`  
**Descrição:** Escrever testes unitários e funcionais para funcionalidades da Fase 2.  
**Subtarefas:**
- [ ] Testes unitários para `DemandaService` (> 80% cobertura)
- [ ] Testes unitários para `GeolocationService`
- [ ] Testes unitários para `NotificationService`
- [ ] Testes unitários para `ImageUploadService`
- [ ] Testes funcionais para POST `/demandas/nova` (wizard completo)
- [ ] Testes funcionais para upload de fotos (multipart, compressão)
- [ ] Testes funcionais para GET `/demandas/rascunhos`
- [ ] Testes de navegador para wizard de publicação (Playwright)
**Critérios de Aceite:**
- Todos os services com > 80% cobertura
- Testes funcionais passando
- Testes de navegador cobrindo fluxo completo
**Dependências:** T022-T032  
**Prioridade:** 🟡 Alta  

---

## 🤝 FASE 3 - MATCHING & BIDDING

**Sprints:** 5-6 (4 semanas)  
**Objetivo:** Conectar oferta e demanda de forma segura  

---

### **T034** - Criar migrations para propostas
**Tags:** `#database` `#bidding`  
**Descrição:** Criar tabela `propostas` para armazenar lances dos parceiros.  
**Subtarefas:**
- [ ] Criar migration `propostas` com: id, demanda_id, partner_id, valor (decimal), prazo_horas, observacoes (máx 500 chars), status (pendente/selecionada/recusada), selected_at, created_at, updated_at
- [ ] Criar índices em `demanda_id`, `partner_id`, `status`
- [ ] Criar model `Proposta` com relacionamentos belongsTo Demanda, belongsTo User
- [ ] Adicionar constraint: valor >= 50
- [ ] Adicionar constraint: prazo_horas <= 48
**Critérios de Aceite:**
- Migration e rollback testados
- Constraints funcionais
- Models com relacionamentos
**Dependências:** T022  
**Prioridade:** 🔴 Crítica  

---

### **T035** - Implementar dashboard de demandas para parceiros
**Tags:** `#backend` `#frontend` `#matching`  
**Descrição:** Criar dashboard para parceiros visualizarem demandas disponíveis.  
**Subtarefas:**
- [ ] Criar controller `ParceiroDashboardController`
- [ ] Criar método `index()` com demandas filtradas por região (15km)
- [ ] Criar template Edge para dashboard com lista de demandas
- [ ] Implementar mapa com pins coloridos por urgência (Bootstrap + Alpine.js)
- [ ] Implementar filtros avançados: tipo, prazo, valor estimado
- [ ] Exibir detalhes parciais (sem endereço completo)
- [ ] Implementar paginação
- [ ] Criar rota GET `/parceiro/dashboard`
**Critérios de Aceite:**
- CA2: Parceiro só vê demandas num raio de 15km
- Mapa com pins funcionais
- Filtros avançados funcionais
**Dependências:** T029, T031  
**Prioridade:** 🔴 Crítica  

---

### **T036** - Implementar sistema de bidding (lances)
**Tags:** `#backend` `#frontend` `#bidding` `#validation`  
**Descrição:** Criar sistema para parceiros enviarem propostas/lances.  
**Subtarefas:**
- [ ] Criar validator para propostas (valor >= 50, prazo <= 48h, observações <= 500 chars)
- [ ] Criar controller `PropostasController` com método `store()`
- [ ] Criar service `PropostaService` com lógica de bidding
- [ ] Validar que parceiro não pode propor para demanda fora do seu raio
- [ ] Validar que parceiro só pode enviar 1 proposta por demanda
- [ ] Implementar verificação de dados de contato nas observações
- [ ] Criar template Edge para formulário de proposta
- [ ] Criar rota POST `/demandas/:id/propostas`
- [ ] Implementar notificação ao cliente quando receber proposta
**Critérios de Aceite:**
- Proposta criada com validações corretas
- Parceiro só vê demandas no seu raio
- Notificação enviada ao cliente
**Dependências:** T034, T035  
**Prioridade:** 🔴 Crítica  

---

### **T037** - Implementar chat com anti-fraude
**Tags:** `#backend` `#frontend` `#chat` `#antifraud` `#edge-case`  
**Descrição:** Criar sistema de chat entre cliente e parceiro com detecção de fraude.  
**Subtarefas:**
- [ ] Criar migration `chat_messages` (id, demanda_id, sender_id, receiver_id, message, hash_integrity, created_at)
- [ ] Criar model `ChatMessage` com relacionamentos
- [ ] Criar controller `ChatController` com métodos `index()`, `store()`
- [ ] Criar service `ChatService` para gerenciar mensagens
- [ ] Criar service `AntiFraudService` com regex para detecção:
  - Telefones: `11 9\d{4}-\d{4}` ou variações
  - Emails: `\w+@\w+\.\w+`
  - Palavras: whatsapp, zap, telegram, etc.
- [ ] Implementar bloqueio de mensagens com contato externo
- [ ] Retornar mensagem ao usuário quando contato detectado
- [ ] Registrar tentativas recorrentes em audit_logs
- [ ] Implementar trilha de auditoria: timestamp, autor, mensagem, hash
- [ ] Criar template Edge para chat (Alpine.js para polling)
- [ ] Implementar fila de mensagens para retry se offline
- [ ] Criar testes unitários para regex anti-fraude (100 amostras)
**Critérios de Aceite:**
- CA1: Sistema detecta e bloqueia 95% das tentativas de contato externo
- CA4: Chat registra timestamp, autor, mensagem e hash de integridade
- Mensagens de feedback claras ao usuário
- Retry funcional quando offline
**Dependências:** T034  
**Prioridade:** 🔴 Crítica  

---

### **T038** - Implementar escolha de proposta pelo cliente
**Tags:** `#backend` `#frontend` `#bidding`  
**Descrição:** Criar interface para cliente comparar e selecionar proposta.  
**Subtarefas:**
- [ ] Criar método `listPropostas()` no controller
- [ ] Criar template Edge para comparação lado a lado
- [ ] Exibir perfil do parceiro (avaliações, verificações)
- [ ] Exibir valor, prazo e observações de cada proposta
- [ ] Implementar ordenação por timestamp (em caso de propostas iguais)
- [ ] Criar método `selecionarProposta()` com confirmação em 2 passos
- [ ] Criar service para processar seleção
- [ ] Atualizar status da demanda para `em_andamento`
- [ ] Notificar parceiro selecionado
- [ ] Notificar parceiros não selecionados
- [ ] Iniciar timer de 48h para escolha (com reminder às 24h e 40h)
**Critérios de Aceite:**
- CA3: Cliente tem 48h para escolher proposta
- Notificações de reminder às 24h e 40h
- Comparação lado a lado funcional
- Confirmação em 2 passos
**Dependências:** T036, T037  
**Prioridade:** 🔴 Crítica  

---

### **T039** - Implementar timer de expiração de propostas
**Tags:** `#backend` `#database` `#bidding`  
**Descrição:** Criar sistema de timer para expirar demandas sem proposta selecionada.  
**Subtarefas:**
- [ ] Criar job agendado `VerificarDemandasExpiradas`
- [ ] Rodar job a cada hora
- [ ] Verificar demandas com propostas não selecionadas há > 48h
- [ ] Alterar status para `expirada`
- [ ] Notificar cliente sobre expiração
- [ ] Notificar todos os licitantes
- [ ] Oferecer opção de extensão automática
- [ ] Registrar em audit_logs
**Critérios de Aceite:**
- Demandas expiram corretamente após 48h
- Notificações enviadas a todos os envolvidos
**Dependências:** T038  
**Prioridade:** 🟡 Alta  

---

### **T040** - Implementar cancelamento de demanda durante bidding
**Tags:** `#backend` `#notifications` `#edge-case`  
**Descrição:** Permitir que cliente cancele demanda durante período de bidding.  
**Subtarefas:**
- [ ] Criar método `cancelarDemanda()` no service `DemandaService`
- [ ] Validar que demanda só pode ser cancelada se status = `publicada`
- [ ] Atualizar status para `cancelada`
- [ ] Notificar todos os licitantes em até 5 minutos (CA5)
- [ ] Enviar email com justificativa (opcional)
- [ ] Registrar em audit_logs
- [ ] Criar endpoint POST `/demandas/:id/cancelar`
**Critérios de Aceite:**
- CA5: Cancelamento notifica todos os licitantes em até 5 minutos
- Status atualizado corretamente
- Logs de auditoria registrados
**Dependências:** T038, T030  
**Prioridade:** 🟡 Alta  

---

### **T041** - Implementar ranking de parceiros
**Tags:** `#backend` `#matching`  
**Descrição:** Criar sistema de ranking para ordenar propostas.  
**Subtarefas:**
- [ ] Criar service `RankingService` com método `calculateScore()`
- [ ] Fatores de score: tempo na plataforma, demandas concluídas, avaliações, KYC aprovado
- [ ] Implementar ordenação de propostas por score + timestamp
- [ ] Exibir score no dashboard do parceiro
- [ ] Criar testes unitários para cálculo de ranking
**Critérios de Aceite:**
- Propostas ordenadas corretamente
- Score calculado com fatores ponderados
**Dependências:** T036  
**Prioridade:** 🟢 Média  

---

### **T042** - Criar testes da Fase 3
**Tags:** `#testing` `#backend` `#frontend`  
**Descrição:** Escrever testes unitários e funcionais para funcionalidades da Fase 3.  
**Subtarefas:**
- [ ] Testes unitários para `PropostaService` (> 80% cobertura)
- [ ] Testes unitários para `ChatService`
- [ ] Testes unitários para `AntiFraudService` (100 amostras de padrões)
- [ ] Testes unitários para `RankingService`
- [ ] Testes funcionais para POST `/demandas/:id/propostas`
- [ ] Testes funcionais para chat (enviar/receber mensagens, auditoria)
- [ ] Testes de navegador para dashboard de propostas
- [ ] Testes de navegador para comparação lado a lado
**Critérios de Aceite:**
- Todos os services com > 80% cobertura
- Anti-fraude detectando 95%+ dos padrões
- Testes funcionais e de navegador passando
**Dependências:** T034-T041  
**Prioridade:** 🟡 Alta  

---

## 💰 FASE 4 - PAGAMENTO & ESCROW

**Sprints:** 7-8 (4 semanas)  
**Objetivo:** Garantir segurança financeira para ambos os lados  

---

### **T043** - Criar migrations para pagamentos
**Tags:** `#database` `#payments`  
**Descrição:** Criar tabelas `pagamentos` e `escrow_transactions` para sistema de pagamento.  
**Subtarefas:**
- [ ] Criar migration `pagamentos` com: id, demanda_id, client_id, valor_total, valor_comissao (15%), valor_parceiro (85%), metodo (pix/cartao), asaas_payment_id, status (pendente/aprovado/recusado/estornado), pago_em, created_at, updated_at
- [ ] Criar migration `escrow_transactions` com: id, pagamento_id, type (reserve/release/refund), amount, status, processed_at, created_at
- [ ] Criar models `Pagamento` e `EscrowTransaction` com relacionamentos
- [ ] Adicionar índices em `demanda_id`, `status`, `asaas_payment_id`
**Critérios de Aceite:**
- Migrations e rollbacks testados
- Models com relacionamentos funcionais
**Dependências:** T022, T034  
**Prioridade:** 🔴 Crítica  

---

### **T044** - Implementar checkout transparente
**Tags:** `#backend` `#frontend` `#payments`  
**Descrição:** Criar interface de checkout para pagamento da demanda.  
**Subtarefas:**
- [ ] Criar controller `CheckoutController` com método `show()`
- [ ] Criar template Edge para checkout (valor, método de pagamento, botão confirmar)
- [ ] Implementar seleção de método (Pix ou Cartão)
- [ ] Exibir resumo: valor total, comissão Muvia (15%), valor ao parceiro (85%)
- [ ] Criar método `process()` para iniciar pagamento
- [ ] Integrar com `AsaasService` para criar cobrança
- [ ] Redirecionar para URL de pagamento do Asaas (ou QR Code Pix)
- [ ] Implementar timeout de 30s para processamento (CA1)
**Critérios de Aceite:**
- CA1: Pagamento processado em < 30 segundos
- Resumo com valores corretos
- Redirecionamento para Asaas funcional
**Dependências:** T012, T043  
**Prioridade:** 🔴 Crítica  

---

### **T045** - Implementar webhook do Asaas
**Tags:** `#backend` `#payments` `#webhooks` `#edge-case`  
**Descrição:** Criar endpoint para receber webhooks do Asaas sobre status de pagamento.  
**Subtarefas:**
- [ ] Criar rota POST `/webhooks/asaas`
- [ ] Criar controller `WebhookController` com método `asaasPayment()`
- [ ] Implementar validação de assinatura do webhook
- [ ] Implementar idempotência por evento ID (evitar duplicação)
- [ ] Criar service `WebhookService` para processar eventos
- [ ] Mapear eventos Asaas → status interno:
  - `PAYMENT_RECEIVED` → `pendente`
  - `PAYMENT_CONFIRMED` → `aprovado`
  - `PAYMENT_OVERDUE` → `expirado`
  - `PAYMENT_REFUNDED` → `estornado`
- [ ] Atualizar status do pagamento
- [ ] Processar escrow (reservar/liberar fundos)
- [ ] Notificar cliente e parceiro sobre mudança de status
- [ ] Registrar em audit_logs
- [ ] Implementar retry em caso de falha de processamento
**Critérios de Aceite:**
- Webhook validado por assinatura
- Idempotência funcional (eventos duplicados ignorados)
- Status atualizado corretamente
**Dependências:** T012, T044  
**Prioridade:** 🔴 Crítica  

---

### **T046** - Implementar fallback de polling para webhooks
**Tags:** `#backend` `#payments` `#webhooks` `#edge-case`  
**Descrição:** Criar job de polling para verificar status de pagamento caso webhook falhe.  
**Subtarefas:**
- [ ] Criar job `PollingPagamentoStatus` 
- [ ] Rodar job a cada 5 minutos
- [ ] Consultar API Asaas para pagamentos pendentes há > 5min
- [ ] Atualizar status local se diferente do status Asaas
- [ ] Limitar a 5 tentativas por pagamento
- [ ] Registrar falhas em audit_logs
- [ ] Alertar equipe após 5 falhas consecutivas
- [ ] Criar testes funcionais para fallback
**Critérios de Aceite:**
- CA4: Webhook tem fallback de polling a cada 5min (máx 5 tentativas)
- Status sincronizado corretamente
- Falhas registradas e alertadas
**Dependências:** T045  
**Prioridade:** 🔴 Crítica  

---

### **T047** - Implementar sistema de escrow (custódia)
**Tags:** `#backend` `#database` `#escrow` `#payments`  
**Descrição:** Criar sistema de custódia para reter fundos até confirmação de entrega.  
**Subtarefas:**
- [ ] Criar service `EscrowService` com métodos:
  - `reserve()` - reservar fundos após pagamento aprovado
  - `release()` - liberar fundos ao parceiro após confirmação de entrega
  - `refund()` - reembolsar cliente em caso de cancelamento
- [ ] Implementar fluxo de status: `reservado` → `em_transporte` → `disponivel`
- [ ] Registrar cada transação em `escrow_transactions`
- [ ] Calcular comissão Muvia (15%) corretamente (CA2)
- [ ] Calcular valor ao parceiro (85%) corretamente
- [ ] Implementar validação de valores (margem de erro R$ 0,01)
- [ ] Criar testes unitários com 10 valores diferentes (CA2)
- [ ] Registrar todas as operações em audit_logs
**Critérios de Aceite:**
- CA2: Comissão de 15% calculada corretamente (margem de erro R$ 0,01)
- Fluxo de status funcional
- Todos os valores auditáveis
**Dependências:** T045  
**Prioridade:** 🔴 Crítica  

---

### **T048** - Implementar política de cancelamento
**Tags:** `#backend` `#escrow` `#payments` `#edge-case`  
**Descrição:** Criar sistema de cancelamento com regras de reembolso.  
**Subtarefas:**
- [ ] Criar service `CancelamentoService` com método `cancelar()`
- [ ] Implementar regra: > 12h antes = 100% reembolso ao cliente (CA3)
- [ ] Implementar regra: < 12h antes = 90% reembolso + R$ 50 ao parceiro (CA3)
- [ ] Implementar regra: em andamento = 0% reembolso, valor total - comissão ao parceiro
- [ ] Calcular tempo até início do serviço para aplicar regra correta
- [ ] Processar reembolso via Asaas
- [ ] Atualizar status do pagamento para `estornado`
- [ ] Notificar cliente e parceiro
- [ ] Registrar em audit_logs (quem, quando, quanto, status)
- [ ] Criar endpoint POST `/demandas/:id/cancelar`
- [ ] Criar testes unitários com diferentes cenários de tempo
**Critérios de Aceite:**
- CA3: Cancelamento respeita política de prazos
- CA5: Valores auditáveis com trilha completa
- Reembolso processado corretamente
**Dependências:** T047  
**Prioridade:** 🔴 Crítica  

---

### **T049** - Implementar notificações de pagamento
**Tags:** `#backend` `#notifications` `#payments`  
**Descrição:** Criar sistema de notificação sobre status de pagamento.  
**Subtarefas:**
- [ ] Criar listener para evento `PagamentoAprovado`
- [ ] Enviar confirmação ao cliente (email)
- [ ] Enviar alerta ao parceiro para iniciar serviço (email/session flash)
- [ ] Enviar comprovante por email
- [ ] Criar listener para evento `PagamentoRecusado`
- [ ] Notificar cliente sobre recusa
- [ ] Oferecer opção de nova tentativa
- [ ] Criar templates de email para cada tipo de notificação
**Critérios de Aceite:**
- Notificações enviadas para ambos os lados
- Comprovante por email funcional
**Dependências:** T045  
**Prioridade:** 🟡 Alta  

---

### **T050** - Implementar prevenção e tratamento de chargeback
**Tags:** `#backend` `#payments` `#edge-case`  
**Descrição:** Criar sistema para detectar e tratar chargebacks.  
**Subtarefas:**
- [ ] Criar método `handleChargeback()` no `WebhookService`
- [ ] Processar evento `PAYMENT_CHARGEBACK` do Asaas
- [ ] Bloquear usuário envolvido para análise
- [ ] Registrar em audit_logs
- [ ] Notificar equipe para análise manual
- [ ] Implementar sistema de análise de risco
- [ ] Criar endpoint admin para revisar chargebacks
**Critérios de Aceite:**
- Chargeback detectado e processado
- Usuário bloqueado para análise
- Equipe notificada
**Dependências:** T045  
**Prioridade:** 🟢 Média  

---

### **T051** - Implementar prevenção de duplo pagamento
**Tags:** `#backend` `#payments` `#edge-case`  
**Descrição:** Detectar e tratar duplo pagamento acidental.  
**Subtarefas:**
- [ ] Criar método `detectarDuploPagamento()` no `PagamentoService`
- [ ] Verificar se demanda já possui pagamento aprovado
- [ ] Implementar reembolso automático em caso de duplo pagamento
- [ ] Notificar cliente sobre reembolso
- [ ] Registrar em audit_logs
- [ ] Criar testes funcionais para cenário de duplo pagamento
**Critérios de Aceite:**
- Duplo pagamento detectado
- Reembolso automático processado
**Dependências:** T047  
**Prioridade:** 🟢 Média  

---

### **T052** - Criar testes da Fase 4
**Tags:** `#testing` `#backend`  
**Descrição:** Escrever testes unitários e funcionais para funcionalidades da Fase 4.  
**Subtarefas:**
- [ ] Testes unitários para `EscrowService` (cálculo de comissão com 10 valores)
- [ ] Testes unitários para `CancelamentoService` (política de prazos)
- [ ] Testes unitários para `WebhookService` (idempotência, retry)
- [ ] Testes funcionais para webhook Asaas (mock)
- [ ] Testes de integração com Asaas sandbox (fluxo real de pagamento)
- [ ] Testes de navegador para checkout
- [ ] Testes de timeout (simular API lenta > 10s)
**Critérios de Aceite:**
- Comissão calculada corretamente em 10 cenários diferentes
- Idempotência testada e funcional
- Testes de integração com Asaas sandbox passando
**Dependências:** T043-T051  
**Prioridade:** 🟡 Alta  

---

## 🚚 FASE 5 - EXECUÇÃO & ENTREGA

**Sprints:** 9-10 (4 semanas)  
**Objetivo:** Finalizar o ciclo completo com segurança  

---

### **T053** - Criar migrations para entregas
**Tags:** `#database` `#delivery`  
**Descrição:** Criar tabela `entregas` para registrar confirmações de entrega.  
**Subtarefas:**
- [ ] Criar migration `entregas` com: id, demanda_id, qr_code_token, qr_code_expires_at, token_numerico (6 dígitos), status (pendente/em_andamento/confirmada), confirmado_por, confirmado_em, checklist (JSONB), assinatura_digital (URL), created_at, updated_at
- [ ] Criar índices em `demanda_id`, `status`, `qr_code_token`
- [ ] Criar model `Entrega` com relacionamento belongsTo Demanda
- [ ] Criar enum para `status`
**Critérios de Aceite:**
- Migration e rollback testados
- Model com relacionamentos funcionais
**Dependências:** T022  
**Prioridade:** 🔴 Crítica  

---

### **T054** - Implementar liberação gradual de endereços
**Tags:** `#backend` `#execution` `#edge-case`  
**Descrição:** Criar sistema para revelar endereços conforme status do serviço.  
**Subtarefas:**
- [ ] Criar service `AddressRevealService` com métodos:
  - `revealOrigin()` - revelar endereço de origem após pagamento confirmado (CA2)
  - `revealDestination()` - revelar endereço de destino após início do transporte (CA2)
- [ ] Implementar verificação de status antes de revelar
- [ ] Criar endpoint GET `/demandas/:id/endereco/origem`
- [ ] Criar endpoint GET `/demandas/:id/endereco/destino`
- [ ] Descriptografar endereço apenas se status permitir
- [ ] Registrar acesso em audit_logs
- [ ] Implementar cache local para motoristas sem sinal
- [ ] Criar testes funcionais para cada cenário de liberação
**Critérios de Aceite:**
- CA2: Origem revelada após pagamento confirmado; destino após início do transporte
- Endereços descriptografados corretamente
- Acessos registrados em audit_logs
**Dependências:** T015, T047  
**Prioridade:** 🔴 Crítica  

---

### **T055** - Implementar geração de QR Code
**Tags:** `#backend` `#frontend` `#qrcode`  
**Descrição:** Criar sistema de geração de QR Code único por serviço.  
**Subtarefas:**
- [ ] Instalar biblioteca de QR Code (qrcode ou similar)
- [ ] Criar service `QrCodeService` com método `generate()`
- [ ] Gerar token único (UUID ou similar)
- [ ] Criar URL de confirmação com token
- [ ] Gerar imagem QR Code (PNG)
- [ ] Salvar token e expiração (24h) em `entregas` (CA1)
- [ ] Gerar token numérico de 6 dígitos como fallback (CA1)
- [ ] Criar endpoint GET `/entrega/:token/qr` para exibir QR Code
- [ ] Criar template Edge para exibir QR Code
- [ ] Implementar verificação de expiração
- [ ] Criar testes unitários para geração e validação
**Critérios de Aceite:**
- CA1: QR Code contém URL/token único com expiração em 24h
- Fallback de token numérico de 6 dígitos funcional
- QR Code legível
**Dependências:** T053  
**Prioridade:** 🔴 Crítica  

---

### **T056** - Implementar confirmação de entrega via QR Code
**Tags:** `#backend` `#frontend` `#delivery` `#qrcode`  
**Descrição:** Criar sistema de confirmação de entrega via escaneamento de QR Code.  
**Subtarefas:**
- [ ] Criar controller `EntregaController` com método `confirmar()`
- [ ] Criar rota GET `/entrega/:token/confirmar`
- [ ] Validar token e expiração
- [ ] Se token válido, exibir formulário de confirmação
- [ ] Implementar checklist de itens (opcional, Alpine.js)
- [ ] Implementar upload de fotos de comprovação (opcional)
- [ ] Implementar assinatura digital no celular (canvas signature)
- [ ] Criar método `processarConfirmacao()` 
- [ ] Atualizar status da entrega para `confirmada`
- [ ] Registrar timestamp, usuário confirmador, QR code escaneado (CA4)
- [ ] Disparar evento `EntregaConfirmada`
- [ ] Criar template Edge para confirmação
**Critérios de Aceite:**
- CA4: Sistema registra timestamp, QR code escaneado, usuário confirmador
- Checklist opcional funcional
- Assinatura digital capturada
**Dependências:** T055  
**Prioridade:** 🔴 Crítica  

---

### **T057** - Implementar fallback de token numérico
**Tags:** `#backend` `#frontend` `#qrcode` `#edge-case`  
**Descrição:** Permitir confirmação de entrega via token numérico digitável.  
**Subtarefas:**
- [ ] Criar rota GET `/entrega/token` para input manual
- [ ] Criar template Edge para input de token numérico (6 dígitos)
- [ ] Validar token numérico contra `entregas` table
- [ ] Se válido, seguir mesmo fluxo de confirmação do QR Code
- [ ] Implementar expiração de 24h para token também
- [ ] Criar testes funcionais para token válido e inválido
**Critérios de Aceite:**
- Token numérico aceita e confirma corretamente
- Mesma validação de expiração do QR Code
**Dependências:** T056  
**Prioridade:** 🟡 Alta  

---

### **T058** - Implementar repasse financeiro automático
**Tags:** `#backend` `#escrow` `#payments`  
**Descrição:** Liberar fundos ao parceiro após confirmação de entrega.  
**Subtarefas:**
- [ ] Criar listener para evento `EntregaConfirmada`
- [ ] Criar service `RepasseService` com método `liberar()`
- [ ] Verificar status do escrow (deve estar `reservado`)
- [ ] Liberar fundos ao parceiro (85% do valor)
- [ ] Processar saque automático via Pix (Asaas)
- [ ] Atualizar status do escrow para `disponivel` → `liberado`
- [ ] Registrar transação em `escrow_transactions`
- [ ] Notificar parceiro sobre repasse (email)
- [ ] Implementar repasse em < 1h após confirmação (CA3)
- [ ] Registrar em audit_logs
- [ ] Criar testes funcionais para repasse
**Critérios de Aceite:**
- CA3: Repasse financeiro ocorre em < 1h após confirmação
- Fundos liberados corretamente (85%)
- Parceiro notificado
**Dependências:** T047, T056  
**Prioridade:** 🔴 Crítica  

---

### **T059** - Implementar sistema de disputas pós-entrega
**Tags:** `#backend` `#frontend` `#delivery` `#edge-case`  
**Descrição:** Criar sistema para registrar disputas em até 7 dias após entrega.  
**Subtarefas:**
- [ ] Criar migration `disputas` (id, entrega_id, opened_by, description (máx 1000 chars), fotos (JSONB), status (aberta/em_analise/resolvida), resolution, resolved_by, resolved_at, created_at)
- [ ] Criar model `Disputa` com relacionamentos
- [ ] Criar controller `DisputasController` com métodos `store()`, `index()`, `resolve()`
- [ ] Criar service `DisputaService` para gerenciar disputas
- [ ] Validar que disputa só pode ser aberta em até 7 dias após entrega
- [ ] Implementar upload de fotos para comprovação
- [ ] Implementar descrição com máx 1000 chars
- [ ] Criar template Edge para abrir disputa
- [ ] Criar template Edge para admin revisar disputa
- [ ] Notificar equipe sobre nova disputa
- [ ] Registrar em audit_logs
- [ ] Criar testes funcionais
**Critérios de Aceite:**
- CA5: Disputas podem ser abertas em até 7 dias com upload de fotos e descrição (máx 1000 chars)
- Disputas processadas corretamente
- Equipe notificada
**Dependências:** T056  
**Prioridade:** 🟡 Alta  

---

### **T060** - Implementar notificação de expiração de QR Code
**Tags:** `#backend` `#notifications` `#qrcode` `#edge-case`  
**Descrição:** Notificar parceiro se cliente não escaneia QR Code em 24h.  
**Subtarefas:**
- [ ] Criar job `VerificarQrCodeExpirados`
- [ ] Rodar job a cada hora
- [ ] Verificar entregas com QR Code expirado e não confirmado
- [ ] Notificar parceiro sobre expiração
- [ ] Oferecer opção de reagendamento
- [ ] Implementar lembrete antes de expirar (20h)
- [ ] Registrar em audit_logs
**Critérios de Aceite:**
- Parceiro notificado sobre expiração
- Opção de reagendamento disponível
**Dependências:** T055  
**Prioridade:** 🟢 Média  

---

### **T061** - Implementar sistema de reagendamento com taxa
**Tags:** `#backend` `#payments` `#edge-case`  
**Descrição:** Permitir reagendamento de entrega com taxa adicional se necessário.  
**Subtarefas:**
- [ ] Criar service `ReagendamentoService` com método `reagendar()`
- [ ] Implementar cálculo de taxa adicional (configurável)
- [ ] Criar endpoint POST `/demandas/:id/reagendar`
- [ ] Processar pagamento da taxa adicional
- [ ] Atualizar data agendada da demanda
- [ ] Gerar novo QR Code
- [ ] Notificar ambos os lados
- [ ] Registrar em audit_logs
**Critérios de Aceite:**
- Reagendamento com taxa adicional funcional
- Novo QR Code gerado
**Dependências:** T055, T044  
**Prioridade:** 🟢 Média  

---

### **T062** - Criar testes da Fase 5
**Tags:** `#testing` `#backend` `#frontend`  
**Descrição:** Escrever testes unitários e funcionais para funcionalidades da Fase 5.  
**Subtarefas:**
- [ ] Testes unitários para `QrCodeService` (geração, validação, expiração)
- [ ] Testes unitários para `AddressRevealService` (liberação gradual)
- [ ] Testes unitários para `RepasseService` (liberação de fundos)
- [ ] Testes unitários para `DisputaService` (abertura, resolução)
- [ ] Testes funcionais para POST `/entrega/confirmar`
- [ ] Testes funcionais para GET `/endereco/:id` (revelação gradual)
- [ ] Testes de navegador para scan de QR Code
- [ ] Testes de navegador para checklist de entrega
**Critérios de Aceite:**
- Todos os services com > 80% cobertura
- Testes funcionais e de navegador passando
**Dependências:** T053-T061  
**Prioridade:** 🟡 Alta  

---

## 🚀 TAREFAS TRANSVERSAIS (Todas as Fases)

---

### **T063** - Configurar CI/CD pipeline
**Tags:** `#devops`  
**Descrição:** Configurar integração e deploy contínuos.  
**Subtarefas:**
- [ ] Configurar GitHub Actions ou similar
- [ ] Pipeline de testes: rodar testes unitários e funcionais em PRs
- [ ] Pipeline de lint: rodar ESLint e typecheck
- [ ] Pipeline de build: gerar build de produção
- [ ] Pipeline de deploy: deploy automático em staging após merge
- [ ] Configurar ambientes: development, staging, production
**Critérios de Aceite:**
- PRs exigem testes passando para merge
- Deploy automático em staging após merge na main
**Dependências:** T001  
**Prioridade:** 🟡 Alta  

---

### **T064** - Configurar monitoring e alertas
**Tags:** `#devops` `#docs`  
**Descrição:** Configurar monitoring básico e alertas para o sistema.  
**Subtarefas:**
- [ ] Configurar health check endpoint GET `/health`
- [ ] Implementar checks: banco de dados, Redis, S3, Asaas
- [ ] Configurar monitoring de uptime (a cada 5min)
- [ ] Configurar alertas para:
  - Falhas de pagamento
  - Atraso de webhook (> 10min sem resposta)
  - Spikes de erro 5xx (> 5% dos requests)
  - Uploads falhando (> 10% falha rate)
- [ ] Configurar dashboard básico (Grafana ou similar)
- [ ] Documentar runbook para cada alerta
**Critérios de Aceite:**
- Health check retornando status de dependências
- Alertas configurados e funcionais
- Runbooks documentados
**Dependências:** T001  
**Prioridade:** 🟡 Alta  

---

### **T065** - Configurar logs estruturados com correlation ID
**Tags:** `#backend` `#logging` `#devops`  
**Descrição:** Implementar logging estruturado com correlation ID em todas as requests.  
**Subtarefas:**
- [ ] Configurar middleware para gerar request ID (UUID)
- [ ] Adicionar request ID em todos os logs
- [ ] Configurar Pino para output em JSON
- [ ] Configurar log rotation e retenção (3 anos para audit_logs)
- [ ] Implementar correlation ID para chamadas ao Asaas
- [ ] Configurar agregação de logs (ELK ou similar)
**Critérios de Aceite:**
- Todos os logs com request ID
- Formato JSON estruturado
- Log rotation funcional
**Dependências:** T014  
**Prioridade:** 🟡 Alta  

---

### **T066** - Implementar timeouts e retries para integrações externas
**Tags:** `#backend` `#security`  
**Descrição:** Configurar timeouts e retries com backoff para todas as integrações externas.  
**Subtarefas:**
- [ ] Criar wrapper HTTP client com timeout configurável
- [ ] Configurar timeout padrão de 10s
- [ ] Implementar retry com backoff exponencial (3 retries)
- [ ] Implementar para: Asaas, Geocodificação, S3/R2
- [ ] Registrar falhas em audit_logs
- [ ] Criar testes para simular timeouts
**Critérios de Aceite:**
- Timeouts funcionais em todas as integrações
- Retries com backoff funcionando
- Falhas registradas
**Dependências:** T012  
**Prioridade:** 🟡 Alta  

---

### **T067** - Documentar fluxos e rotas do sistema
**Tags:** `#docs`
**Descrição:** Documentar os fluxos de usuário e rotas do sistema SSR para referência do time.
**Subtarefas:**
- [ ] Documentar fluxos de usuário (cadastro → publicação → proposta → pagamento → entrega)
- [ ] Documentar todas as rotas do sistema (controller → template Edge)
- [ ] Documentar eventos/listeners (ex: `DemandaPublicada`, `EntregaConfirmada`)
- [ ] Documentar jobs agendados e frequências
- [ ] Documentar middlewares e suas responsabilidades
- [ ] Manter documento atualizado conforme mudanças no código
**Critérios de Aceite:**
- Fluxos principais documentados e acessíveis ao time
- Rotas mapeadas com descrição de cada uma
- Eventos e jobs documentados
**Dependências:** T001-T062
**Prioridade:** 🟢 Média

---

### **T068** - Criar documentação de deploy e operações
**Tags:** `#docs` `#devops`  
**Descrição:** Documentar processos de deploy, rollback e operações.  
**Subtarefas:**
- [ ] Documentar processo de deploy (staging e production)
- [ ] Documentar processo de rollback
- [ ] Documentar variáveis de ambiente necessárias
- [ ] Documentar comandos de manutenção (migrations, seeds, jobs)
- [ ] Criar runbook para incidentes comuns
- [ ] Documentar política de backup do banco de dados
- [ ] Documentar política de retenção de dados (LGPD)
**Critérios de Aceite:**
- Documentação completa e acessível
- Runbooks para incidentes
**Dependências:** T021, T063  
**Prioridade:** 🟢 Média  

---

## 📊 RESUMO DE TAREFAS POR FASE

| **Fase** | **Qtd Tarefas** | **Prioridade Crítica** | **Prioridade Alta** | **Prioridade Média** |
|----------|-----------------|------------------------|---------------------|---------------------|
| **Fase 1** | 21 | 14 | 5 | 2 |
| **Fase 2** | 12 | 6 | 5 | 1 |
| **Fase 3** | 9 | 5 | 3 | 1 |
| **Fase 4** | 10 | 7 | 2 | 1 |
| **Fase 5** | 10 | 5 | 3 | 2 |
| **Transversal** | 6 | 0 | 5 | 1 |
| **TOTAL** | **68** | **37** | **23** | **8** |

---

## 🏷️ RESUMO DE TAREFAS POR TAG

| **Tag** | **Qtd Tarefas** | **Tarefas** |
|---------|-----------------|-------------|
| `#backend` | 45 | T001, T003, T004, T005, T006, T008, T009, T011, T012, T014, T015, T016, T017, T018, T019, T020, T023, T024, T025, T026, T027, T028, T029, T030, T031, T032, T035, T036, T037, T038, T039, T040, T041, T044, T045, T046, T047, T048, T049, T050, T051, T054, T055, T056, T065, T066 |
| `#frontend` | 20 | T004, T005, T006, T008, T009, T020, T023, T024, T025, T026, T031, T035, T036, T037, T038, T044, T055, T056, T057, T059 |
| `#database` | 17 | T002, T006, T007, T010, T013, T015, T018, T022, T027, T034, T039, T043, T047, T053, T059 |
| `#testing` | 9 | T019, T020, T033, T042, T052, T062 |
| `#security` | 11 | T003, T005, T014, T015, T016, T032, T066 |
| `#payments` | 13 | T012, T043, T044, T045, T046, T047, T048, T049, T050, T051, T058, T061 |
| `#edge-case` | 20 | T008, T012, T032, T037, T040, T045, T046, T048, T050, T051, T054, T057, T059, T060, T061 |
| `#lgpd` | 6 | T002, T007, T015, T017, T018 |
| `#devops` | 8 | T001, T021, T063, T064, T065, T068 |
| `#docs` | 5 | T001, T021, T064, T067, T068 |

---

## 📋 DEPENDÊNCIAS CRÍTICAS

### Caminho Crítico (Critical Path)
```
T001 → T002 → T003 → T004 → T005 → T006 → T008 → T009 → T011 → T012 → 
T022 → T023 → T024 → T025 → T026 → T034 → T035 → T036 → T037 → T038 → 
T043 → T044 → T045 → T047 → T048 → T053 → T054 → T055 → T056 → T058
```

### Tarefas Bloqueadoras
| **Tarefa** | **Bloqueia** | **Fase Impactada** |
|------------|--------------|-------------------|
| T001 | Todas as tarefas | Todas |
| T002 | T004, T007, T010, T013, T015, T022 | Fase 1, 2 |
| T012 | T044, T045 | Fase 4 |
| T022 | T034, T043, T053 | Fase 3, 4, 5 |
| T047 | T048, T058 | Fase 4, 5 |

---

## 📈 MÉTRICAS DE ACOMPANHAMENTO

### Progresso por Fase
- **Fase 1:** 0/21 tarefas concluídas (0%)
- **Fase 2:** 0/12 tarefas concluídas (0%)
- **Fase 3:** 0/9 tarefas concluídas (0%)
- **Fase 4:** 0/10 tarefas concluídas (0%)
- **Fase 5:** 0/10 tarefas concluídas (0%)
- **Transversal:** 0/6 tarefas concluídas (0%)
- **TOTAL:** 0/68 tarefas concluídas (0%)

### Prioridade de Execução
1. 🔴 **Crítica:** 37 tarefas - devem ser concluídas para MVP funcionar
2. 🟡 **Alta:** 23 tarefas - importantes para qualidade e segurança
3. 🟢 **Média:** 8 tarefas - melhorias e compliance

---

**📧 Responsável pela Análise:** Tech Lead Muvia  
**🔄 Atualização:** Semanal toda segunda-feira  
**📊 Status Report:** Sprint Review ao final de cada sprint

---

*"Uma tarefa bem definida é meio caminho andado para a entrega."*
