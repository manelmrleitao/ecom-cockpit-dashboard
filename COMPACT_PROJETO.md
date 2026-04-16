# 📦 COMPACT - Ecom Cockpit Dashboard

**Última atualização:** 2026-04-14 (22:10)  
**Status do Projeto:** ✅ **SHOPIFY 100% + META ADS 100%** | Google Ads Setup Pronto 🔵  
**Status do Servidor Local:** ✅ **FUNCIONANDO em localhost:3004** | ✅ **Dados reais + Filtros interativos + Insights automáticos**

---

## 📍 Estado Atual do Projeto

### ✅ Concluído (Esta Sessão)

1. **Remoção de Mock Data**
   - ❌ Sem mais fallback para dados fake
   - ✅ Erros claros quando credenciais faltam (Status 503)
   - ✅ Mensagens de erro específicas por plataforma

2. **Frontend - Componentes Novos**
   - ✅ `IntegrationAlert` - Avisos visuais de status das integrações
   - ✅ `CustomerReturnRateKPI` - Métrica de lealdade de clientes (Shopify)
   - ✅ `QuickSuggestions` - **TOP 3 + 2 EXPANSÍVEIS COM DADOS REAIS** ✅
     - Insight 1: Total revenue + conversões + ticket médio
     - Insight 2: Plataforma com melhor ROAS e spend investido
     - Insight 3: ROI eficiência geral de publicidade paga
     - Expansível 4: Performance orgânica Shopify
     - Expansível 5: Plataforma com pior performance (oportunidade de otimização)
     - Gera insights automaticamente baseado em dados reais
   - ✅ `DateFilter` - Filtros interativos por período (hoje, 7d, 30d, etc)
   - ✅ Filtros de plataformas (multi-select) - mostra TODAS as plataformas

3. **Funcionalidades Implementadas (2026-04-14)**
   - ✅ Dashboard com **filtros interativos por período**
   - ✅ Dados reais de Shopify atualizando conforme período selecionado
   - ✅ **QuickSuggestions com insights data-driven:**
     - Top 3 principais insights (receita, melhor plataforma, ROI)
     - Expandir para 2 mais insights adicionais
     - Atualiza automaticamente conforme dados mudam
   - ✅ Limpa de 100 para 250 encomendas por período (mais dados realistas)
   - ✅ QuickSuggestions posicionado acima de Métricas Principais
   - 🔵 Google Ads setup ready (guia disponível em `SETUP_GOOGLE_ADS.md`)

4. **Integrações - Status Atual**
   
   **✅ SHOPIFY - VALIDADO 100% (2026-04-14 00:55)**
   - Endpoint: `/api/shopify/metrics` ✓
   - Status: **FUNCIONANDO COM DADOS REAIS DE PRODUÇÃO**
   - Dados Confirmados:
     ```json
     {
       "orders": 100,
       "revenue": 3047.28€,
       "averageOrderValue": 30.47€,
       "uniqueCustomers": 96,
       "uniqueReturningCustomers": 4,
       "customerReturnRate": 4.17%,
       "currency": "EUR",
       "isMock": false
     }
     ```
   - KPIs Consolidation: **Agregando dados corretamente** ✓
   - Dashboard: **Carregando com Shopify OK** ✓
   - CRR Métrica: **Calculando corretamente (4.17%)** ✓
   
   **✅ META ADS - VALIDADO 100% (2026-04-14 22:10)**
   - Endpoint: `/api/meta-ads/metrics` ✓
   - Status: **FUNCIONANDO COM DADOS REAIS DE PRODUÇÃO**
   - Dados Confirmados:
     ```json
     {
       "campaigns": 25,
       "spend": 3670.33,
       "clicks": 21857,
       "impressions": 1925403,
       "conversions": 349,
       "conversionValue": 16945.89,
       "roas": 4.62,
       "cpc": 0.17,
       "currency": "USD",
       "isMock": false
     }
     ```
   - KPIs Consolidation: **Agregando dados corretamente** ✓
   - Dashboard: **Carregando com Meta Ads OK** ✓
   - App ID: 1532780288264481 (App Ads Claude)
   - Token válido até: Junho 3, 2026
   
