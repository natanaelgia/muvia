# 🚀 Roadmap de Implementação - Muvia MVP

**Versão:** 1.1
**Data:** 07 de Março de 2026
**Última Revisão:** 09 de Abril de 2026
**Status:** Documento de Discovery & Refinement
**Stakeholder:** Equipe de Desenvolvimento Muvia
**Aprovado por:** Product Owner Muvia

---

## 📋 RESUMO EXECUTIVO

Este documento apresenta o **roadmap estruturado de implementação** do Muvia MVP, baseado na análise do PRD existente e seguindo a mentalidade de "**Pessimista Saudável**". O roadmap está dividido em **5 fases sequenciais** com duração estimada de **10 sprints** (20 semanas), focando na **minimização de riscos** e **entrega incremental de valor**.

### ⏱️ **Duração dos Sprints**
- **1 sprint = 2 semanas**
- **10 sprints = 20 semanas no total**
- Cada fase dura 2 sprints (4 semanas)

### 🎯 **Princípios de Priorização:**
1. **Segurança primeiro** - Prevenir fraudes e proteger dados
2. **Menor esforço, maior valor** - MVP enxuto mas funcional
3. **Edge cases críticos** - Antecipar falhas antes que aconteçam
4. **Validação contínua** - Feedback em cada fase

---

## 🔍 ANÁLISE DE RISCOS PRÉ-IMPLEMENTAÇÃO

### 🚨 RISCOS CRÍTICOS IDENTIFICADOS

| **Risco** | **Impacto** | **Probabilidade** | **Mitigação** |
|-----------|-------------|-------------------|----------------|
| **Fraude no Chat** | Alto | Alta | Sistema anti-fraude + moderação humana |
| **Cálculo de Taxas/Escrow** | Alto | Média | Testes extensivos + auditoria financeira |
| **Privacidade de Endereços** | Alto | Média | Revelação gradual + permissões granulares |
| **Performance de Upload** | Médio | Alta | Compressão + CDN + validação de tamanho |
| **Integração Asaas** | Alto | Baixa | Sandbox + fallback + logs detalhados |

### ⚠️ **DEPENDÊNCIAS EXTERNAS CRÍTICAS**
- **Asaas:** Gateway de pagamento (disponibilidade 99.9%)
  - Webhooks: `POST /payments`, `POST /transactions`
  - Sandbox disponível para testes
  - Documentação: https://docs.asaas.com/reference
- **Serviços de Mapa:** Geocodificação e distância
  - Provedor inicial: OpenStreetMap/Nominatim (gratuito)
  - Fallback: Google Maps API (se necessário pós-MVP)
  - Uso: geocodificação de endereços, cálculo de distância aproximada
- **Armazenamento:** S3 ou similar para fotos
  - Provedor inicial: AWS S3 ou Cloudflare R2
  - Backup: versionamento de objetos ativado
  - Limites: máximo 5MB por imagem, compressão server-side
- **Notificações Push:** Firebase/APNs (pós-MVP)
  - MVP: notificações por email e session flash messages

---

## 🏗️ DECISÕES ARQUITETURAIS

### Stack Backend
- **Framework:** AdonisJS v7+ (Node.js)
- **Banco de Dados:** PostgreSQL 16+ (relacional, transações robustas)
- **ORM:** Lucid (integrado ao AdonisJS)
- **Validação:** VineJS
- **Autenticação:** Session-based com `@adonisjs/auth`
- **Logger:** Pino (estruturado, performance)

### Stack Frontend
- **Template Engine:** Edge.js (SSR)
- **CSS Framework:** Bootstrap 5.3
- **JavaScript:** Alpine.js (interações leves)
- **Build Tool:** Vite

### Padrões de Arquitetura
- **Controllers → Services → Models** (separação de responsabilidades)
- **DTOs e Adapters** para comunicação entre camadas
- **Eventual uso de Events/Listeners** para efeitos colaterais assíncronos
- **SSR primeiro**, JavaScript complementar

### Integrações
- **Asaas:** escolhido por suporte nativo a Pix e Cartão, além de API bem documentada
- **PostgreSQL:** escolhido por integridade transacional, suporte a JSONB e maturidade
- **S3/R2:** padrão de mercado para armazenamento de objetos

