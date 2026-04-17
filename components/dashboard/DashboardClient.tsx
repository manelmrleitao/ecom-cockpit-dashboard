'use client'

/**
 * DashboardClient - Interactive Dashboard Component
 * Handles all client-side state, filtering, and interactivity
 * Receives pre-fetched data from server component
 */

import { useState, useEffect } from 'react'
import {
  TripleWhaleKPI,
  RevenueChart,
  OrdersChart,
  PlatformROASChart,
  PlatformDropdown,
  PerformanceHeatmap,
  RecentChanges,
  DateFilter,
  QuickSuggestions,
  IntegrationAlert,
  CustomerReturnRateKPI,
  SalesSources,
  AcquisitionSourceFilter,
} from '@/components/dashboard'
import { PlatformPerformanceTable } from '@/components/dashboard/PlatformPerformanceTable'
import type { PlatformKPIs, DashboardKPIs } from '@/types'

interface DashboardClientProps {
  kpisByPlatform?: Record<string, PlatformKPIs>
  isMock: boolean
  errors?: Record<string, string>
  dataSources?: { shopify: boolean; googleAds: boolean; metaAds: boolean }
}

// Função para calcular KPIs agregados baseado na plataforma selecionada
function calculateAggregatedKPIs(data: PlatformKPIs[]) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const totalSpend = data.reduce((sum, item) => sum + item.spend, 0)
  const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0)
  const totalConversions = data.reduce((sum, item) => sum + item.conversions, 0)
  const totalOrders = totalConversions
  const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0
  const cpa = totalConversions > 0 ? totalSpend / totalConversions : 0
  const aov = totalConversions > 0 ? totalRevenue / totalConversions : 0
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

  // Calcular tendências comparando com período anterior
  const previousPeriod = MOCK_PREVIOUS_PERIOD
  const previousCPA = previousPeriod.cpa
  const previousConversionRate = (previousPeriod.totalOrders / (previousPeriod.totalSpend * 2)) * 100 // Estimativa
  const previousSpend = previousPeriod.totalSpend

  const cpaTrend = previousCPA > 0 ? ((cpa - previousCPA) / previousCPA) * 100 : 0
  const conversionRateTrend = previousConversionRate > 0 ? ((conversionRate - previousConversionRate) / previousConversionRate) * 100 : 0
  const spendTrend = previousSpend > 0 ? ((totalSpend - previousSpend) / previousSpend) * 100 : 0
  const revenueTrend = previousPeriod.totalRevenue > 0 ? ((totalRevenue - previousPeriod.totalRevenue) / previousPeriod.totalRevenue) * 100 : 0
  const ordersTrend = previousPeriod.totalOrders > 0 ? ((totalOrders - previousPeriod.totalOrders) / previousPeriod.totalOrders) * 100 : 0
  const aoVTrend = previousPeriod.aov > 0 ? ((aov - previousPeriod.aov) / previousPeriod.aov) * 100 : 0
  const roasTrend = previousPeriod.roas > 0 ? ((roas - previousPeriod.roas) / previousPeriod.roas) * 100 : 0

  return {
    totalRevenue,
    totalSpend,
    roas,
    cpa,
    totalOrders,
    aov,
    totalConversions,
    conversionRate,
    revenueTrend,
    ordersTrend,
    aoVTrend,
    roasTrend,
    cpaTrend,
    conversionRateTrend,
    spendTrend,
  }
}

function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    'google-ads': 'Google',
    'meta-ads': 'Meta',
    'tiktok-ads': 'TikTok',
    pinterest: 'Pinterest',
    organic: 'Orgânico',
    shopify: 'Shopify',
    outros: 'Outros',
  }
  return labels[platform] || platform
}


// Mock data para período anterior
const MOCK_PREVIOUS_PERIOD = {
  totalRevenue: 14100.00,
  totalSpend: 3200.00,
  totalOrders: 130,
  roas: 4.40,
  cpa: 24.62,
  aov: 108.46,
  customerReturnRate: 1.8,
}