4. **Documentação**
   - ✅ `SOP_INTEGRACOES.md` - Guia passo-a-passo para 5 plataformas
   - ✅ `SETUP_META_ADS.md` - Setup detalhado Meta Ads
   - ✅ `COMPACT_PROJETO.md` - Este documento (atualizado em tempo real)
   - ✅ Página web: `/dashboard/setup-guide` (bonita e interativa)

---

## 🎯 O que Falta Fazer (Prioridade)

| # | Tarefa | Tempo | Status |
|---|--------|-------|--------|
| 1 | **✅ VALIDAÇÃO: Shopify 100% Funcional** | ✅ CONCLUÍDO | ✅ **CONCLUÍDO** |
| 2 | **✅ SUGESTÕES RÁPIDAS: Top 3 + Expandir 2** | ✅ CONCLUÍDO | ✅ **CONCLUÍDO** |
| 3 | **✅ VALIDAÇÃO: Meta Ads 100% Funcional** | ✅ CONCLUÍDO | ✅ **CONCLUÍDO** |
| 4 | **PRÓXIMO: Configurar Google Ads** | 20 min | 🔵 **PRONTO PARA SETUP** |
| 5 | Configurar TikTok Ads (opcional) | 10 min | ⚪ Depois |
| 6 | Configurar Pinterest (opcional) | 10 min | ⚪ Depois |

**📌 Google Ads Setup:**
- ✅ Infraestrutura pronta (routes, OAuth, client)
- ✅ Guia detalhado em `SETUP_GOOGLE_ADS.md`
- 🔵 Próximo passo: Gerar credenciais em Google Cloud Console

### 📊 Testes Executados (2026-04-13 19:45)

**Shopify - ✅ PASSOU**
- Endpoint responde corretamente
- Dados reais de produção
- CRR calculando corretamente
- Sem erros

**Meta Ads - ❌ FALHOU**
- Token OAuth inválido/expirado
- Erro: "Cannot parse access token"
- Solução: Regenerar novo token em Graph API Explorer

---

## 🔄 STATUS ATUAL - Aguardando Meta Ads Token Novo

### ✅ CORRIGIDO NESTA SESSÃO (2026-04-13 20:30)

1. **NEXT_PUBLIC_APP_URL - CORRIGIDO**
   - Anterior: `http://localhost:3005` ❌ (incompatível com servidor)
   - Agora: `http://localhost:3004` ✅ (porta correta)
   - Impacto: Dashboard KPIs consolidation agora chama endpoints corretamente
   - Resultado: Dashboard carrega sem erros de conexão

2. **Configuração de Credenciais**
   - Shopify: ✅ Totalmente funcional com dados reais
   - Meta Ads: ⏳ Temporariamente desabilitado (TOKEN comentado)
   - Google Ads: ⚪ Configurado com placeholders (próximo após Meta)

### ⏳ CRÍTICO: Problema com Meta Ads Token (Investigação em Curso)

**Status:** ❌ Múltiplos tokens testados, todos retornam "Cannot parse access token"

**Tokens testados (2026-04-13):**
1. `EAAL5t2X6gTg...` - ❌ "Invalid OAuth access token"
2. `EAAYIsIInmA4...` (enviado 2x) - ❌ "Invalid OAuth access token"
3. `EAAYIsIInmA4BRMe8ZAx8...` (novo) - ❌ "Invalid OAuth access token"

**Causa Provável - NÃO é o token:**
- App "Ecom Dashboard" pode não estar correctamente configurada
- Marketing API pode não estar ativado
- Account Meta pode não ter permissões para usar API
- User pode não ser Admin da Business Account

**Verificação em curso (2026-04-13 20:45):**
- Utilizador verificando App Settings em https://developers.facebook.com
- Página: App Dashboard > App ID XXXX > Settings
- Itens a verificar:
  - ✅ Marketing API está ativado?
  - ✅ Ad Account está adicionado?
  - ✅ User é Admin da app?

**Próximos passos:**
1. Completar verificação de App Settings
2. Se tudo OK → Gerar novo token após confirmar permissões
3. Se falhar → Possível reconfiguração completa da app ou uso de System User Token

---

## 📄 Estrutura do Dashboard (Principais Secções)

