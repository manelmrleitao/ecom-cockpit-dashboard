# 📐 Estrutura de Páginas - Ecom Cockpit Dashboard

Este documento mapeia a estrutura, componentes, tipos de informação **e lógica de dados** em cada página do dashboard. **Atualize este arquivo sempre que modificar a layout ou adicionar novas páginas/tabs.**

---

## 🎛️ Dashboard Home (`/dashboard`)

**Arquivo:** `app/dashboard/page.tsx` → `components/dashboard/DashboardClient.tsx`

### 1. Header
- **Tipo:** Cabeçalho fixo
- **Conteúdo:** Título "🎛️ Cockpit Command Center"
- **Informação:** Branding do cockpit
- **Responsividade:** Flex, alinhado à esquerda
- **Por quê:** Orienta o utilizador de que está no "comando" centralizado
- **Dados:** Static (sem dados dinâmicos)
- **Lógica:** Apenas UI informativa

### 2. Filtros & Controles
- **Localização:** Abaixo do header
- **Estilo:** Gradient background (blue-50 to purple-50)
- **Função:** Permitir ao utilizador segmentar análise por plataforma e período
- **Por quê:** Diferentes plataformas têm performance diferente; períodos ajudam comparar tendências

**Componentes:**
  1. **PlatformDropdown** - Multi-select de plataformas
     - Opções: google-ads, meta-ads, tiktok-ads, pinterest, organic, outros
     - **Dados:** Todas as plataformas disponíveis no sistema
     - **Lógica:** Filtra os KPIs calculados apenas para plataformas selecionadas
     - **Por quê:** Permite focar em plataformas específicas ou ver combinações
     - **Impacto:** Muda: Revenue, Spend, CPA, ROAS, conversions de todas as métricas
     
  2. **DateFilter** - Seletor de período (Estilo Shopify)
     - **UI:** Um único botão que abre modal com opções
     - **Opções Rápidas:**
       - 📅 Hoje (today)
       - 📆 Ontem (yesterday)
       - 📊 Últimos 7 dias (last7)
       - 📈 Este mês (mtd)
     - **Opção Customizada:**
       - 📆 Datas Customizadas → abre form com 2 date inputs (início + fim)
     
     - **Dados:** Período selecionado → refetch de todos os endpoints
     - **Lógica:** 
       ```typescript
       // Preset periods
       getPeriodDateRange(period) → {startDate, endDate}
       
       // Custom dates
       {startDate: "2026-04-10", endDate: "2026-04-15"} → API
       ```
     - **Por quê:** Comparar performance ao longo do tempo, identificar tendências
     - **Impacto:** Muda: Todos os dados (revenue, orders, trends, sparklines)
     
     **Estado Necessário:**
     ```typescript
     const [selectedPeriod, setSelectedPeriod] = useState('last7')
     const [customDateRange, setCustomDateRange] = useState({
       start?: string,  // "2026-04-10"
       end?: string,    // "2026-04-15"
     })
     ```
     
     **Handler:**
     ```typescript
     <DateFilter
       onDateChange={(range, startDate, endDate) => {
         setSelectedPeriod(range)
         if (range === 'custom' && startDate && endDate) {
           setCustomDateRange({ start: startDate, end: endDate })
         }
       }}
     />
     ```
  
  3. **AcquisitionSourceFilter** - Filtro de fontes de aquisição (dinâmico por período)
     - **UI:** Botão dropdown "🎯 Fontes de Aquisição" com multi-select
     - **Opções:** Variam dinamicamente por período (ex: "Organic", "Instagram", "TikTok", "Direct", etc)
     - **Comportamento Dinâmico:**
       - Se num período não houve vendas de uma fonte → essa fonte **não aparece** no filtro
       - Ex: Março sem vendas orgânicas → "Organic" desaparece do filtro de março
       - Quando muda período → filtro refetch e mostra apenas fontes com vendas
     
     - **Dados:** 
       - Endpoint: `/api/shopify/acquisition-sources?period=XXX`
       - Retorna: Array de fontes que tiveram vendas naquele período
       - **Fonte:** Campo `source` do Shopify (registado onde a venda acontece)
     
     - **Lógica:**
       ```typescript
       // Fetch sources quando período muda
       useEffect(() => {
         fetch(`/api/shopify/acquisition-sources?period=${period}`)
         // Refetch → atualiza opções disponíveis
       }, [period])
       ```
     
     - **Por quê:** 
       - Evita confusão com fontes inativas
       - Apenas mostra opções relevantes/úteis para o período
       - Reflete automaticamente o que realmente teve vendas
     
     - **Impacto:** 
       - Filtra dados em gráficos e tabelas por fonte selecionada
       - Se "Instagram" selecionado → mostra só vendas do Instagram

### 3. 💡 Principais Insights (QuickSuggestions)
- **Tipo:** Alert cards com priorização
- **Localização:** Após filtros
- **Função:** Alertar utilizador sobre problemas críticos e oportunidades
- **Por quê:** Evita que o utilizador tenha de analisar todos os números; mostra o mais importante
- **Propósito:** "Decision support" - ajuda a priorizar ações