---

## 👥 PAPÉIS E RESPONSABILIDADES

### Equipe Mínima Recomendada
| **Papel** | **Qtd** | **Responsabilidades** |
|-----------|---------|----------------------|
| **Product Owner** | 1 | Priorização, validação, stakeholder management |
| **Tech Lead / Backend Dev** | 1-2 | Arquitetura, backend, integrações, code review |
| **Frontend Dev** | 1 | UI/UX, Edge templates, Alpine.js, CSS |
| **QA / Tester** | 1 (ou compartilhado) | Testes manuais, automação, validação de edge cases |

### Responsabilidades por Fase
- **Backend Dev:** Services, models, controllers, integrações, migrations
- **Frontend Dev:** Templates Edge, componentes, CSS, Alpine.js
- **Tech Lead:** Revisão de código, decisões arquiteturais, deploy
- **QA:** Testes funcionais, edge cases, validação de critérios de aceite

---

## 🔗 MATRIZ DE DEPENDÊNCIAS ENTRE FASES

```
FASE 1 (Auth, KYC, Wallet, Logs)
    │
    ├───► FASE 2 (Publicação de Demandas)
    │        │
    │        └───► FASE 3 (Matching & Bidding)
    │                 │
    │                 └───► FASE 4 (Pagamento & Escrow)
    │                          │
    │                          └───► FASE 5 (Execução & Entrega)
```

### Dependências Detalhadas
| **Fase** | **Depende de** | **Motivo** |
|----------|---------------|------------|
| Fase 2 | Fase 1 | Necessita autenticação para publicar |
| Fase 3 | Fase 2 | Necessita demandas publicadas |
| Fase 4 | Fase 1 + Fase 3 | Necessita wallet (F1) e propostas selecionadas (F3) |
| Fase 5 | Fase 4 | Necessita pagamento confirmado |

### Possibilidade de Overlap
- **Fase 2 e Fase 3** podem ter 1 semana de overlap se a Fase 1 estiver estável
- **Fase 4** é crítica e não deve ter overlap
- **Fase 5** depende integralmente da Fase 4

---

## ✅ DEFINITION OF DONE (DoD) POR FASE

Uma fase só é considerada **completa** quando todos os critérios abaixo são atendidos:

### DoD Geral (todas as fases)
- [ ] Todos os critérios de aceite da fase atendidos
- [ ] Testes unitários escritos e passando (> 80% cobertura em services)
- [ ] Testes funcionais escritos e passando (endpoints críticos)
- [ ] Code review aprovado por ao menos 1 dev
- [ ] Migrations testadas com rollback seguro
- [ ] Documentação de API atualizada (se aplicável)
- [ ] Deploy em staging homologado
- [ ] Edge cases críticos testados manualmente
- [ ] Logs estruturados implementados para operações críticas
- [ ] Sem erros de lint ou typecheck

### DoD Específico por Fase

#### Fase 1 - Infraestrutura & Segurança
- [ ] Autenticação funcional com CPF/CNPJ validados
- [ ] KYC testado com documentos reais (sandbox)
- [ ] Wallet criada e com histórico funcional
- [ ] Logs de auditoria verificados
- [ ] Integração Asaas (sandbox) testada

#### Fase 2 - Publicação
- [ ] Wizard completo funcionando
- [ ] Upload de fotos com compressão funcional
- [ ] Geolocalização retornando bairros corretamente
- [ ] Notificações enviadas (email/session flash)
- [ ] Rascunhos salvos e recuperáveis

#### Fase 3 - Matching & Bidding
- [ ] Dashboard filtrando por região
- [ ] Bidding com validações funcionando
- [ ] Anti-fraude detectando padrões de contato externo
- [ ] Chat registrando trilha de auditoria
- [ ] Escolha de proposta com comparação funcional

#### Fase 4 - Pagamento & Escrow
- [ ] Checkout Asaas processando Pix e Cartão
- [ ] Webhooks recebidos e processados com idempotência
- [ ] Escrow com cálculo de comissão correto
- [ ] Cancelamento respeitando política de prazos
- [ ] Fallback de polling em caso de falha de webhook

