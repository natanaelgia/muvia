# 01 — Visão Geral

## Objetivo
UI/UX consistente, previsível e segura para o Muvia, reduzindo ambiguidades de implementação e garantindo escalabilidade.

## Princípios
- Clareza acima de estética: cada tela deve responder “onde estou?”, “o que posso fazer?”, “o que acontece agora?”.
- Segurança e confiança: reforçar decisões críticas (pagamento, cancelamento, aprovação KYC) com confirmações e trilha de auditoria.
- Previsibilidade: padrões repetíveis (layout, botões, formulários, feedback).

## Direção visual
- Estilo: neutro corporativo.
- Base: cinzas/tons “slate”, com cor primária teal/ciano inspirada no logo e acento laranja pontual.
- Componentes: Bootstrap 5.3 com tema via CSS variables e componentes Edge reutilizáveis.

## Padrões de implementação
- SSR com Edge: páginas simples, rápidas e acessíveis por padrão.
- Feedback: mensagens funcionais para usuário; erros inesperados são logados e exibem mensagem genérica.
- Navegação: manter breadcrumb/headers e estados vazios claros para reduzir confusão.
