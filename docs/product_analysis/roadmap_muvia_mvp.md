# 🚀 Roadmap de Implementação - Muvia MVP

**Versão:** 1.0  
**Data:** 07 de Março de 2026  
**Status:** Documento de Discovery & Refinement  
**Stakeholder:** Equipe de Desenvolvimento Muvia  

---

## 📋 RESUMO EXECUTIVO

Este documento apresenta o **roadmap estruturado de implementação** do Muvia MVP, baseado na análise do PRD existente e seguindo a mentalidade de "**Pessimista Saudável**". O roadmap está dividido em **5 fases sequenciais** com duração estimada de **10 sprints** (20 semanas), focando na **minimização de riscos** e **entrega incremental de valor**.

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
- **Serviços de Mapa:** Geocodificação e distância
- **Armazenamento:** S3 ou similar para fotos
- **Notificações Push:** Firebase/APNs

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
- [ ] **CA1:** Sistema permite cadastro com CPF/CNPJ únicos apenas
- [ ] **CA2:** Upload de documentos aceita apenas JPG/PNG até 5MB
- [ ] **CA3:** Wallet é criada automaticamente após aprovação KYC
- [ ] **CA4:** Logs registram todas as operações financeiras
- [ ] **CA5:** Integrações críticas possuem timeouts, retries e idempotência (ex.: webhooks/pagamentos)

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
- [ ] **CA1:** Formulário valida todos os campos antes de permitir avançar
- [ ] **CA2:** Fotos são comprimidas para máximo 2MB cada
- [ ] **CA3:** Apenas bairros são exibidos (rua/numero ocultos)
- [ ] **CA4:** Parceiros recebem notificações relevantes ao perfil
- [ ] **CA5:** Usuário pode salvar rascunho e continuar depois

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
- [ ] **CA1:** Sistema detecta e bloqueia 95% das tentativas de contato externo
- [ ] **CA2:** Parceiro só vê demandas na sua região de atuação
- [ ] **CA3:** Cliente tem 48h para escolher (prorrogável)
- [ ] **CA4:** Chat mantém histórico completo para auditoria
- [ ] **CA5:** Cancelamento notifica todos os interessados

---

### **💰 FASE 4 - PAGAMENTO & ESCROW**
**📅 Duração:** Sprint 7-8 (4 semanas)  
**🎯 Objetivo:** Garantir segurança financeira para ambos os lados

#### **Funcionalidades:**
1. **Integração Completa Asaas**
   - Checkout transparente
   - Múltiplas formas (Cartão, Pix, Boleto)
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
- [ ] **CA1:** Pagamento processado em < 30 segundos
- [ ] **CA2:** Comissão de 15% calculada corretamente
- [ ] **CA3:** Cancelamento respeita política estabelecida
- [ ] **CA4:** Webhook Asaas tem fallback garantido
- [ ] **CA5:** Todos os valores são auditáveis

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
- [ ] **CA1:** QR Code possui token alternativo e validação robusta a conexão instável
- [ ] **CA2:** Endereço só é revelado no momento correto
- [ ] **CA3:** Repasse financeiro ocorre em < 1h após confirmação
- [ ] **CA4:** Sistema registra evidências da entrega
- [ ] **CA5:** Disputas podem ser abertas em até 7 dias

---

## 📊 **MÉTRICAS DE SUCESSO DO MVP**

### **🎯 KPIs por Fase:**

| **Fase** | **Métrica Principal** | **Alvo** | **Como Medir** |
|----------|----------------------|----------|----------------|
| **Fase 1** | Taxa de aprovação KYC | > 90% | Documentos aprovados / total enviados |
| **Fase 2** | Demandas publicadas | > 100/semana | Volume de novas demandas |
| **Fase 3** | Propostas por demanda | > 3 em média | Total propostas / total demandas |
| **Fase 4** | Taxa de sucesso pagamento | > 95% | Pagamentos aprovados / tentativas |
| **Fase 5** | Tempo médio entrega | < 4h | Confirmação - pagamento |

### **🔍 Indicadores de Qualidade:**
- **Satisfação do Usuário:** NPS > 50
- **Taxa de Reclamações:** < 5% dos serviços
- **Tempo de Resposta:** < 2h para suporte
- **Disponibilidade:** > 99% uptime

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
- [ ] Validar priorização com stakeholders
- [ ] Confirmar timeline e recursos disponíveis
- [ ] Aprovar métricas de sucesso
- [ ] Definir responsáveis por cada fase
- [ ] Estabelecer ritmo de revisões

### **🎯 Entrega Imediata (Próxima Ação):**
Criar **análise detalhada da Fase 1** seguindo o template de product analysis, focando no **Sistema de Autenticação Multi-Perfil**.

---

**📧 Responsável:** Equipe de Product Discovery  
**📞 Contato:** Product Owner Muvia  
**🔄 Revisão:** Semanal toda segunda-feira  

---

*"O sucesso do MVP não é ter todas as funcionalidades, mas ter as funcionalidades essenciais funcionando perfeitamente com segurança."*