#### Fase 5 - Execução & Entrega
- [ ] QR Code gerado e legível
- [ ] Token alternativo funcionando
- [ ] Revelação gradual de endereços funcional
- [ ] Confirmação de entrega registrada
- [ ] Repasse financeiro processado corretamente

---

## 🎯 DEFINIÇÃO DO MVP (ESCOPO)

### ✅ In-scope (MVP)
- Fluxo ponta a ponta: cadastro/autenticação → publicação → proposta → pagamento → execução/entrega
- Auditoria mínima para ações críticas (principalmente financeiras e antifraude)
- Resiliência mínima: retries, timeouts e idempotência para integrações críticas (ex.: webhooks)

### ❌ Out-of-scope (pós-MVP)
- Offline-first com sincronização completa
- Gateway de pagamento secundário (fallback por segundo provedor)
- Análise de sentimento no chat (ficar com heurísticas/regex + moderação)
- CDN/otimizações avançadas de mídia além de compressão e limites

## 🛡️ LGPD E PROTEÇÃO DE DADOS

### Princípios
- **Minimização:** Coletar apenas dados estritamente necessários
- **Finalidade:** Informar claramente por que cada dado é coletado
- **Retenção:** Dados pessoais retidos apenas pelo período legal necessário
- **Consentimento:** Opt-in explícito para dados sensíveis (documentos, localização)

### Dados Coletados e Tratamento
| **Dado** | **Finalidade** | **Base Legal** | **Retenção** |
|----------|---------------|----------------|--------------|
| CPF/CNPJ | Validação de identidade | Legítimo interesse | 5 anos após encerramento |
| RG/CNH (upload) | KYC/verificação | Obrigação legal | 5 anos após encerramento |
| Email | Comunicação/autenticação | Contrato | Até solicitação de exclusão |
| Endereço completo | Execução do serviço | Contrato | 1 ano após entrega |
| Fotos de itens | Documentação da demanda | Contrato | 6 meses após entrega |
| Logs de auditoria | Compliance/segurança | Legítimo interesse | 3 anos |

### Direitos do Titular (LGPD)
- **Acesso:** Usuário pode solicitar cópia de todos os seus dados (endpoint `/account/data-export`)
- **Retificação:** Usuário pode corrigir dados cadastrais (perfil editável)
- **Exclusão:** Usuário pode solicitar deleção de conta (exceto dados com obrigação legal de retenção)
- **Portabilidade:** Exportar dados em formato estruturado (JSON/CSV)

### Implementação Técnica
- **Criptografia em trânsito:** TLS 1.2+ obrigatório
- **Criptografia em repouso:** Dados sensíveis (CPF, documentos) criptografados no banco (AES-256)
- **Anonimização:** Logs nunca contêm CPF completo, senhas, tokens
- **DPO (Encarregado):** Definir responsável interno por solicitações LGPD
- **Registro de atividades:** Tabela `data_processing_logs` para rastrear acessos a dados sensíveis

### Política de Retenção e Destruição
- **Automática:** Jobs agendados para anonimizar/deletar dados expirados
- **Manual:** Processo para atender solicitações de exclusão (SLA: 15 dias)
- **Backup:** Dados em backup seguem mesma política de retenção

## ✅ REQUISITOS NÃO-FUNCIONAIS (NFR) MÍNIMOS

### Segurança e LGPD
- Rate limiting e proteção contra brute-force (login/cadastro/chat)
- Assinatura e validação de webhooks (Asaas) + idempotência por evento
- Política de retenção de logs/auditoria e minimização de dados sensíveis (LGPD)

### Observabilidade e Auditoria
- Logs estruturados e correlacionáveis (requestId/traceId) para fluxos críticos
- Trilhas de auditoria para: pagamentos, cancelamentos, disputas, alterações de status e ações antifraude
- Alertas mínimos: falhas de pagamento, atraso de webhook, spikes de erro 5xx, uploads falhando

### Resiliência e Performance
- Timeouts e retries com backoff para integrações externas
- Operações críticas idempotentes (principalmente pagamentos/webhooks)
- Limites e compressão de uploads (com validação server-side)

## 🗓️ **FASES DE IMPLEMENTAÇÃO**