// Mock sparkline data (últimos 7 dias)
const MOCK_SPARKLINE_DATA = {
  revenue: [
    { day: 'Seg', value: 1800 },
    { day: 'Ter', value: 2100 },
    { day: 'Qua', value: 1950 },
    { day: 'Qui', value: 2400 },
    { day: 'Sex', value: 2800 },
    { day: 'Sab', value: 2650 },
    { day: 'Dom', value: 2100 },
  ],
  orders: [
    { day: 'Seg', value: 18 },
    { day: 'Ter', value: 21 },
    { day: 'Qua', value: 20 },
    { day: 'Qui', value: 24 },
    { day: 'Sex', value: 28 },
    { day: 'Sab', value: 26 },
    { day: 'Dom', value: 21 },
  ],
  aov: [
    { day: 'Seg', value: 100 },
    { day: 'Ter', value: 100 },
    { day: 'Qua', value: 97.5 },
    { day: 'Qui', value: 100 },
    { day: 'Sex', value: 100 },
    { day: 'Sab', value: 102 },
    { day: 'Dom', value: 100 },
  ],
  roas: [
    { day: 'Seg', value: 3.8 },
    { day: 'Ter', value: 4.2 },
    { day: 'Qua', value: 4.1 },
    { day: 'Qui', value: 4.6 },
    { day: 'Sex', value: 5.2 },
    { day: 'Sab', value: 4.5 },
    { day: 'Dom', value: 3.5 },
  ],
  spend: [
    { day: 'Seg', value: 450 },
    { day: 'Ter', value: 500 },
    { day: 'Qua', value: 475 },
    { day: 'Qui', value: 520 },
    { day: 'Sex', value: 540 },
    { day: 'Sab', value: 590 },
    { day: 'Dom', value: 600 },
  ],
  cpa: [
    { day: 'Seg', value: 25 },
    { day: 'Ter', value: 24 },
    { day: 'Qua', value: 24 },
    { day: 'Qui', value: 22 },
    { day: 'Sex', value: 19 },
    { day: 'Sab', value: 23 },
    { day: 'Dom', value: 29 },
  ],
  conversionRate: [
    { day: 'Seg', value: 4.0 },
    { day: 'Ter', value: 4.1 },
    { day: 'Qua', value: 3.8 },
    { day: 'Qui', value: 4.5 },
    { day: 'Sex', value: 4.9 },
    { day: 'Sab', value: 4.2 },
    { day: 'Dom', value: 3.7 },
  ],
  customerReturnRate: [
    { day: 'Seg', value: 1.5 },
    { day: 'Ter', value: 1.8 },
    { day: 'Qua', value: 1.7 },
    { day: 'Qui', value: 2.1 },
    { day: 'Sex', value: 2.3 },
    { day: 'Sab', value: 2.0 },
    { day: 'Dom', value: 2.2 },
  ],
}


// Heatmap de performance por dia da semana
const MOCK_HEATMAP: Array<{ day: string; dayShort: string; roas: number; revenue: number; orders: number }> = [
  { day: 'Segunda', dayShort: 'Seg', roas: 3.8, revenue: 2100, orders: 20 },
  { day: 'Terça', dayShort: 'Ter', roas: 4.2, revenue: 2400, orders: 23 },
  { day: 'Quarta', dayShort: 'Qua', roas: 4.1, revenue: 2350, orders: 22 },
  { day: 'Quinta', dayShort: 'Qui', roas: 4.6, revenue: 2650, orders: 25 },
  { day: 'Sexta', dayShort: 'Sex', roas: 5.2, revenue: 3100, orders: 29 },
  { day: 'Sábado', dayShort: 'Sab', roas: 4.5, revenue: 2700, orders: 26 },
  { day: 'Domingo', dayShort: 'Dom', roas: 3.5, revenue: 1800, orders: 17 },
]