**Estrutura:**
  - **Cabeçalho:** "💡 Principais Insights" com badges de contadores
    - Mostra: "🚨 X críticos" + "⚠️ Y avisos" se existirem
    - **Lógica:** Conta alerts e warnings, exibe se > 0
  - **Cards:** Até 3 visíveis + expandível para ver restantes
  - **Priorização:** Crítico (1) → Aviso (2) → Neutro (3) → Positivo (4)
  - **Ordenação:** Por priority ASC (problemas primeiro)

**Dados & Lógica:**
| Prioridade | Tipo | Condição | Dados Usados | Por quê | Impacto |
|---|---|---|---|---|---|
| 1 | alert | ROAS < 1 | `revenue / spend` | Perder dinheiro em anúncios | Urgente: parar gastos |
| 1 | alert | CPA > AOV | `spend / conversions` vs `revenue / orders` | Custo por compra > receita por compra | Urgente: inviável |
| 1 | alert | Spend > 50€ + 0 conversões | `spend > 50 && conversions === 0` | Dinheiro gasto sem retorno | Urgente: investigar |
| 2 | warning | CTR < 0.5% | `clicks / impressions` | Baixa relevância de anúncio | Revisar creative/targeting |
| 2 | warning | ROAS 1-2x | `1 < roas < 2` | Margem mínima de lucro | Otimizar ou pausar |
| 2 | warning | 1 plataforma > 85% spend | `max(spend)/total(spend) > 0.85` | Risco concentração | Diversificar tráfego |
| 2 | warning | Customer return rate < 5% | `uniqueReturningCustomers / uniqueCustomers < 0.05` | Baixa retenção (Shopify) | Produto/experiência |
| 2 | warning | AOV < 30€ | `revenue / orders < 30` | Ticket médio baixo | Upsell/cross-sell |
| 3 | neutral | Só tráfego orgânico | `sum(spend) === 0` | Nenhuma plataforma paga ativa | Info: sem investimento pago |
| 4 | positive | ROAS > 4x | `roas > 4` | Excelente retorno | Escalar investimento |
| 4 | positive | Customer return > 20% | `customerReturnRate > 20` | Boa retenção (Shopify) | Produto satisfaz |
| 4 | positive | ROI > 100% | Lucro > investimento | Muito saudável | Continuar estratégia |

**Fluxo de Dados:**
```
API: /api/dashboard/kpis
  ├─ Shopify: revenue, orders, customerReturnRate, uniqueCustomers
  ├─ Google Ads: spend, conversions, clicks, impressions
  ├─ Meta Ads: spend, conversions, clicks, impressions
  └─ TikTok: (not configured)
  
QuickSuggestions Component
  ├─ Calcula: ROAS, CPA, CTR, AOV por plataforma
  ├─ Avalia: Cada condição de insight
  ├─ Prioriza: 12+ insights por priority
  └─ Exibe: Top 3 + expandível
```

### 4. 📈 Métricas Principais (Expandível)
- **Localização:** Após filtros e insights
- **Tipo:** Seção colapsável (pode ser contraída)
- **Função:** Mostrar KPIs agregados e tendências do período
- **Por quê:** Visão 360º da performance; sparklines + trends ajudam a ver padrões
- **Grid:** 4 colunas (lg), 2 colunas (md), 1 coluna (mobile)

**Lógica de Cálculo (todas as métricas):**
```typescript
// Agregação por plataforma selecionada
const filteredData = platformDataArray.filter(p => 
  selectedPlatforms.includes(p.platform)
)

// Cálculo de totais
totalRevenue = sum(filteredData.revenue)
totalSpend = sum(filteredData.spend)
totalConversions = sum(filteredData.conversions)
totalClicks = sum(filteredData.clicks)

// Cálculo de métricas derivadas
roas = totalRevenue / totalSpend
cpa = totalSpend / totalConversions
aov = totalRevenue / totalConversions
conversionRate = (totalConversions / totalClicks) * 100

// Trend (vs período anterior)
trend = ((current - previous) / previous) * 100
```

#### Primeira Linha (KPIs Principais)
| Card | Métrica | Fórmula | Dados | Sparkline | Trend | Por quê | Cor |
|---|---|---|---|---|---|---|---|
| 1 | Receita | SUM(revenue) | Shopify + Ads | 7 dias | vs dia anterior | Saúde geral do negócio | 💰 green |
| 2 | Pedidos | SUM(orders) | Shopify (organic) + Conversões (ads) | 7 dias | vs dia anterior | Volume de transações | 📦 blue |
| 3 | Valor Médio (AOV) | revenue / orders | SUM / COUNT | 7 dias | vs dia anterior | Eficiência comercial | 💵 purple |
| 4 | ROAS | revenue / spend | SUM / SUM | 7 dias | vs dia anterior | Eficiência de anúncios | 📈 orange |

**Fontes de Dados:**
- **Receita:** Shopify (organic revenue) + Google Ads (conversionValue) + Meta Ads (conversionValue)
- **Pedidos:** Shopify (orders) + Google Ads (conversions) + Meta Ads (conversions)
- **AOV:** revenue / orders (agregado)
- **ROAS:** revenue / spend (só para plataformas pagas)