**Layout Interativo do Dashboard (localhost:3004/dashboard):**

### 1️⃣ **Filtros Interativos** (No topo)
- 📅 Período: Hoje | Ontem | 7 dias | 30 dias | Este Mês
- 🏢 Plataformas: Shopify | Google Ads | Meta Ads | TikTok | Pinterest (filtro multi-select)
- ⚠️ Status de Integrações (IntegrationAlert): Verde = OK | Vermelho = Erro | Amarelo = Não configurado

### 2️⃣ **Sugestões Rápidas** (QuickSuggestions)
- 💡 Top 3 principais oportunidades/alertas
- ↓ Botão "Ver mais" para expandir para 5 sugestões
- 🎯 Cada sugestão mostra: Ícone | Título | Impacto | Ação recomendada
- 📋 Clique em sugestão = Modal com passo-a-passo detalhado
- Tipos: 🔴 Critical | 🟠 Warning | 🟢 Opportunity | 🔵 Success

### 3️⃣ **Métricas Principais** (Expandível)
- 💰 **Receita:** Total em EUR, comparação período anterior, sparkline
- 📦 **Pedidos:** Total de conversões/pedidos, tendência
- 💵 **Valor Médio (AOV):** Ticket médio, comparação
- 📈 **ROAS:** Retorno sobre investimento (x), sparkline
- 💳 **Custo Total:** Spend agregado de todas as plataformas
- 🎯 **CPA:** Custo por aquisição, tendência
- ✅ **Taxa de Conversão:** % de conversão, sparkline

### 4️⃣ **Customer Return Rate KPI** (Específico Shopify)
- 🏪 **% de Clientes Retornantes:** Taxa de lealdade (e.g., 7.3%)
- Intervalo de cores:
  - 🔴 Vermelho: < 15% (baixa lealdade)
  - 🟡 Amarelo: 15-40% (aceitável)
  - 🟢 Verde: > 40% (excelente)
- Insights acionáveis baseados no valor

### 5️⃣ **Tabela de Performance por Plataforma**
- Colunas: Plataforma | Spend | Revenue | ROAS | Conversions | CPA
- Ordenação: Clicável por coluna
- Status visual: Cores por performance

### 6️⃣ **Gráficos** (Expandível)
- 📊 Revenue by Date (últimas 30 dias)
- 📦 Orders by Date
- 📈 ROAS by Platform
- 🔄 Revenue Distribution (pizza chart)

### 7️⃣ **Heatmap de Performance**
- Performance por dia da semana
- ROAS vs Revenue vs Orders

---

## 🔧 Arquitetura Técnica

### Stack
```
Frontend:  Next.js 14 (App Router) + React + TypeScript + Tailwind CSS
Backend:   Next.js API Routes
Database:  Supabase (PostgreSQL)
Deploy:    Vercel
Charts:    Recharts
UI:        shadcn/ui + Lucide Icons
```

### Estrutura de Pastas
```
/app
  /dashboard/              ← Páginas do dashboard
    /setup-guide/page.tsx  ← SOP Visual (NEW)
    /page.tsx              ← Home do dashboard
  /api/
    /google-ads/metrics/   ← Google Ads
    /meta-ads/metrics/     ← Meta Ads ✅
    /tiktok-ads/metrics/   ← TikTok Ads
    /shopify/metrics/      ← Shopify
    /dashboard/kpis/       ← Consolidado

/components/dashboard/
  IntegrationAlert.tsx     ← Avisos de status (NEW)
  CustomerReturnRateKPI.tsx ← Taxa de retorno (NEW)
  QuickSuggestions.tsx     ← Insights
  DashboardClient.tsx      ← Componente principal

/types/
  index.ts                 ← Interfaces TypeScript

/lib/
  /api-clients/            ← Clientes de APIs externas
  /utils/                  ← Helpers
```

---

## 🚀 Como Usar o Projeto

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor (localhost:3005)
npm run dev

# Build de produção
npm run build

# Testes
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

### Acessar Páginas
- Dashboard: `http://localhost:3005/dashboard`
- Setup Guide: `http://localhost:3005/dashboard/setup-guide`
- API Meta Ads: `http://localhost:3005/api/meta-ads/metrics?period=last30`