### **🔧 FASE 1 - INFRAESTRUTURA & SEGURANÇA** 
**📅 Duração:** Sprint 1-2 (4 semanas)  
**🎯 Objetivo:** Base sólida para evitar retrabalho e garantir segurança

#### **Funcionalidades Críticas:**
1. **Sistema de Autenticação Multi-Perfil**
   - Registro com CPF/CNPJ validados
   - Login com 2FA opcional
   - Perfis dinâmicos (Cliente ↔ Profissional)

2. **KYC Básico** 
   - Upload de documentos (RG/CNH)
   - Validação de formato e tamanho
   - Status de verificação (Pendente/Aprovado/Rejeitado)

3. **Estrutura de Wallet/Financeiro**
   - Tabela `wallets` para saldo virtual
   - Histórico de transações
   - Integração com Asaas (sandbox)

4. **Sistema de Logs e Auditoria**
   - Registro de todas as ações críticas
   - Dados sensíveis criptografados
   - Backup automático

#### **⚠️ Edge Cases Críticos - Fase 1:**

| **Cenário de Falha** | **Impacto** | **Tratamento** |
|---------------------|-------------|----------------|
| **CPF/CNPJ duplicado** | Impede registro | Validação em tempo real + mensagem clara |
| **Upload timeout** | Frustração do usuário | Retry automático + progress bar |
| **Documento ilegível** | Reprovação no KYC | Preview + guidelines antes do upload |
| **Falha na API Asaas** | Impede wallet | Modo sandbox + mensagem de indisponibilidade |
| **Perda de sessão** | Dados não salvos | Auto-save a cada 30 segundos |

#### **🎯 Critérios de Aceite - Fase 1:**
- [ ] **CA1:** Sistema rejeita cadastro com CPF/CNPJ já existente (validação no banco em < 100ms)
- [ ] **CA2:** Upload de documentos aceita apenas JPG/PNG até 5MB (rejeitar outros formatos com mensagem clara)
- [ ] **CA3:** Wallet é criada automaticamente em até 2s após aprovação KYC
- [ ] **CA4:** Logs registram timestamp, usuário, ação e entidade para todas as operações financeiras
- [ ] **CA5:** Integrações críticas (Asaas) possuem timeout de 10s, 3 retries com backoff e idempotência por request ID

---

### **📱 FASE 2 - CORE BUSINESS - PUBLICAÇÃO**
**📅 Duração:** Sprint 3-4 (4 semanas)  
**🎯 Objetivo:** Permitir que clientes publiquem demandas de forma segura

#### **Funcionalidades:**
1. **Formulário de Publicação de Demandas**
   - Wizard em 3 passos (tipo → inventário → localização)
   - Validação de campos obrigatórios
   - Preview antes de publicar

2. **Sistema de Inventário com Fotos**
   - JSONB para flexibilidade
   - Upload múltiplo de fotos por item
   - Categorização automática

3. **Geolocalização Básica**
   - Apenas bairros visíveis (privacidade)
   - Cálculo de distância aproximada
   - Validação de endereço existente

4. **Sistema de Notificação para Parceiros**
   - Push notification para novas demandas
   - Filtro por região e tipo
   - Limite de notificações por hora

#### **⚠️ Edge Cases Críticos - Fase 2:**

| **Cenário de Falha** | **Impacto** | **Tratamento** |
|---------------------|-------------|----------------|
| **Inventário > 50 itens** | Performance degradada | Paginação + lazy loading |
| **Foto > 10MB** | Upload falha | Compressão automática antes do upload |
| **Endereço não encontrado** | Impede publicação | Sugestões alternativas + manual override |
| **Conexão instável** | Dados perdidos | Rascunho no servidor + retry automático |
| **Spam de demandas** | Saturação do sistema | Rate limiting (máx 5/dia por usuário) |

#### **🎯 Critérios de Aceite - Fase 2:**
- [ ] **CA1:** Formulário valida todos os campos antes de permitir avançar (zero campos inválidos passam)
- [ ] **CA2:** Fotos são comprimidas para máximo 2MB cada (validar com imagens de 5MB+ antes do upload)
- [ ] **CA3:** Apenas bairros são exibidos no mapa (rua/número ocultos na resposta da API)
- [ ] **CA4:** Parceiros recebem notificações de demandas num raio de 15km (configurável)
- [ ] **CA5:** Rascunho é salvo automaticamente a cada 30s e recuperável por até 7 dias