#### Segunda Linha (KPIs Secundários)
| Card | Métrica | Fórmula | Dados | Sparkline | Trend | Por quê | Cor |
|---|---|---|---|---|---|---|---|
| 1 | Custo Total | SUM(spend) | Google + Meta (sem Shopify) | 7 dias | vs dia anterior | Investimento em anúncios | 💳 pink |
| 2 | Custo por Compra (CPA) | spend / conversions | SUM / SUM | 7 dias | vs dia anterior (inverted) | Eficiência de aquisição | 🎯 blue |
| 3 | Taxa de Conversão | (conversions / clicks) * 100 | Ads data | 7 dias | vs dia anterior | Qualidade de tráfego | ✅ green |
| 4 | Taxa Retorno Cliente | (returningCustomers / totalCustomers) * 100 | Shopify | 7 dias | vs dia anterior | Retenção de clientes | 🔄 cyan |

**Fontes de Dados:**
- **Custo Total:** Google Ads spend + Meta Ads spend (EUR converted)
- **CPA:** totalSpend / totalConversions (só ads)
- **Taxa Conversão:** totalConversions / totalClicks * 100
- **Taxa Retorno:** Shopify uniqueReturningCustomers / uniqueCustomers

**Cada Card (TripleWhaleKPI):**
- **Ícone + Label:** Identifica a métrica visualmente
- **Valor atual + Unit:** Número formatado com currency/percentage
- **Valor anterior:** Mesmo período anterior (MOCK_PREVIOUS_PERIOD)
- **Sparkline:** 7 pontos de dados (últimos 7 dias) para ver padrão
- **Trend %:** Mudança percentual vs período anterior (verde se melhora, vermelho se piora)

### 5. 🔥 Padrões de Performance (Expandível)
- **Localização:** Abaixo de Métricas Principais
- **Tipo:** Heatmap por dia da semana
- **Função:** Identificar padrões de performance por dia
- **Por quê:** Ajuda a entender se há dias melhores/piores; permite otimizar investimento
- **Dados:** ROAS, Revenue, Orders por dia (MOCK_HEATMAP com 7 dias)
- **Layout:** Grid colorido com intensidades (ROAS verde/laranja, revenue tonalidades)
- **Informação Exibida:**
  - Dia da semana (nome completo + abreviado)
  - ROAS (número + cor por intensidade)
  - Revenue (€XXX)
  - Orders (número)

**Por quê cada dia da semana:**
- Segunda-Sexta: Comportamento de semana (trabalho)
- Sábado-Domingo: Fim de semana (comportamento diferente, impulsos de compra diferentes)

### 6. 📝 Alterações Recentes (Expandível)
- **Localização:** Abaixo do Heatmap
- **Tipo:** Activity log com timeline
- **Função:** Audit trail de mudanças em campanhas
- **Por quê:** Rastrear o que mudou e quando; conectar mudanças a efeitos nas métricas
- **Dados (MOCK):**
  - **Timestamp:** "Hoje, 14:30" / "Ontem, 09:15" / "2 dias atrás"
  - **Ação:** pause, adjustment, launch
  - **Plataforma:** "Meta Ads - Campanha 'Summer Sale'"
  - **Detalhes:** "ROAS caiu abaixo de 2x - pausado para revisão"
  - **Ícone de tipo:** ⏸️ (pause), ⚙️ (adjustment), 🚀 (launch)

**Futuro (quando conectado a APIs):**
- Integrar com Meta Ads, Google Ads APIs para puxar mudanças reais
- Cronograma visual mostrando correlação entre mudanças e impacto em métricas

### 7. 📊 Tabela de Performance por Plataforma (Expandível)
- **Localização:** Abaixo de Recent Changes
- **Componente:** `PlatformPerformanceTable`
- **Função:** Comparação lado-a-lado de todas as plataformas
- **Por quê:** Ver qual plataforma está a performar melhor; identificar outliers

**Colunas & Dados:**
| Coluna | Fórmula | Dados | Por quê |
|---|---|---|---|
| Plataforma | - | Nome (Google Ads, Meta, TikTok, etc.) | Identificar fonte |
| Gasto | SUM(spend) | Apenas plataformas pagas | Investimento por fonte |
| Receita | SUM(revenue) | Receita atribuída à plataforma | Retorno por fonte |
| ROAS | revenue / spend | Ambas colunas acima | Eficiência de ROI |
| CPA | spend / conversions | Custo por aquisição | Eficiência de aquisição |
| Conversões | SUM(conversions) | Conversões por plataforma | Volume de aquisição |
| CTR | (clicks / impressions) * 100 | Click-through rate | Qualidade de anúncio |

**Cores por Plataforma:**
- Google Ads: blue-50 + blue-500 border (google branding)
- Meta Ads: blue-50 + blue-600 border (facebook branding)
- TikTok: gray-50 + gray-900 border (dark branding)
- Pinterest: red-50 + red-500 border (red branding)
- Shopify: green-50 + green-500 border (organic/shopify)
- Organic: purple-50 + purple-500 border (non-paid)
- Outros: slate-50 + slate-500 border (fallback)