---

## 📊 KPIs Disponíveis

Por plataforma:
- **Spend** (Gasto em anúncios)
- **Revenue** (Receita gerada)
- **ROAS** (Retorno sobre gasto)
- **Conversions** (Conversões)
- **CPA** (Custo por aquisição)
- **Impressions** (Impressões)
- **Clicks** (Cliques)
- **CTR** (Taxa de clique)

Gerais (Shopify):
- **Customer Return Rate** (% de clientes que repetem) ⭐ NEW
- **Average Order Value** (Ticket médio)
- **Total Revenue** (Receita total)
- **Unique Customers** (Clientes únicos)

---

## 🔑 Variáveis de Ambiente (`.env.local`)

### Meta Ads ✅ CONFIGURADO
```env
META_ADS_ACCOUNT_ID=769401137294776
META_ADS_ACCESS_TOKEN=EAAL5t2X6gTgBRA...
```

### Google Ads 🔵 PRÓXIMO
```env
GOOGLE_ADS_CUSTOMER_ID=1234567890
GOOGLE_ADS_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=GOCSPX-xxx
GOOGLE_ADS_REFRESH_TOKEN=1//0eXxxx
GOOGLE_ADS_DEVELOPER_TOKEN=ca~xxx
```

### Shopify (Opcional)
```env
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_API_TOKEN=shpat_xxx
```

### TikTok Ads (Opcional)
```env
TIKTOK_ADS_ACCESS_TOKEN=acd...
TIKTOK_ADS_BUSINESS_CENTRAL_ID=xxx
```

### Pinterest (Opcional)
```env
PINTEREST_ADS_ACCESS_TOKEN=v1...
PINTEREST_ADS_ACCOUNT_ID=xxx
```

---

## 📋 SOP - Guia Rápido de Integração

### 1️⃣ Meta Ads ✅ CONCLUÍDO

**Requisitos:**
- Conta Facebook Business Manager
- App criada em Meta Developers

**Passos (15 min):**
1. Acede a https://developers.facebook.com
2. Cria app tipo "Business"
3. Adiciona "Create & manage ads with Marketing API"
4. Adiciona Ad Account ID (obtém em business.facebook.com)
5. Gera Access Token (Graph API Explorer)
   - Adiciona permissões: `ads_read` + `ads_management`
6. Adiciona ao `.env.local`:
   ```env
   META_ADS_ACCOUNT_ID=769401137294776
   META_ADS_ACCESS_TOKEN=EAAL5t2X...
   ```
7. Reinicia: `npm run dev`

**Verificação:**
- Dashboard mostra aviso verde ✅
- Dados aparecem nos gráficos 📊

---

### 2️⃣ Google Ads 🔵 PRÓXIMO

**Requisitos:**
- Conta Google Ads
- Google Cloud Project
- OAuth2 Credentials

**Passos (20 min):**

#### Passo 1: Google Cloud Console
1. Acede a https://console.cloud.google.com
2. Cria novo projeto
3. Procura "Google Ads API" e clica Enable

#### Passo 2: OAuth2 Credentials
1. Vai a **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
2. Escolhe **Desktop Application**
3. Guarda: `Client ID` e `Client Secret`

#### Passo 3: Refresh Token
1. Acede a `http://localhost:3005/api/auth/google/callback`
2. Segue o fluxo OAuth
3. Copia o `refresh_token`

#### Passo 4: Recolhe IDs
- **Customer ID**: Google Ads → Tools & Settings → Linked Accounts
- **Developer Token**: Google Ads → Tools & Settings → API Center

#### Passo 5: Adiciona ao `.env.local`
```env
GOOGLE_ADS_CUSTOMER_ID=1234567890
GOOGLE_ADS_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=GOCSPX-xxx
GOOGLE_ADS_REFRESH_TOKEN=1//0eXxxx
GOOGLE_ADS_DEVELOPER_TOKEN=ca~xxx
```

#### Passo 6: Testa
- Dashboard mostra aviso verde
- Dados aparecem nos gráficos

---

### 3️⃣ Shopify (Opcional)