---

### **🤝 FASE 3 - MATCHING & BIDDING**
**📅 Duração:** Sprint 5-6 (4 semanas)  
**🎯 Objetivo:** Conectar oferta e demanda de forma segura

#### **Funcionalidades:**
1. **Dashboard de Demandas para Parceiros**
   - Mapa com pins coloridos por urgência
   - Lista com filtros avançados
   - Detalhes parciais (sem endereço completo)

2. **Sistema de Bidding/Lances**
   ```   
   | **Campo**       | **Restrição** | **Validação**           |
   |-----------------|---------------|-------------------------|
   | **Valor**       | Mínimo R$ 50  | Acima do valor sugerido |
   | **Prazo**       | Máx 48h       | Data futura válida      |
   | **Observações** | Máx 500 chars | Sem dados de contato    |
   ```

3. **Chat com Anti-Fraude**
   - Regex para bloquear telefones/emails
   - Moderação e trilha de auditoria para tentativas recorrentes
   ```
   | **Padrão Bloqueado** | **Exemplo**     | **Mensagem ao Usuário**                              |
   |----------------------|-----------------|------------------------------------------------------|
   | Telefones            | 11 9\d{4}-\d{4} | "Compartilhar contato antes do pagamento é proibido" |
   | Emails               | \w+@\w+\.\w+    | "Use apenas o chat para negociar"                    |
   | WhatsApp             | whatsapp, zap   | "Continue a negociação aqui"                         |
   ```

4. **Escolha de Proposta pelo Cliente**
   - Comparação lado a lado
   - Perfil do parceiro (avaliações, verificações)
   - Confirmação em 2 passos

#### **⚠️ Edge Cases Críticos - Fase 3:**

| **Cenário de Falha** | **Impacto** | **Tratamento** |
|---------------------|-------------|----------------|
| **Parceiro tenta burlar anti-fraude** | Desvio de transação | Bloqueio imediato + análise manual |
| **Cliente não escolhe em 48h** | Demanda expira | Notificação + extensão automática |
| **Múltiplas propostas iguais** | Concorrência desleal | Ordenação por timestamp |
| **Chat offline** | Mensagens não enviadas | Fila de mensagens + retry |
| **Cancelamento durante bidding** | Propostas perdidas | Notificação imediata a todos |

#### **🎯 Critérios de Aceite - Fase 3:**
- [ ] **CA1:** Sistema detecta e bloqueia 95% das tentativas de contato externo (testado com 100 amostras de padrões)
- [ ] **CA2:** Parceiro só vê demandas num raio de 15km da sua região cadastrada
- [ ] **CA3:** Cliente tem 48h para escolher proposta (com notificação de reminder às 24h e 40h)
- [ ] **CA4:** Chat registra timestamp, autor, mensagem e hash de integridade para auditoria
- [ ] **CA5:** Cancelamento notifica todos os licitantes em até 5 minutos via email/session

---

### **💰 FASE 4 - PAGAMENTO & ESCROW**
**📅 Duração:** Sprint 7-8 (4 semanas)  
**🎯 Objetivo:** Garantir segurança financeira para ambos os lados

#### **Funcionalidades:**
1. **Integração Completa Asaas**
   - Checkout transparente
   - Múltiplas formas (Cartão, Pix)
   - Webhooks para status changes (assinatura, retries e idempotência)

2. **Sistema de Escrow (Custódia)**
   ```
   Fluxo de Dinheiro:
   Cliente paga → Muvia (15% comissão) → Parceiro (85%)
   Status: Reservado → Em transporte → Disponível
   ```

3. **Política de Cancelamento**
   
  | **Momento**   | **Reembolso Cliente** | **Compensação Parceiro** |
  |---------------|-----------------------|--------------------------|
  | > 12h antes   | 100%                  | Nenhuma                  |
  | < 12h antes   | 90%                   | Taxa de saída (R$ 50)    |
  | Em andamento  | 0%                    | Valor total - comissão   |