**Hover:** Destaque ao passar mouse (bg-gray-50)

### 8. 📉 Gráficos (Expandível)
- **Localização:** Abaixo de Platform Table
- **Tipo:** Charts colapsáveis (múltiplos)
- **Função:** Visualização de histórico e tendências
- **Por quê:** Humanos veem padrões melhor em gráficos que em números
- **Exemplos (podem existir ou não):**
  - **Revenue Chart:** Line chart mostrando revenue ao longo do período
  - **Orders Chart:** Bar/line chart mostrando volume de pedidos
  - **Performance Heatmap:** Heatmap colorido de dias/horas com performance
- **Dados:** Histórico do período selecionado (filtrado por plataforma se selecionado)

---

## 📊 Análise Detalhada (`/dashboard/analytics`)

**Arquivo:** `app/dashboard/analytics/page.tsx` → `components/analytics/AnalyticsClient.tsx`

### 1. Header
- **Tipo:** Cabeçalho fixo
- **Conteúdo:** Título "📊 Análise Detalhada"
- **Função:** Indicar página de análise aprofundada
- **Por quê:** Diferencia de Dashboard que é visão geral
- **Dados:** Static (sem dados dinâmicos)

### 2. Filtros & Controles
- **Localização:** Abaixo do header
- **Estilo:** Idêntico ao Dashboard (gradient background)
- **Função:** Mesma que Dashboard - segmentar por plataforma/período

**Componentes:**
  1. **PlatformDropdown** - Multi-select de plataformas
     - **Lógica:** Filtra dados de campaign treemap e performance table
     - **Impacto:** Treemap e tabela mostram apenas plataformas selecionadas
  
  2. **DateFilter** - Seletor de período
     - **Lógica:** Refetch de `/api/meta-ads/campaigns?period=${selectedPeriod}`
     - **Impacto:** Carrega campanhas do período selecionado

### 3. 🗂️ Campaign Treemap
- **Componente:** `CampaignTreemap`
- **Tipo:** Mapa hierárquico (como Treemap do Google Analytics)
- **Função:** Visualizar proporção de receita por plataforma
- **Por quê:** Treemaps são excelentes para ver "peso" de cada categoria; identifica rápido qual plataforma domina receita
- **Dados Exibidos:**
  - **Tamanho do retângulo:** Proportional a revenue
  - **Cor:** Baseada em ROAS (verde=bom, laranja=neutro, vermelho=mal)
  - **Label:** Nome da plataforma + revenue
  - **Hover Info:** ROAS, spend, revenue

**Fluxo de Dados:**
```typescript
const treemapData = filteredData.map(p => ({
  name: getPlatformLabel(p.platform),  // "Google Ads", "Meta Ads", etc.
  value: p.revenue,                     // Tamanho do retângulo
  roas: p.roas,                         // Cor (ROAS)
  spend: p.spend,                       // Informação ao hover
}))
```

**Por quê é importante:**
- Responde: "Qual plataforma gera mais receita?"
- Responde: "Quanto de revenue dependo de uma plataforma?"
- Identifica: Concentração de risco (uma plataforma > 70%?)

### 4. 📈 Performance por Plataforma (Tabela)
- **Tipo:** Tabela detalhada, ordenada por revenue descendente
- **Função:** Comparação numérica precisa de todas as plataformas
- **Por quê:** Treemap é visual, tabela é preciso; ambas complementam-se

**Colunas & Dados:**
| Coluna | Fórmula | Formato | Cor | Por quê |
|---|---|---|---|---|
| Plataforma | - | "Google Ads", "Meta Ads", etc. | Platform color | Identificar |
| Receita | SUM(revenue) | €X,XXX.XX | green-600 | Quanto gerou |
| Gasto | SUM(spend) | €X,XXX.XX | gray-600 | Quanto investiu |
| ROAS | revenue / spend | X.XXx | blue-600 | Eficiência ROI |
| Conversões | SUM(conversions) | N | gray-600 | Volume adquirido |
| CPA | spend / conversions | €X.XX ou "—" | gray-600 | Custo por aquisição |

**Ordenação:** Por revenue (maior primeiro) - mostra logo qual plataforma domina

### 5. 📊 Performance de Campanhas (Campaign Hierarchy Tree)
- **Componente:** `CampaignHierarchyTree`
- **Tipo:** Árvore expansível com drilldown de campanhas
- **Função:** Análise em profundidade - ver performance de campanhas, ad sets e criativos
- **Por quê:** Tabela mostra plataforma agregada; árvore mostra campanh específicas com thumbnails
- **Dados:** Fetched de `/api/meta-ads/campaigns?period=${selectedPeriod}` (ou com datas customizadas)