**Passos (10 min):**
1. Shopify Admin → Settings → Apps and integrations → Develop apps
2. Create app
3. Ativa permissões: `read_orders`, `read_products`, `read_customers`
4. Copia token e URL
5. Adiciona ao `.env.local`:
   ```env
   SHOPIFY_STORE_URL=https://your-store.myshopify.com
   SHOPIFY_API_TOKEN=shpat_xxx
   ```

---

### 4️⃣ TikTok Ads (Opcional)

**Passos (10 min):**
1. ads.tiktok.com → Settings → Assets → Developer
2. Cria Nova API App
3. Gera Access Token
4. Obtém Business Central ID
5. Adiciona ao `.env.local`:
   ```env
   TIKTOK_ADS_ACCESS_TOKEN=acd...
   TIKTOK_ADS_BUSINESS_CENTRAL_ID=xxx
   ```

---

### 5️⃣ Pinterest (Opcional)

**Passos (10 min):**
1. business.pinterest.com → Settings → Conversions → API
2. Gera Token
3. Obtém Ad Account ID
4. Adiciona ao `.env.local`:
   ```env
   PINTEREST_ADS_ACCESS_TOKEN=v1...
   PINTEREST_ADS_ACCOUNT_ID=xxx
   ```

---

## 🧪 Testar Integrações

### Via Terminal
```bash
# Meta Ads
curl http://localhost:3005/api/meta-ads/metrics

# Google Ads
curl http://localhost:3005/api/google-ads/metrics

# Shopify
curl http://localhost:3005/api/shopify/metrics

# KPIs Consolidados
curl http://localhost:3005/api/dashboard/kpis
```

### Via Dashboard
1. Acede a `http://localhost:3005/dashboard`
2. Verifica os avisos:
   - 🟢 Verde = Plataforma funcionando
   - 🔴 Vermelho = Erro (mostra mensagem)
   - 🟡 Amarelo = Nenhuma configurada (demo)

---

## ⚠️ Troubleshooting Rápido

| Erro | Solução |
|------|---------|
| "Missing environment variables" | Verifica `.env.local` e reinicia `npm run dev` |
| "Invalid Access Token" | Gera novo token (válido por 60 dias) |
| "Access Denied" | Verifica permissões na plataforma (ads_read, etc) |
| "No campaign data" | Cria campanha de teste na plataforma |
| Dashboard não carrega | Atualiza F5 ou limpa cache (Ctrl+Shift+Delete) |

---

## 📚 Ficheiros Importantes

| Ficheiro | Propósito |
|----------|-----------|
| `SOP_INTEGRACOES.md` | Guia completo passo-a-passo (5 plataformas) |
| `SETUP_META_ADS.md` | Setup detalhado só de Meta Ads |
| `CLAUDE.md` | Instruções do projeto |
| `.env.local` | Variáveis de ambiente (NÃO commitar!) |
| `.env.local.example` | Template de variáveis |
| `app/dashboard/setup-guide/page.tsx` | SOP Visual (web) |

---

## 🎯 Próximas Ações

**AGORA (2026-04-14):**
1. ✅ Shopify 100% funcionando
2. ✅ Meta Ads 100% funcionando
3. ✅ QuickSuggestions com data-driven insights
4. 🔵 **PRÓXIMO: Configurar Google Ads** → Seguir guia em `SETUP_GOOGLE_ADS.md` (20 min)

**DEPOIS:**
5. Configurar TikTok Ads (10 min, opcional)
6. Configurar Pinterest (10 min, opcional)
7. Deploy em produção (Vercel)

---

## 📞 Contactos Úteis

- Meta Developers: https://developers.facebook.com
- Google Cloud: https://console.cloud.google.com
- TikTok Ads API: https://ads.tiktok.com
- Pinterest API: https://developers.pinterest.com
- Shopify API: https://shopify.dev

---

## 📈 Métricas de Sucesso

Quando tudo estiver configurado:
- ✅ 5 plataformas integradas
- ✅ Dashboard mostra dados reais (sem mocks)
- ✅ Sugestões inteligentes funcionando
- ✅ Taxa de retorno de cliente visível
- ✅ Todas as integrações com aviso verde

---

**Documento preparado para não perder informação.**  
**Seguir o SOP acima para integrar novas plataformas.**