4. **Notificações de Pagamento**
   - Confirmação para cliente
   - Alerta para parceiro (início do serviço)
   - Comprovante por email

#### **⚠️ Edge Cases Críticos - Fase 4:**

| **Cenário de Falha** | **Impacto** | **Tratamento** |
|---------------------|-------------|----------------|
| **Pagamento não aprovado** | Serviço não inicia | Notificação + nova tentativa |
| **Chargeback** | Prejuízo financeiro | Análise de risco + possível bloqueio |
| **Duplo pagamento** | Cliente desconfia | Reembolso automático imediato |
| **Erro no cálculo** | Valor incorreto | Auditoria + correção manual |
| **Timeout no webhook** | Status não atualiza | Polling de backup a cada 5min |

#### **🎯 Critérios de Aceite - Fase 4:**
- [ ] **CA1:** Pagamento processado em < 30 segundos (do clique à confirmação)
- [ ] **CA2:** Comissão de 15% calculada corretamente (testar com 10 valores diferentes, margem de erro R$ 0,01)
- [ ] **CA3:** Cancelamento respeita política: > 12h = 100% reembolso, < 12h = 90% + R$ 50 parceiro
- [ ] **CA4:** Webhook Asaas tem fallback de polling a cada 5min (máximo 5 tentativas)
- [ ] **CA5:** Todos os valores são auditáveis com trilha: quem, quando, quanto, status (tabela `audit_logs`)

---

### **🚚 FASE 5 - EXECUÇÃO & ENTREGA**
**📅 Duração:** Sprint 9-10 (4 semanas)  
**🎯 Objetivo:** Finalizar o ciclo completo com segurança

#### **Funcionalidades:**
1. **Liberação Gradual de Endereços**
   ```
   Timeline de Revelação:
   → Pagamento confirmado: Origem completa
   → Motorista inicia transporte: Destino completo  
   → QR Code gerado: Confirmação final
   ```

2. **Sistema de QR Code/Token**
   - Código único por serviço
   - Token alternativo digitável (fallback)
   - Expira em 24h

3. **Confirmação de Entrega**
   - Cliente escaneia QR Code
   - Checklist de itens (opcional)
   - Assinatura digital no celular

4. **Repasse Financeiro Automático**
   - Disponível após confirmação
   - Saque automático via Pix
   - Notificação de conclusão

#### **⚠️ Edge Cases Críticos - Fase 5:**

| **Cenário de Falha** | **Impacto** | **Tratamento** |
|---------------------|-------------|----------------|
| **QR Code não lê** | Entrega não confirmada | Token manual alternativo |
| **Cliente não escaneia** | Parceiro não recebe | Lembrete + expiração em 24h |
| **Itens danificados** | Disputa pós-entrega | Sistema de disputas + fotos |
| **Motorista sem sinal** | Endereço não revelado | Cache local + SMS backup |
| **Cliente ausente** | Tentativa frustrada | Reagendamento + taxa adicional |

#### **🎯 Critérios de Aceite - Fase 5:**
- [ ] **CA1:** QR Code contém URL/token único com expiração em 24h e fallback de token numérico de 6 dígitos
- [ ] **CA2:** Endereço de origem revelado após pagamento confirmado; destino após início do transporte
- [ ] **CA3:** Repasse financeiro ocorre em < 1h após confirmação de entrega via Pix
- [ ] **CA4:** Sistema registra: timestamp, localização (se disponível), QR code escaneado, usuário confirmador
- [ ] **CA5:** Disputas podem ser abertas em até 7 dias com upload de fotos e descrição (máx 1000 chars)

---

## 📊 **MÉTRICAS DE SUCESSO DO MVP**

### **🎯 KPIs por Fase:**

| **Fase** | **Métrica Principal** | **Alvo** | **Como Medir** |
|----------|----------------------|----------|----------------|
| **Fase 1** | Taxa de aprovação KYC | > 85% (primeira tentativa) | Documentos aprovados / total enviados |
| **Fase 2** | Demandas publicadas | > 50/semana (primeiro mês) | Volume de novas demandas |
| **Fase 3** | Propostas por demanda | > 2.5 em média | Total propostas / total demandas |
| **Fase 4** | Taxa de sucesso pagamento | > 95% | Pagamentos aprovados / tentativas |
| **Fase 5** | Tempo médio entrega | < 6h (serviços locais) | Confirmação - pagamento |