**Estrutura Hierárquica (3 Níveis):**
```
📊 Meta Ads Campaign Performance
│
├─ Campanha: "Summer Sale" (Azul)
│  └─ 🟢 ACTIVE | €2500 spend | €12500 revenue | 5.0x ROAS | 50 conv
│  │
│  ├─ Ad Set: "Audience A - Desktop" (Vermelho)
│  │  └─ 🟢 ACTIVE | €1500 spend | €8000 revenue | 5.3x ROAS | 32 conv
│  │  │
│  │  ├─ Criativo: "Product Image v1" (Laranja)
│  │  │  └─ 🟢 ACTIVE | [Thumbnail] | €500 spend | €3000 revenue | 6.0x ROAS | 15 conv
│  │  │
│  │  └─ Criativo: "Product Image v2" (Laranja)
│  │     └─ 🟢 ACTIVE | [Thumbnail] | €1000 spend | €5000 revenue | 5.0x ROAS | 17 conv
│  │
│  └─ Ad Set: "Audience B - Mobile" (Vermelho)
│     └─ 🟡 PAUSED | €1000 spend | €4500 revenue | 4.5x ROAS | 18 conv
│
└─ Campanha: "Winter Promo" (Azul)
   └─ 🟢 ACTIVE | €1800 spend | €5200 revenue | 2.8x ROAS | 26 conv
   │
   └─ Ad Set: "Email List" (Vermelho)
      └─ 🟢 ACTIVE | €1800 spend | €5200 revenue | 2.8x ROAS | 26 conv
      │
      └─ Criativo: "Email Banner" (Laranja)
         └─ 🟢 ACTIVE | [Thumbnail] | €1800 spend | €5200 revenue | 2.8x ROAS | 26 conv
```

**Dados Exibidos por Nível:**
- **Campanha (Azul):** spend, revenue, ROAS, conversions, impressions, clicks, status, ad sets count
- **Ad Set (Vermelho):** spend, revenue, ROAS, conversions, impressions, clicks, status, creatives count
- **Criativo (Laranja):** 
  - Thumbnail (imagem/vídeo do criativo)
  - Name, status
  - spend, revenue, ROAS, conversions, impressions, clicks
  - Formatação compacta em uma linha

**Métricas Mostradas:**
- 💰 Spend (€)
- 📊 Revenue (€)
- 📈 ROAS (múltiplo, codificado por cor: verde se >2x, amarelo 1-2x, vermelho <1x)
- ✅ Conversions (número)
- 👁 Impressions (formatado com separador de milhar)
- 🖱 Clicks (número)

**Status Visual:**
- 🟢 ACTIVE (verde)
- 🟡 PAUSED (amarelo)
- ⚪ ARCHIVED (cinzento)

**Interatividade:**
- Clique em campanha para expandir/colapsar ad sets
- Clique em ad set para expandir/colapsar criativos
- Thumbnails dos criativos mostram preview da imagem/vídeo
- Hover effects para destacar linhas
- Collapse automático de seções não relevantes

**Por quê é importante (Camada 5 - Aprofundamento):**
- Identifica: Qual campanha/ad set/criativo específico performa bem/mal
- Permite: Escalar criativos que funcionam, pausar os que não funcionam
- Mostra: Padrões em performance (ex: mobile vs desktop, diferentes criativos)
- Facilita: Otimização granular (sem impactar toda a campanha)
- Detecta: Criativos fatigados (baixa performance com tempo)

**Fluxo de Dados:**
```
API: /api/meta-ads/campaigns?period=last7&startDate=X&endDate=Y
├─ Fetches: Campaigns com insights
├─ Para cada campaign:
│  └─ Fetches: Ad Sets com insights
│     └─ Para cada ad set:
│        └─ Fetches: Ads (criativos) com thumbnail + insights
├─ Parses: Metrics (spend, conversions, revenue, etc.)
└─ Retorna: CampaignNode[] com hierarquia completa

CampaignHierarchyTree
└─ Renderiza árvore expansível com 3 níveis
```

---

## 🔧 Componentes Reutilizáveis

### TripleWhaleKPI
- **Local:** `components/dashboard/TripleWhaleKPI.tsx`
- **Props:**
  - `label` - Nome da métrica
  - `value` - Valor atual
  - `unit` - Unidade (k, x, %, etc.)
  - `previousValue` - Valor do período anterior
  - `sparklineData` - Array de 7 dias {day, value}
  - `change` - Trend % (número positivo/negativo)
  - `color` - Cor do card
  - `icon` - Emoji do ícone

### PlatformDropdown
- **Local:** `components/dashboard/PlatformDropdown.tsx`
- **Props:**
  - `selectedPlatforms` - Array de plataformas selecionadas
  - `onPlatformChange` - Callback ao mudar seleção
  - `availablePlatforms` - Array de plataformas disponíveis

### DateFilter (Estilo Shopify)
- **Local:** `components/dashboard/DateFilter.tsx`
- **UI:** Um único botão "📅 Período Selecionado" que abre dropdown modal
- **Opções Presentes (Quick Select):**
  - 📅 Hoje (today)
  - 📆 Ontem (yesterday)
  - 📊 Últimos 7 dias (last7)
  - 📈 Este mês (mtd)
  - ➕ Datas Customizadas (custom)