// Mudanças recentes
const MOCK_RECENT_CHANGES = [
  {
    id: '1',
    timestamp: 'Hoje, 14:30',
    action: 'Campanha pausada',
    platform: 'Meta Ads - Campanha "Summer Sale"',
    icon: '⏸️',
    details: 'ROAS caiu abaixo de 2x - pausado para revisão',
    type: 'pause' as const,
  },
  {
    id: '2',
    timestamp: 'Ontem, 09:15',
    action: 'Budget ajustado',
    platform: 'Google Ads - Search',
    icon: '⚙️',
    details: 'Aumentado em +20% devido a alta performance',
    type: 'adjustment' as const,
  },
  {
    id: '3',
    timestamp: '2 dias atrás, 11:00',
    action: 'Nova campanha',
    platform: 'TikTok Ads - Brand Awareness',
    icon: '🚀',
    details: 'Lançada com budget inicial de €500/semana',
    type: 'launch' as const,
  },
]


export function DashboardClient({
  kpisByPlatform = {},
  isMock,
  errors = {},
  dataSources = { shopify: false, googleAds: false, metaAds: false },
}: DashboardClientProps) {
  // State para tracking de dados dinâmicos
  const [dynamicKPIs, setDynamicKPIs] = useState<Record<string, PlatformKPIs>>(kpisByPlatform || {})
  const [integrationErrors, setIntegrationErrors] = useState(errors)
  const [integrationDataSources, setIntegrationDataSources] = useState(dataSources)
  const [shopifyMetrics, setShopifyMetrics] = useState<{
    customerReturnRate: number
    uniqueReturningCustomers: number
    uniqueCustomers: number
  }>({ customerReturnRate: 0, uniqueReturningCustomers: 0, uniqueCustomers: 0 })

  // Converter kpisByPlatform para array para cálculos (defensivo contra undefined)
  let platformDataArray = Object.values(dynamicKPIs || {})

  // Mostrar TODAS as plataformas no filtro (não apenas as com dados)
  const ALL_PLATFORMS = ['google-ads', 'meta-ads', 'tiktok-ads', 'pinterest', 'organic', 'outros']
  const availablePlatforms = ALL_PLATFORMS

  // Inicializar selectedPlatforms com todas as plataformas disponíveis
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string>('last7')
  const [customDateRange, setCustomDateRange] = useState<{ start?: string; end?: string }>({})
  const [isLoadingPeriod, setIsLoadingPeriod] = useState(false)

  // Estados para secções colapsáveis
  const [expandMetrics, setExpandMetrics] = useState(true)
  const [expandHeatmap, setExpandHeatmap] = useState(false)
  const [expandRecentChanges, setExpandRecentChanges] = useState(false)
  const [expandPlatformTable, setExpandPlatformTable] = useState(false)
  const [expandCharts, setExpandCharts] = useState(false)
  const [expandROAS, setExpandROAS] = useState(false)
  const [expandComparison, setExpandComparison] = useState(false)

  // Refetch dados quando período muda
  useEffect(() => {
    const fetchDataByPeriod = async () => {
      setIsLoadingPeriod(true)
      console.log('[Dashboard] Fetching data for period:', selectedPeriod, 'custom:', customDateRange)
      try {
        // Build query params
        let kpiUrl = `/api/dashboard/kpis?period=${selectedPeriod}`
        if (selectedPeriod === 'custom' && customDateRange.start && customDateRange.end) {
          kpiUrl += `&startDate=${customDateRange.start}&endDate=${customDateRange.end}`
        }

        // Buscar KPIs consolidados
        const kpiResponse = await fetch(kpiUrl)
        if (kpiResponse.ok) {
          const result = await kpiResponse.json()
          if (result.data && result.data.byPlatform) {
            setDynamicKPIs(result.data.byPlatform)
          }
          if (result.errors) {
            setIntegrationErrors(result.errors)
          }
          if (result.data?.dataSources) {
            setIntegrationDataSources(result.data.dataSources)
          }
        }

        // Buscar métricas de Shopify para CRR
        let shopifyUrl = `/api/shopify/metrics?period=${selectedPeriod}`
        if (selectedPeriod === 'custom' && customDateRange.start && customDateRange.end) {
          shopifyUrl += `&startDate=${customDateRange.start}&endDate=${customDateRange.end}`
        }

        const shopifyResponse = await fetch(shopifyUrl)
        if (shopifyResponse.ok) {
          const shopifyData = await shopifyResponse.json()
          if (!('error' in shopifyData)) {
            setShopifyMetrics({
              customerReturnRate: shopifyData.customerReturnRate || 0,
              uniqueReturningCustomers: shopifyData.uniqueReturningCustomers || 0,
              uniqueCustomers: shopifyData.uniqueCustomers || 0,
            })
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do período:', error)
      } finally {
        setIsLoadingPeriod(false)
      }
    }

    if (selectedPeriod) {
      fetchDataByPeriod()
    }
  }, [selectedPeriod, customDateRange])

  // Sincronizar selectedPlatforms quando os dados mudarem
  useEffect(() => {
    setSelectedPlatforms(availablePlatforms)
  }, [availablePlatforms.join(',')])  // Usar join para comparação estável

  // Calcular KPIs baseado nas plataformas selecionadas
  const filteredData =
    selectedPlatforms.length === 0
      ? platformDataArray
      : platformDataArray.filter((item) => selectedPlatforms.includes(item.platform))

  // Use filtered data for KPIs (responsive to filters)
  const kpis = calculateAggregatedKPIs(filteredData.length > 0 ? filteredData : platformDataArray)

  // Format previous period values for display
  const prevRevenue = `€${(MOCK_PREVIOUS_PERIOD.totalRevenue / 1000).toFixed(2)}k`
  const prevOrders = MOCK_PREVIOUS_PERIOD.totalOrders
  const prevAOV = `€${MOCK_PREVIOUS_PERIOD.aov.toFixed(2)}`
  const prevROAS = `${MOCK_PREVIOUS_PERIOD.roas.toFixed(2)}x`
  const prevSpend = `€${MOCK_PREVIOUS_PERIOD.totalSpend.toFixed(0)}`
  const prevCPA = `€${MOCK_PREVIOUS_PERIOD.cpa.toFixed(2)}`
  const prevConversionRate = ((MOCK_PREVIOUS_PERIOD.totalOrders / (MOCK_PREVIOUS_PERIOD.totalSpend * 2)) * 100).toFixed(2)
  const prevCustomerReturnRate = `${MOCK_PREVIOUS_PERIOD.customerReturnRate.toFixed(1)}%`

  // Calcular trend de customer return rate
  const customerReturnRateTrend = MOCK_PREVIOUS_PERIOD.customerReturnRate > 0
    ? ((shopifyMetrics.customerReturnRate - MOCK_PREVIOUS_PERIOD.customerReturnRate) / MOCK_PREVIOUS_PERIOD.customerReturnRate) * 100
    : 0

  // Se não há dados, mostrar mensagem
  if (platformDataArray.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Carregando dados do dashboard...</p>
      </div>
    )
  }

  return (
    <>
      {/* Integration Status Alerts */}
      <IntegrationAlert
        errors={integrationErrors}
        dataSources={integrationDataSources}
        isMock={isMock}
      />

      <div className="flex flex-col gap-4">
        {/* Header - Compacto */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">🎛️ Cockpit Command Center</h1>
        </div>

        {/* Controles - Filters COM CORES - Logo depois do header */}
        <div className="flex flex-col gap-3 py-4 px-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-200 rounded-lg">
          {/* Acquisition Source Filter */}
          <AcquisitionSourceFilter
            selectedSources={selectedSources}
            onSourceChange={setSelectedSources}
            period={selectedPeriod}
          />

          {/* Date Filter */}
          <DateFilter
            onDateChange={(range, startDate, endDate) => {
              setSelectedPeriod(range)
              if (range === 'custom' && startDate && endDate) {
                setCustomDateRange({ start: startDate, end: endDate })
              } else {
                setCustomDateRange({})
              }
            }}
          />
        </div>

        {/* Quick Suggestions - Logo depois dos filtros */}
        <QuickSuggestions platformData={platformDataArray} shopifyMetrics={shopifyMetrics} />

        {/* Main KPIs - Compactos (logo após Filtros) */}
        <div className="flex items-center gap-3 mt-4 mb-3">
          <button
            onClick={() => setExpandMetrics(!expandMetrics)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-transform"
          >
            {expandMetrics ? '▼' : '▶'}
          </button>
          <h2 className="text-base font-bold text-gray-900">📈 Métricas Principais</h2>
        </div>
        {expandMetrics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              <TripleWhaleKPI
                label="Receita"
                value={`€${(kpis.totalRevenue / 1000).toFixed(2)}`}
                unit="k"
                previousValue={prevRevenue}
                sparklineData={MOCK_SPARKLINE_DATA.revenue}
                change={kpis.revenueTrend}
                color="green"
                icon="💰"
              />

              <TripleWhaleKPI
                label="Pedidos"
                value={kpis.totalOrders}
                previousValue={prevOrders}
                sparklineData={MOCK_SPARKLINE_DATA.orders}
                change={kpis.ordersTrend}
                color="blue"
                icon="📦"
              />

              <TripleWhaleKPI
                label="Valor Médio (AOV)"
                value={`€${kpis.aov.toFixed(2)}`}
                previousValue={prevAOV}
                sparklineData={MOCK_SPARKLINE_DATA.aov}
                change={kpis.aoVTrend}
                color="purple"
                icon="💵"
              />

              <TripleWhaleKPI
                label="ROAS"
                value={kpis.roas.toFixed(2)}
                unit="x"
                previousValue={prevROAS}
                sparklineData={MOCK_SPARKLINE_DATA.roas}
                change={kpis.roasTrend}
                color="orange"
                icon="📈"
              />
            </div>

            {/* Secondary KPIs - Segunda linha */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
              <TripleWhaleKPI
                label="Custo Total"
                value={`€${kpis.totalSpend.toFixed(0)}`}
                previousValue={prevSpend}
                sparklineData={MOCK_SPARKLINE_DATA.spend}
                change={kpis.spendTrend}
                color="pink"
                icon="💳"
              />

              <TripleWhaleKPI
                label="Custo por Compra (CPA)"
                value={`€${kpis.cpa.toFixed(2)}`}
                previousValue={prevCPA}
                sparklineData={MOCK_SPARKLINE_DATA.cpa}
                change={-kpis.cpaTrend}
                color="blue"
                icon="🎯"
              />

              <TripleWhaleKPI
                label="Taxa de Conversão"
                value={kpis.conversionRate.toFixed(2)}
                unit="%"
                previousValue={prevConversionRate}
                sparklineData={MOCK_SPARKLINE_DATA.conversionRate}
                change={kpis.conversionRateTrend}
                color="green"
                icon="✅"
              />

              <CustomerReturnRateKPI
                returnRate={shopifyMetrics.customerReturnRate}
                returningCustomers={shopifyMetrics.uniqueReturningCustomers}
                totalCustomers={shopifyMetrics.uniqueCustomers}
                isLoading={isLoadingPeriod}
                icon="🔄"
                sparklineData={MOCK_SPARKLINE_DATA.customerReturnRate}
                change={customerReturnRateTrend}
                previousValue={prevCustomerReturnRate}
              />
            </div>
          </>
        )}

        {/* Performance Heatmap */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setExpandHeatmap(!expandHeatmap)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-transform"
            >
              {expandHeatmap ? '▼' : '▶'}
            </button>
            <h3 className="text-base font-bold text-gray-900">🔥 Padrões de Performance (Dia da Semana)</h3>
          </div>
          {expandHeatmap && <PerformanceHeatmap data={MOCK_HEATMAP} />}
        </div>

        {/* Recent Changes */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setExpandRecentChanges(!expandRecentChanges)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-transform"
            >
              {expandRecentChanges ? '▼' : '▶'}
            </button>
            <h3 className="text-base font-bold text-gray-900">📋 Mudanças Recentes</h3>
          </div>
          {expandRecentChanges && <RecentChanges changes={MOCK_RECENT_CHANGES} />}
        </div>

        {/* Performance por Plataforma */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setExpandPlatformTable(!expandPlatformTable)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-transform"
            >
              {expandPlatformTable ? '▼' : '▶'}
            </button>
            <h2 className="text-base font-bold text-gray-900">
              📊 {selectedPlatforms.length === availablePlatforms.length ? 'Performance por Plataforma' : 'Performance - Plataformas Selecionadas'}
            </h2>
          </div>
          {expandPlatformTable && <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <PlatformPerformanceTable data={filteredData} />
          </div>}
        </div>

        {/* Charts Section - Com Recharts (100% Grátis) */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setExpandCharts(!expandCharts)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-transform"
            >
              {expandCharts ? '▼' : '▶'}
            </button>
            <h3 className="text-base font-bold text-gray-900">📈 Gráficos de Performance</h3>
          </div>
          {expandCharts && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart />
            <OrdersChart />
          </div>}
        </div>

        {/* ROAS by Platform */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setExpandROAS(!expandROAS)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-transform"
            >
              {expandROAS ? '▼' : '▶'}
            </button>
            <h3 className="text-base font-bold text-gray-900">💹 ROAS por Fonte de Aquisição</h3>
          </div>
          {expandROAS && <PlatformROASChart
            data={(filteredData.length > 0 ? filteredData : platformDataArray).map((p) => ({
              platform: getPlatformLabel(p.platform),
              roas: p.roas,
              spend: p.spend,
              revenue: p.revenue,
            }))}
            previousData={[
              { platform: 'Google Ads', roas: 4.0, spend: 1700, revenue: 6800 },
              { platform: 'Meta Ads', roas: 3.2, spend: 1200, revenue: 3840 },
              { platform: 'TikTok Ads', roas: 4.5, spend: 400, revenue: 1800 },
              { platform: 'Pinterest', roas: 1.2, spend: 300, revenue: 360 },
            ]}
          />}
        </div>

        {/* Platform Comparison */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setExpandComparison(!expandComparison)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-transform"
            >
              {expandComparison ? '▼' : '▶'}
            </button>
            <h3 className="text-base font-bold text-gray-900">⚖️ Comparação de Fontes de Aquisição</h3>
          </div>
          {expandComparison && <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {filteredData.map((platform) => {
              return (
                <div key={platform.platform} className="p-4 border border-gray-200 rounded-xl">
                  <p className="text-sm text-gray-600 mb-3 font-medium">{getPlatformLabel(platform.platform)}</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Gasto</p>
                      <p className="text-2xl font-bold text-gray-900">
                        €{platform.spend.toLocaleString('pt-PT', { minimumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Receita</p>
                      <p className="text-2xl font-bold text-green-600">
                        €{platform.revenue.toLocaleString('pt-PT', { minimumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">ROAS</p>
                      <p className={`text-xl font-bold ${platform.roas >= 2 ? 'text-green-600' : platform.roas > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                        {platform.roas.toFixed(2)}x
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>}
        </div>

        {/* Sales Sources */}
        <div className="mt-8">
          <SalesSources period={selectedPeriod} selectedSources={selectedSources} />
        </div>
      </div>
    </>
  )
}
