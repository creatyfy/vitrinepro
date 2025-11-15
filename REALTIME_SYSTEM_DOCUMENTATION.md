# Documentação Técnica - Sistema de Tempo Real do Vitrine Pro

## Visão Geral

O Vitrine Pro implementa um sistema completo de sincronização em tempo real para todos os usuários simultaneamente, utilizando a arquitetura Realtime do Supabase com Database Triggers e PostgreSQL LISTEN/NOTIFY.

## Arquitetura do Sistema

### 1. Camada de Banco de Dados

#### Tabelas Principais
- **peneiras**: Oportunidades de teste em clubes
- **peneira_registrations**: Inscrições dos atletas
- **real_time_notifications**: Notificações do sistema
- **marketplace_products**: Produtos do marketplace
- **marketplace_orders**: Pedidos e transações
- **chat_messages**: Mensagens entre usuários
- **player_profiles**: Perfis e pontuação dos atletas

#### Triggers PostgreSQL
Cada tabela crítica possui triggers que automaticamente transmitem mudanças:

```sql
-- Exemplo: Trigger para peneiras
CREATE TRIGGER trigger_broadcast_peneira_changes
  AFTER INSERT OR UPDATE OR DELETE ON peneiras
  FOR EACH ROW
  EXECUTE FUNCTION broadcast_peneira_changes();
```

Os triggers usam `pg_notify()` para enviar mensagens para canais específicos que o frontend escuta.

### 2. Camada de Serviços (Frontend)

#### realtimeService.ts
Serviço centralizado que gerencia todas as subscriptions Realtime:

**Funcionalidades:**
- `subscribeToPeneiras()`: Escuta mudanças em peneiras
- `subscribeToRanking()`: Escuta mudanças de pontuação
- `subscribeToNotifications()`: Escuta novas notificações
- `subscribeToProducts()`: Escuta mudanças em estoque
- `subscribeToOrders()`: Escuta status de pedidos
- `subscribeToMessages()`: Escuta novas mensagens

**Padrão de Implementação:**
- Singleton com gerenciamento de canais
- Callbacks múltiplos por canal
- Unsubscribe automático quando não há mais listeners
- Cache de conexões para evitar duplicação

#### rankingService.ts
Serviço especializado para ranking e pontuação:

**Funcionalidades:**
- `getGlobalRanking()`: Ranking global
- `getWeeklyRanking()`: Ranking da semana
- `getRankingByPosition()`: Ranking por posição
- `getRankingByState()`: Ranking por estado
- `subscribeToRankingUpdates()`: Live updates de pontuação
- Cache inteligente de rankings

### 3. Componentes de Interface

#### PeneirasScreenRealtime.tsx
Tela de peneiras com atualizações ao vivo:

**Recursos:**
- Indicador visual de atualizações em tempo real
- Contador de vagas atualizado automaticamente
- Status dinâmico (aberta → fechando → encerrada)
- Inscrição com verificação de vagas em tempo real
- Notificações quando novas peneiras são criadas

#### RealtimeNotificationCenter.tsx
Centro de notificações com push em tempo real:

**Recursos:**
- Badge com contador de não lidas
- Notificações push do navegador
- Categorização por tipo (peneira, ranking, achievement, etc.)
- Indicador de prioridade (alta, média, baixa)
- Animação de pulso para novas notificações

## Fluxo de Dados em Tempo Real

### Exemplo: Nova Peneira Criada

1. **Clube cria peneira** → INSERT na tabela `peneiras`
2. **Trigger é acionado** → `broadcast_peneira_changes()` executa
3. **pg_notify envia mensagem** → Canal `peneiras_channel`
4. **Supabase Realtime transmite** → WebSocket para todos os clientes conectados
5. **Frontend recebe payload** → `realtimeService.subscribeToPeneiras()` callback
6. **Estado é atualizado** → React setState com nova peneira
7. **UI é renderizada** → Nova peneira aparece na lista instantaneamente
8. **Notificação é criada** → Trigger `notify_new_peneira()` insere notificação
9. **Usuários são notificados** → Notificação aparece em tempo real

### Exemplo: Atleta se Inscreve em Peneira

1. **Atleta clica em "Inscrever-se"** → `registerForPeneira()`
2. **INSERT em peneira_registrations** → Registro criado
3. **Trigger atualiza contador** → `update_peneira_participants()` executa
4. **UPDATE em peneiras** → `current_participants` incrementado
5. **Status é recalculado** → Se >= 90% vagas, status vira "fechando"
6. **Broadcast é enviado** → Todos os usuários recebem atualização
7. **UI atualiza em todos os dispositivos** → Contador e status mudam instantaneamente

### Exemplo: Pontuação de Atleta Atualizada

1. **Atleta completa treino** → Sistema adiciona pontos
2. **UPDATE em player_profiles** → `total_points` atualizado
3. **Trigger de ranking** → `broadcast_ranking_changes()` executa
4. **Mensagem é enviada** → Canal `ranking_channel`
5. **Ranking é recalculado** → Cache local é atualizado
6. **Posições mudam** → Se atleta subiu/desceu no ranking
7. **Notificação é criada** → "Você subiu 3 posições no ranking!"
8. **UI atualiza** → Novo ranking aparece para todos os usuários

## Escalabilidade e Performance

### Otimizações Implementadas

1. **Índices de Banco de Dados**
   - Índices em colunas de filtro frequente (status, data, localização)
   - Índices compostos para queries complexas
   - Índices em chaves estrangeiras