- **Props:**
  - `onDateChange(range: DateRange, startDate?: string, endDate?: string)` - Callback ao mudar período
    - `range`: 'today' | 'yesterday' | 'last7' | 'mtd' | 'custom'
    - `startDate`: "YYYY-MM-DD" (apenas quando range === 'custom')
    - `endDate`: "YYYY-MM-DD" (apenas quando range === 'custom')

- **Estados Internos:**
  - `activeRange`: Qual período está selecionado
  - `isOpen`: Modal aberto/fechado
  - `showCustomForm`: Mostrar form de datas customizadas
  - `customStartDate`: Data de início customizada
  - `customEndDate`: Data de fim customizada

- **Funcionalidades:**
  - Dropdown modal ao clicar botão
  - Quick select para períodos predefinidos
  - Opção expandível para datas customizadas
  - Validação de datas (ambas obrigatórias)
  - Fechar modal ao selecionar preset ou clicar fora
  
- **Fluxo:**
  ```
  Usuário clica botão "📅 Últimos 7 dias"
    ↓
  Modal abre com opções
    ↓
  Usuário seleciona "Datas Customizadas"
    ↓
  Form aparece com 2 inputs de data
    ↓
  Usuário preenche datas e clica "Aplicar"
    ↓
  onDateChange('custom', '2026-04-10', '2026-04-15')
    ↓
  Modal fecha, botão mostra "📅 Datas customizadas"
  ```

### CampaignHierarchyTree
- **Local:** `components/analytics/CampaignHierarchyTree.tsx`
- **Props:**
  - `campaigns` - Array de CampaignNode[] (ou null)
  - `isLoading` - Boolean (mostra skeleton loader)
  - `error` - String | null (erro message)
- **Dados por Node:**
  - **CampaignNode:** id, name, status, spend, revenue, ROAS, conversions, impressions, clicks, CTR, CPA, adsets[]
  - **AdsetNode:** id, name, status, spend, revenue, ROAS, conversions, impressions, clicks, CTR, CPA, ads[]
  - **AdNode:** id, name, status, thumbnail?, spend, revenue, ROAS, conversions, impressions, clicks, CTR, CPA
- **Funcionalidades:**
  - Expandir/colapsar cada nível
  - Mostra thumbnails de criativos
  - Métricas compactas por nível
  - Status visual (🟢 ACTIVE, 🟡 PAUSED, ⚪ ARCHIVED)
  - Legend de métricas e status

### QuickSuggestions
- **Local:** `components/dashboard/QuickSuggestions.tsx`
- **Props:**
  - `platformData` - Array de PlatformKPIs
  - `shopifyMetrics` - {customerReturnRate, uniqueCustomers, uniqueReturningCustomers}

### PlatformPerformanceTable
- **Local:** `components/dashboard/PlatformPerformanceTable.tsx`
- **Props:**
  - `data` - Array de PlatformKPIs
  - `loading` - Boolean de carregamento

---

## 📍 Fluxo de Dados Completo

### Dashboard Home Data Flow
```
SOURCES (APIs Externas)
├─ Shopify GraphQL API
│  └─ /api/shopify/metrics?period=...
│     └─ Retorna: orders, revenue, averageOrderValue, uniqueCustomers, 
│                 uniqueReturningCustomers, customerReturnRate, currency
│
├─ Google Ads API
│  └─ /api/google-ads/metrics?period=...
│     └─ Retorna: spend, clicks, impressions, conversions, conversionValue, cpc, roas
│
└─ Meta Ads API
   └─ /api/meta-ads/metrics?period=...
      └─ Retorna: spend, clicks, impressions, conversions, conversionValue, cpc, roas

           ↓↓↓ AGGREGATION ↓↓↓

AGGREGATOR: /api/dashboard/kpis?period=...
├─ Combina dados de 3 fontes
├─ Converte currencies (USD → EUR com taxa 0.92)
├─ Calcula KPIs derivados (ROAS, CPA, CTR, AOV, conversionRate)
├─ Mapeia para estrutura DashboardKPIs:
│  └─ byPlatform: Record<Platform, PlatformKPIs>
│     ├─ "google-ads": {spend, revenue, roas, conversions, cpa, impressions, clicks, ctr}
│     ├─ "meta-ads": {...}
│     ├─ "organic": {spend: 0, revenue: shopifyRevenue, conversions: shopifyOrders, ...}
│     └─ outros...
└─ Retorna: {success, data, dataSources, timestamp}

           ↓↓↓ PRESENTATION ↓↓↓

CLIENT COMPONENT: DashboardClient
├─ Recebe: kpisByPlatform (Record<Platform, PlatformKPIs>)
├─ Oferece Filtros:
│  ├─ Platform Filter → filtra platformDataArray
│  └─ Date Filter → refetch /api/dashboard/kpis?period=newPeriod
├─ Calcula Agregados (apenas plataformas selecionadas):
│  └─ calculateAggregatedKPIs(filteredData)
│     └─ Retorna: totalRevenue, totalSpend, roas, cpa, conversions, trends, etc.
└─ Renderiza Componentes:
   ├─ QuickSuggestions(platformDataArray, shopifyMetrics)
   │  └─ Gera insights com base em KPIs
   ├─ TripleWhaleKPI × 8 (com sparklines + trends)
   ├─ PerformanceHeatmap(MOCK_HEATMAP)
   ├─ RecentChanges(MOCK_RECENT_CHANGES)
   ├─ PlatformPerformanceTable(platformDataArray)
   └─ Charts(MOCK_data)
```