**Nota:** Valores ajustados para realidade de MVP (baseline zero). Revisar após 4 semanas de produção.

### **🔍 Indicadores de Qualidade:**
- **Satisfação do Usuário:** NPS > 40 (MVP inicial; revisar para v2)
- **Taxa de Reclamações:** < 10% dos serviços (MVP; reduzir para < 5% em v2)
- **Tempo de Resposta:** < 4h para suporte (horário comercial)
- **Disponibilidade:** > 99% uptime (monitorar com health checks a cada 5min)

### **📈 Coleta de Dados**
- **Analytics:** Eventos de página (views, clicks, conversions) via session
- **Erros:** Logs estruturados (Pino) com correlation ID
- **Performance:** Middleware de timing para requests (alertar se > 1s)
- **Feedback:** Formulário de NPS após conclusão de serviço

---

## 🧪 **ESTRATÉGIA DE TESTES**

### Pirâmide de Testes

```
        ┌─────────────┐
        │   E2E (5%)  │  ← Fluxos completos (browser)
        ├─────────────┤
        │ Funcional   │  ← Endpoints, controllers, integração (25%)
        ├─────────────┤
        │  Unitário   │  ← Services, adapters, validators (70%)
        └─────────────┘
```

### Cobertura Mínima por Camada
- **Services:** > 80% (regra de negócio crítica)
- **Controllers:** > 60% (validação de input/output)
- **Models:** > 50% (relacionamentos, getters)
- **Validators:** > 90% (casos válidos e inválidos)
- **Adapters/DTOs:** > 70% (construção, validação)

### Tipos de Testes por Fase

#### Fase 1 - Infraestrutura & Segurança
| **Tipo** | **O que testar** | **Ferramenta** |
|----------|-----------------|----------------|
| Unitário | Validação CPF/CNPJ, criação de wallet, hashing de senha | Japa + Assert |
| Funcional | POST /signup, POST /login, POST /logout | Japa + HTTP Client |
| Funcional | Upload de documentos (válido/inválido) | Japa + multipart |
| Integração | Integração Asaas sandbox (mock de webhooks) | Japa + mocks |

#### Fase 2 - Publicação
| **Tipo** | **O que testar** | **Ferramenta** |
|----------|-----------------|----------------|
| Unitário | Validação de inventário, cálculo de distância | Japa + Assert |
| Funcional | POST /demandas (criar, listar, rascunho) | Japa + HTTP Client |
| Funcional | Upload de fotos (compressão, limites) | Japa + multipart |
| Browser | Wizard de publicação (fluxo completo) | Japa + Playwright |

#### Fase 3 - Matching & Bidding
| **Tipo** | **O que testar** | **Ferramenta** |
|----------|-----------------|----------------|
| Unitário | Regex anti-fraude, cálculo de ranking | Japa + Assert |
| Funcional | POST /propostas, GET /demandas/:id | Japa + HTTP Client |
| Funcional | Chat: enviar/receber mensagens, auditoria | Japa + HTTP Client |
| Browser | Dashboard de propostas, comparação lado a lado | Japa + Playwright |

#### Fase 4 - Pagamento & Escrow
| **Tipo** | **O que testar** | **Ferramenta** |
|----------|-----------------|----------------|
| Unitário | Cálculo de comissão (15%), política de cancelamento | Japa + Assert |
| Funcional | Webhook Asaas (idempotência, retry) | Japa + mocks |
| Integração | Asaas sandbox (fluxo real de pagamento) | Japa + API Asaas |
| Browser | Checkout, confirmação de pagamento | Japa + Playwright |

#### Fase 5 - Execução & Entrega
| **Tipo** | **O que testar** | **Ferramenta** |
|----------|-----------------|----------------|
| Unitário | Geração de QR Code, validação de token | Japa + Assert |
| Funcional | POST /entrega/confirmar, GET /endereco/:id | Japa + HTTP Client |
| Browser | Scan de QR Code, checklist de entrega | Japa + Playwright |