2. **Cache de Conexões**
   - Reuso de canais Realtime existentes
   - Unsubscribe automático quando não há listeners
   - Map de callbacks por canal

3. **Lazy Loading**
   - Paginação de notificações (limite de 50)
   - Ranking com limites configuráveis
   - Carregamento sob demanda de dados históricos

4. **Throttling e Debouncing**
   - Animações de indicador limitadas a 2s
   - Updates de UI agrupados quando possível
   - Prevenção de renders desnecessários com useMemo

### Limites e Capacidade

**Supabase Realtime:**
- Até 500 conexões simultâneas por projeto (plano Free)
- Até 2 milhões de mensagens/mês (plano Free)
- Até 200 canais simultâneos por conexão
- Latência < 100ms globalmente

**Estimativa de Uso:**
- 10.000 usuários ativos simultâneos = OK com plano Pro
- 1.000 peneiras ativas = OK
- 100.000 notificações/dia = OK
- Updates de ranking contínuos = OK

## Segurança

### Row Level Security (RLS)

Todas as tabelas implementam RLS:

```sql
-- Exemplo: Apenas o usuário vê suas notificações
CREATE POLICY "Users can view their notifications"
  ON real_time_notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

### Políticas Implementadas

1. **Peneiras**: Leitura pública, escrita apenas por criadores
2. **Inscrições**: Usuários veem apenas suas inscrições
3. **Notificações**: Isolamento total por usuário
4. **Mensagens**: Apenas remetente e destinatário
5. **Produtos**: Leitura pública, escrita por admin
6. **Pedidos**: Usuários veem apenas seus pedidos

### Validações

- Verificação de vagas antes de inscrição
- Prevenção de inscrições duplicadas (UNIQUE constraint)
- Validação de pagamento antes de confirmação
- Rate limiting em ações críticas

## Integração com Pagamentos

### Mercado Pago / Pix (Planejado)

```typescript
// Fluxo de pagamento
1. Usuário se inscreve em peneira paga
2. Status: pending, payment_status: pending
3. Redirect para Mercado Pago
4. Webhook recebe confirmação
5. UPDATE payment_status: paid
6. Trigger notifica usuário
7. Status: confirmed
```

### Webhook Handler

```typescript
// Supabase Edge Function
POST /mercadopago-webhook
- Valida assinatura do webhook
- Atualiza payment_status
- Trigger automático notifica usuário
- Resposta 200 OK para Mercado Pago
```

## Monitoramento e Debug

### Logs de Realtime

```typescript
// Habilitar logs no desenvolvimento
const unsubscribe = realtimeService.subscribeToPeneiras((payload) => {
  console.log('[REALTIME] Peneira update:', payload);
  // ... processar
});
```

### Indicadores Visuais

- **Ponto verde pulsante**: Sistema Realtime ativo
- **Ícone de raio**: Atualização recebida recentemente
- **Badge de contador**: Número de itens não lidos
- **Animação de pulso**: Nova notificação chegando

### Health Check

```typescript
// Verificar status da conexão Realtime
const channel = supabase.channel('health');
channel.subscribe((status) => {
  console.log('Realtime status:', status); // SUBSCRIBED, CLOSED, etc
});
```

## Troubleshooting

### Problema: Atualizações não aparecem

**Solução:**
1. Verificar se o canal está subscrito corretamente
2. Checar se RLS permite acesso aos dados
3. Confirmar que triggers estão criados
4. Validar que pg_notify está sendo chamado

### Problema: Muitas mensagens / Performance ruim

**Solução:**
1. Implementar debouncing nos callbacks
2. Filtrar mensagens antes de processar
3. Usar cache para evitar reprocessamento
4. Considerar batch updates

### Problema: Desconexões frequentes

**Solução:**
1. Implementar reconnection logic
2. Adicionar heartbeat para manter conexão
3. Verificar limites de conexão do plano
4. Otimizar número de canais simultâneos

## Roadmap

### Fase 1 (Implementado)
- ✅ Tabelas de base
- ✅ Triggers PostgreSQL
- ✅ Serviços de Realtime
- ✅ Tela de Peneiras ao vivo
- ✅ Centro de Notificações
- ✅ Serviço de Ranking

### Fase 2 (Próximos Passos)
- ⬜ Integração Mercado Pago completa
- ⬜ Sistema de mensagens em tempo real
- ⬜ Marketplace com estoque ao vivo
- ⬜ Tracking de pedidos em tempo real
- ⬜ Feed de conquistas comunitárias
- ⬜ Mapa de atletas dinâmico

### Fase 3 (Futuro)
- ⬜ Notificações push nativas (iOS/Android)
- ⬜ Sincronização offline-first
- ⬜ WebRTC para videochamadas
- ⬜ Gamificação com eventos ao vivo
- ⬜ Analytics de tempo real
- ⬜ Admin dashboard com métricas live

## Conclusão

O sistema de tempo real do Vitrine Pro foi arquitetado para escalar horizontalmente e suportar milhares de usuários simultâneos. Utilizando as melhores práticas do Supabase Realtime e PostgreSQL, garantimos que todas as atualizações cheguem instantaneamente a todos os dispositivos conectados, criando uma experiência verdadeiramente ao vivo para atletas, clubes e agentes.

A arquitetura modular permite adicionar novos recursos em tempo real facilmente, apenas criando novos triggers e subscriptions. O sistema está preparado para crescer conforme a base de usuários aumenta.