### Analytics Page Data Flow
```
SOURCES
├─ /api/dashboard/kpis?period=...  (PlatformKPIs)
│
├─ /api/meta-ads/campaigns?period=... (Campaign details)
│  └─ Retorna: campaigns[
│     {id, name, status, spend, impressions, clicks, conversions, 
│      revenue, roas, cpa, adsets[...]}
│     ]
│
└─ Shopify/Google/Meta (se novas campanhas precisam atualizar)

           ↓↓↓ PRESENTATION ↓↓↓

CLIENT COMPONENT: AnalyticsClient
├─ Recebe: kpisByPlatform
├─ Oferece Filtros: (Platform + Date)
├─ Renderiza:
│  ├─ CampaignTreemap(filteredData)
│  │  └─ Mostra revenue distribution por plataforma (visual)
│  ├─ Performance Table(filteredData)
│  │  └─ Mostra números precisos (tabela)
│  └─ CampaignHierarchyTree(campaigns)
│     └─ Permite drilldown em campanhas específicas
```

### Data Sources Summary

| Fonte | Endpoint | Dados | Uso |
|---|---|---|---|
| **Shopify** | `/api/shopify/metrics` | orders, revenue, customers, return rate | Organic traffic (revenue) + customer metrics |
| **Google Ads** | `/api/google-ads/metrics` | spend, conversions, impressions, clicks | Paid traffic (Google) |
| **Meta Ads** | `/api/meta-ads/metrics` | spend, conversions, impressions, clicks | Paid traffic (Facebook/Instagram) |
| **TikTok Ads** | `/api/tiktok-ads/metrics` | (not configured) | Paid traffic (TikTok) - future |
| **Meta Campaigns** | `/api/meta-ads/campaigns` | campaign-level details | Análise detalhada (Analytics page) |

### Data Transformations

**Currency Conversion:**
```
Google Ads (USD) → EUR: spend * 0.92, conversionValue * 0.92
Meta Ads (USD) → EUR: spend * 0.92, conversionValue * 0.92
Shopify (EUR) → EUR: sem mudança
```

**Aggregation Logic:**
```
Para cada Platform:
  totalRevenue = sum(revenue) para essa plataforma
  totalSpend = sum(spend) para essa plataforma
  totalConversions = sum(conversions) para essa plataforma
  
Métricas Derivadas:
  ROAS = totalRevenue / totalSpend (ou 0 se sem spend)
  CPA = totalSpend / totalConversions (ou 0 se sem conversões)
  CTR = (totalClicks / totalImpressions) * 100 (ou 0)
  
Trends (vs período anterior):
  trend = ((current - previous) / previous) * 100
```

**Filtering:**
```
User selects: platforms = ["google-ads", "organic"]
              period = "last7"

Effect:
  filteredData = platformDataArray.filter(p => 
    selectedPlatforms.includes(p.platform)
  )
  
KPIs recalculated only for filtered data
All components re-render with filtered KPIs
Sparklines/trends also for filtered data only
```

---

## 📊 Hierarquia de Informação (Camadas de Detalhe)

Dashboard segue modelo de **Progressive Disclosure** - informação complexa revelada gradualmente:

### Camada 1: Resumo Executivo (Top of Page)
**Conteúdo:** Insights + 4 KPIs principais
**Audiência:** C-level, gestores
**Objetivo:** Responder "Como está o negócio?" em 10 segundos
**Dados:** Apenas números críticos (Revenue, Orders, ROAS, AOV)
**Exemplo:** "€15.6k receita, ROAS 4.2x, 156 pedidos"

### Camada 2: Análise de Performance (Métricas Principais)
**Conteúdo:** 8 KPIs + sparklines + trends
**Audiência:** Product managers, marketing leads
**Objetivo:** Entender "O que mudou?" vs dia/semana anterior
**Dados:** KPI atual + histórico + comparação + direção (up/down)
**Exemplo:** "CPA €24.50 (-3.2% vs ontem, trend em 7 dias: baixo→alto→meio)"

### Camada 3: Diagnóstico (Alertas + Heatmap)
**Conteúdo:** Insights problemas, padrões por dia
**Audiência:** Operações, analysts
**Objetivo:** Identificar "O que precisa atenção?"
**Dados:** Condições problemáticas + dias com melhor/pior performance
**Exemplo:** "⚠️ Google Ads CTR abaixo de 0.5%, sexta é o melhor dia (ROAS 5.2x)"

### Camada 4: Comparação Detalhada (Platform Table)
**Conteúdo:** Todas as plataformas lado-a-lado
**Audiência:** Analysts, budget owners
**Objetivo:** "Qual plataforma performa melhor?"
**Dados:** 7 colunas de métricas por plataforma
**Exemplo:** "Meta ROAS 5.5x vs Google 3.2x, mas Google tem CTR melhor 1.2% vs 0.8%"