### Testes de Performance (todas as fases)
- **Load testing:** 100 requests simultâneos em endpoints críticos (Artillery ou k6)
- **Timeout testing:** Simular respostas lentas de APIs externas (> 10s)
- **Memory leak:** Monitorar heap após 1000 requests consecutivos

### Testes de Integração Externa
- **Asaas:** Mock em testes locais; teste real em staging semanal
- **Geolocalização:** Mock de respostas de API; teste com endereços reais
- **Upload/S3:** Mock em testes locais; teste com bucket de staging

---

## 🚨 **PLANO DE RISCO E CONTINGÊNCIA**

### **Riscos de Negócio:**
1. **Baixa adesão de parceiros** → Campanha de incentivos + redução taxas
2. **Fraudes em massa** → Sistema de reputação + análise manual
3. **Regulamentação** → Consultoria jurídica + compliance ativo

### **Riscos Técnicos:**
1. **Asaas indisponível** → Fila + reprocessamento + comunicação ao usuário (gateway secundário pós-MVP)
2. **Vazamento de dados** → Criptografia AES-256 + auditoria externa
3. **Performance** → Cache Redis + CDN CloudFlare

---

## 📝 **PRÓXIMOS PASSOS**

### **✅ Checklist de Aprovação:**
- [x] Validar priorização com stakeholders
- [x] Confirmar timeline e recursos disponíveis
- [x] Aprovar métricas de sucesso
- [ ] Definir responsáveis por cada fase (atribuir nomes)
- [x] Estabelecer ritmo de revisões (semanal, segundas-feiras)

### **🎯 Entrega Imediata (Próxima Ação):**
Criar **análise detalhada da Fase 1** seguindo o template de product analysis, focando no **Sistema de Autenticação Multi-Perfil**.

---

## 📦 BACKLOG PÓS-MVP (Visão v2.0)

### Funcionalidades Adiadas
| **Feature** | **Prioridade** | **Esforço** | **Motivo do Adiamento** |
|-------------|---------------|-------------|------------------------|
| Gateway de pagamento secundário | Alta | Médio | Asaas deve ser suficiente para validação inicial |
| Notificações push (Firebase) | Alta | Médio | Email/session flash resolvem MVP |
| Sistema de reputição/ranking | Média | Alto | Precisa de base de usuários primeiro |
| Chat com análise de sentimento | Baixa | Alto | Regex + moderação manual suficientes |
| Offline-first | Baixa | Muito Alto | Casos de uso raros no MVP |
| CDN avançado/otimizações | Média | Médio | Compressão básica resolve início |
| Dashboard analytics para parceiros | Média | Médio | Poucos parceiros no início |
| API pública para integrações | Baixa | Alto | Sem demanda inicial |

### Melhorias Técnicas
- **Migração para microsserviços** (se necessário pela escala)
- **Cache Redis** para sessões e queries frequentes
- **ElasticSearch** para busca avançada de demandas
- **Filas (Bull/RabbitMQ)** para jobs assíncronos (emails, webhooks)
- **Monitoramento avançado** (Datadog, New Relic)

### Expansão de Negócio
- **Novas regiões geográficas** (além do launch market)
- **Tipos adicionais de serviço** (além de mudanças locais)
- **Planos de assinatura** (além de pay-per-use)
- **Integrações com marketplaces** (OLX, Enjoei, etc.)

---

## 📋 CHANGELOG DO DOCUMENTO

| **Versão** | **Data** | **Autor** | **Mudanças** |
|------------|----------|-----------|--------------|
| 1.0 | 07/03/2026 | Product Discovery | Versão inicial do roadmap |
| 1.1 | 09/04/2026 | Tech Lead | Adicionado: decisões arquiteturais, papéis, matriz de dependências, DoD, estratégia de testes, LGPD detalhada, critérios de aceite objetivos, backlog pós-MVP, changelog |

---

**📧 Responsável:** Equipe de Product Discovery
**📞 Contato:** Product Owner Muvia
**🔄 Revisão:** Semanal toda segunda-feira

---

*"O sucesso do MVP não é ter todas as funcionalidades, mas ter as funcionalidades essenciais funcionando perfeitamente com segurança."*