### Camada 5: Aprofundamento (Analytics Page + Treemap)
**Conteúdo:** Treemap + Hierarquia de campanhas
**Audiência:** Campaign managers, specialists
**Objetivo:** "Qual campanha específica está mal?"
**Dados:** Drill-down até nível de ad set individual
**Exemplo:** "Meta 'Summer Sale' campaign: pausada ROAS 0.8x; 'Winter Promo' ROAS 6.2x escalando"

**Visual Summary:**
```
EXECUTIVE VIEW         ← 10 segundo overview
    ↓ mais detalhes
PERFORMANCE VIEW       ← Dia-a-dia trends
    ↓ problemas encontrados
DIAGNOSTIC VIEW        ← Alertas + padrões
    ↓ comparações
COMPARISON VIEW        ← Platform vs platform
    ↓ entender raiz
DETAILED VIEW          ← Campaign drilldown
```

---

## 🔄 Tipos de Dados por Secção

### Dados Brutos (Raw)
**Fonte:** APIs externas (Shopify, Google Ads, Meta Ads)
**Exemplo:** Order {id, price, date}, Campaign {spend, conversions}
**Local:** `/api/[source]/metrics`

### Dados Agregados (Aggregated)
**Transformação:** SUM, COUNT, AVERAGE por plataforma
**Exemplo:** Google Ads total {spend: €500, conversions: 12, ...}
**Local:** `/api/dashboard/kpis` endpoint
**Componentes:** PlatformKPIs, byPlatform Record

### Dados Derivados (Calculated)
**Transformação:** Fórmulas em cima de agregados
**Exemplos:**
  - ROAS = revenue / spend
  - CPA = spend / conversions
  - CTR = (clicks / impressions) * 100
  - Trend = ((current - previous) / previous) * 100
**Local:** `calculateAggregatedKPIs()` function

### Dados Contextualizados (Insights)
**Transformação:** Regras de negócio em cima de derivados
**Exemplos:**
  - "ROAS 0.8x" → Alert "Losing money"
  - "CTR 0.3%" → Warning "Very low engagement"
  - "ROAS 5.2x" → Positive "Excellent ROI"
**Local:** `QuickSuggestions` component, insight evaluation rules

### Dados Históricos (Time Series)
**Transformação:** Mesmas métricas em múltiplos dias
**Exemplos:**
  - Sparkline data: [Mon: €2100, Tue: €2400, ...]
  - Trends: -3.2% vs dia anterior
  - Heatmap: performance por dia semana
**Local:** MOCK_SPARKLINE_DATA, MOCK_HEATMAP

### Dados Estruturados (Hierarchical)
**Transformação:** Campanhas agrupadas por plataforma
**Exemplos:**
  - Meta Ads → Campaign 'Summer Sale' → Ad Set 'Audience A'
  - Cada nível tem seus próprios KPIs
**Local:** CampaignHierarchyTree, Campaign endpoints

---

## 🎨 Design System

### Colors por Plataforma
| Plataforma | BG | Border | Texto |
|---|---|---|---|
| Google Ads | blue-50 | blue-500 | google-blue |
| Meta Ads | blue-50 | blue-600 | facebook-blue |
| TikTok Ads | gray-50 | gray-900 | dark |
| Pinterest | red-50 | red-500 | red |
| Shopify | green-50 | green-500 | green |
| Organic | purple-50 | purple-500 | purple |
| Outros | slate-50 | slate-500 | slate |

### Cores de KPI
| Métrica | Cor | Significado |
|---|---|---|
| Receita | green | Positivo/Revenue |
| Pedidos | blue | Neutral/Quantity |
| AOV | purple | Secondary |
| ROAS | orange | Performance |
| Custo Total | pink | Spend |
| CPA | blue | Cost |
| Taxa Conversão | green | Success |
| Customer Return | cyan | Retention |

### Tipografia
- **Headers:** font-bold, text-gray-900
- **Labels:** font-semibold, text-gray-700
- **Valores:** Monospace para números

---

## 📋 Checklist para Nova Página

Quando adicionar uma nova página/tab, complete:

- [ ] Crie o arquivo em `app/` ou `components/`
- [ ] Adicione o Server Component (fetch de dados)
- [ ] Adicione o Client Component (renderização)
- [ ] Use componentes reutilizáveis (filters, KPIs, tables)
- [ ] Mantenha o design system consistente
- [ ] **ATUALIZE ESTE ARQUIVO** com a nova estrutura
- [ ] Documente os dados que a página precisa
- [ ] Teste responsividade (mobile, tablet, desktop)

---

## 📝 Histórico de Mudanças

### v1.0 - 2026-04-15
- Dashboard Home estrutura completa com 8 KPIs
- Analytics Detalhada com Treemap e tabelas
- Sistema de Insights com priorização
- Documentação completa da estrutura

**Próximas mudanças:**
- [ ] Adicionar Settings page
- [ ] Adicionar Campaign Editor
- [ ] Adicionar Budget Management
