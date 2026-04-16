'use client'

import { useState, useEffect, Fragment } from 'react'
import { DateFilter } from '@/components/dashboard'
import { SourceSelector } from './SourceSelector'
import type { PlatformKPIs } from '@/types'

interface CampaignNode {
  id: string
  name: string
  status: string
  spend: number
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  revenue: number
  roas: number
  cpa: number
  adsets: any[]
}

interface AnalyticsClientProps {
  kpisByPlatform?: Record<string, PlatformKPIs>
  isMock: boolean
}

function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    'google-ads': 'Google Ads',
    'meta-ads': 'Meta Ads',
    'tiktok-ads': 'TikTok Ads',
    pinterest: 'Pinterest',
    organic: 'Orgânico',
  }
  return labels[platform] || platform
}

// Calcular métricas adicionais
function enrichCampaignMetrics(campaign: CampaignNode) {
  const aov = campaign.conversions > 0 ? campaign.revenue / campaign.conversions : 0
  const profit = campaign.revenue - campaign.spend
  const cpm = campaign.impressions > 0 ? (campaign.spend / campaign.impressions) * 1000 : 0
  const conversionRate = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0

  return {
    ...campaign,
    aov: Math.round(aov * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    cpm: Math.round(cpm * 100) / 100,
    conversionRate: Math.round(conversionRate * 100) / 100,
  }
}

// Ordenar campanhas
function sortCampaigns(campaigns: any[], column: string, direction: 'asc' | 'desc') {
  return [...campaigns].sort((a, b) => {
    let aVal = a[column]
    let bVal = b[column]
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

// Cor baseada em performance
function getPerformanceColor(value: number, metric: string): string {
  if (metric === 'roas') {
    if (value >= 3) return 'text-green-700 font-semibold'
    if (value >= 2) return 'text-green-600'
    if (value >= 1) return 'text-yellow-600'
    return 'text-red-600'
  }
  if (metric === 'cpa' || metric === 'cpm') {
    if (value < 20) return 'text-green-600'
    if (value < 50) return 'text-yellow-600'
    return 'text-red-600'
  }
  if (metric === 'profit') {
    if (value > 0) return 'text-green-600 font-semibold'
    return 'text-red-600'
  }
  return 'text-gray-700'
}

// Tabela de campanhas & ad sets ao estilo Meta Ads Manager
function CampaignsTable({ campaigns }: { campaigns: any[] }) {
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set())
  const [expandAll, setExpandAll] = useState(false)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  let activeCampaigns = campaigns
    .filter((c) => c.spend > 0 && c.status?.toUpperCase() === 'ACTIVE')
    .map(enrichCampaignMetrics)

  // Aplicar ordenação
  if (sortKey) {
    activeCampaigns = [...activeCampaigns].sort((a, b) => {
      const aVal = a[sortKey as keyof typeof a]
      const bVal = b[sortKey as keyof typeof b]

      if (typeof aVal !== 'number' || typeof bVal !== 'number') return 0

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    })
  }

  if (activeCampaigns.length === 0) return null

  const dataColumns = [
    { key: 'spend', label: 'Gasto', width: '85px' },
    { key: 'impressions', label: 'Impr.', width: '85px' },
    { key: 'cpm', label: 'CPM', width: '75px' },
    { key: 'clicks', label: 'Cliques', width: '85px' },
    { key: 'ctr', label: 'CTR%', width: '75px' },
    { key: 'conversions', label: 'Conv', width: '75px' },
    { key: 'conversionRate', label: 'Conv%', width: '75px' },
    { key: 'revenue', label: 'Receita', width: '85px' },
    { key: 'profit', label: 'Lucro', width: '85px' },
    { key: 'roas', label: 'ROAS', width: '75px' },
    { key: 'cpa', label: 'CPA', width: '75px' },
    { key: 'aov', label: 'AOV', width: '75px' },
  ]

  const handleSort = (key: string) => {
    if (sortKey === key) {
      // Se já está ordenado por esta coluna, inverte direção
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Nova coluna, começa com desc
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const formatValue = (value: number, key: string) => {
    if (key === 'ctr' || key === 'conversionRate') return `${value.toFixed(2)}%`
    if (key === 'roas') return `${value.toFixed(2)}x`
    if (key === 'impressions' || key === 'clicks' || key === 'conversions') return value.toLocaleString()
    if (['spend', 'revenue', 'profit', 'cpa', 'cpm', 'aov'].includes(key)) return `€${value.toFixed(0)}`
    return value.toFixed(2)
  }

  const toggleCampaign = (campaignId: string) => {
    const newExpanded = new Set(expandedCampaigns)
    if (newExpanded.has(campaignId)) {
      newExpanded.delete(campaignId)
    } else {
      newExpanded.add(campaignId)
    }
    setExpandedCampaigns(newExpanded)
  }

  const toggleExpandAll = () => {
    if (expandAll) {
      setExpandedCampaigns(new Set())
      setExpandAll(false)
    } else {
      const allIds = new Set(activeCampaigns.map((c) => c.id))
      setExpandedCampaigns(allIds)
      setExpandAll(true)
    }
  }

  const isCampaignExpanded = (campaignId: string) => expandedCampaigns.has(campaignId)

  return (
    <div className="space-y-4">
      {/* Expandir/Colapsar Tudo */}
      <div className="flex justify-end">
        <button
          onClick={toggleExpandAll}
          className="px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 rounded transition"
        >
          {expandAll ? '↑ Colapsar Tudo' : '↓ Expandir Tudo'}
        </button>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse bg-white">
          <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-300 px-2 py-3 text-left font-bold text-gray-800" style={{ minWidth: '24px' }}></th>
              <th className="border border-gray-300 px-3 py-3 text-left font-bold text-gray-800 whitespace-nowrap" style={{ minWidth: '220px' }}>Campanha / Ad Set</th>
              {dataColumns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="border border-gray-300 px-3 py-3 text-right font-bold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-blue-200 transition"
                  style={{ minWidth: col.width }}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>{col.label}</span>
                    {sortKey === col.key && (
                      <span className="text-blue-600 font-bold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeCampaigns.map((campaign) => (
              <Fragment key={campaign.id}>
                {/* Campaign Row - Bold with Expand/Collapse */}
                <tr
                  className="bg-blue-50 border-b-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition"
                  onClick={() => toggleCampaign(campaign.id)}
                >
                  <td className="border border-gray-300 px-2 py-2 text-center font-bold text-blue-700 w-6">
                    {isCampaignExpanded(campaign.id) ? '▼' : '▶'}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 font-bold text-gray-900">
                    📌 {campaign.name}
                  </td>
                  {dataColumns.map((col) => {
                    const value = campaign[col.key as keyof typeof campaign]
                    return (
                      <td
                        key={col.key}
                        className={`border border-gray-300 px-3 py-2 text-right font-bold ${
                          (col.key === 'roas' || col.key === 'profit') && typeof value === 'number'
                            ? getPerformanceColor(value, col.key)
                            : 'text-gray-900'
                        }`}
                      >
                        {typeof value === 'number' ? formatValue(value, col.key) : '—'}
                      </td>
                    )
                  })}
                </tr>

                {/* Ad Sets Rows - Conditional Rendering */}
                {isCampaignExpanded(campaign.id) && campaign.adsets && campaign.adsets.length > 0 && campaign.adsets.map((adset: any) => {
                  const adsetEnriched = enrichCampaignMetrics(adset)
                  return (
                    <tr key={adset.id} className="bg-white hover:bg-gray-50 border-b border-gray-200">
                      <td className="border border-gray-300 px-2 py-2"></td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-700">
                        <span className="text-blue-600">↳</span> {adset.name}
                      </td>
                      {dataColumns.map((col) => {
                        const value = adsetEnriched[col.key as keyof typeof adsetEnriched]
                        return (
                          <td
                            key={col.key}
                            className={`border border-gray-300 px-3 py-2 text-right text-gray-600 ${
                              (col.key === 'roas' || col.key === 'profit') && typeof value === 'number'
                                ? getPerformanceColor(value, col.key)
                                : ''
                            }`}
                          >
                            {typeof value === 'number' ? formatValue(value, col.key) : '—'}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Componente da árvore de campanhas expandível
function CampaignTreeNode({ campaign }: { campaign: any }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [objective, setObjective] = useState<string>(campaign.objective || '')
  const [isEditingObjective, setIsEditingObjective] = useState(false)

  return (
    <div className="border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
      {/* Campaign Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left px-4 py-3 hover:bg-blue-100 transition flex items-center justify-between"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-base font-bold text-blue-700 w-5">{isExpanded ? '▼' : '▶'}</span>
          <span className="text-lg">📌</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 truncate">{campaign.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 ml-4 flex-shrink-0">
          <div className="text-right">
            <p className="text-xs text-gray-500">Gasto</p>
            <p className="font-bold text-gray-900">€{campaign.spend.toFixed(0)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Receita</p>
            <p className="font-bold text-green-600">€{campaign.revenue.toFixed(0)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">ROAS</p>
            <p className={`font-bold ${getPerformanceColor(campaign.roas, 'roas')}`}>
              {campaign.roas.toFixed(2)}x
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Conversões</p>
            <p className="font-bold text-gray-900">{campaign.conversions}</p>
          </div>
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-blue-200 bg-white p-4 space-y-4">
          {/* Campaign Objective */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold text-purple-700 uppercase mb-2">🎯 Objetivo da Campanha</p>
                {isEditingObjective ? (
                  <textarea
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="Descreve o objetivo principal desta campanha (ex: aumentar marca, gerar leads, conversões diretas)..."
                    className="w-full px-3 py-2 border border-purple-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={2}
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {objective || <span className="text-gray-500 italic">Clica para adicionar objetivo...</span>}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsEditingObjective(!isEditingObjective)}
                className="ml-3 px-3 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100 rounded transition flex-shrink-0"
              >
                {isEditingObjective ? '✅ Pronto' : '✏️ Editar'}
              </button>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-gray-600 font-semibold">💰 Gasto</p>
              <p className="text-lg font-bold text-gray-900">€{campaign.spend.toFixed(0)}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-gray-600 font-semibold">👁 Impressões</p>
              <p className="text-lg font-bold text-gray-900">{campaign.impressions.toLocaleString()}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-gray-600 font-semibold">📌 CPM</p>
              <p className="text-lg font-bold text-gray-900">€{campaign.cpm.toFixed(2)}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-gray-600 font-semibold">🖱 Cliques</p>
              <p className="text-lg font-bold text-gray-900">{campaign.clicks.toLocaleString()}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-gray-600 font-semibold">📊 CTR</p>
              <p className="text-lg font-bold text-gray-900">{campaign.ctr.toFixed(2)}%</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-gray-600 font-semibold">✅ Conversões</p>
              <p className="text-lg font-bold text-gray-900">{campaign.conversions}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-gray-600 font-semibold">📈 Conv%</p>
              <p className="text-lg font-bold text-green-700">{campaign.conversionRate.toFixed(2)}%</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-gray-600 font-semibold">💵 Receita</p>
              <p className="text-lg font-bold text-green-700">€{campaign.revenue.toFixed(0)}</p>
            </div>
            <div className={`p-3 rounded-lg ${campaign.profit > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-gray-600 font-semibold">💚 Lucro</p>
              <p className={`text-lg font-bold ${campaign.profit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                €{campaign.profit.toFixed(0)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${getPerformanceColor(campaign.roas, 'roas').includes('green') ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <p className="text-gray-600 font-semibold">📊 ROAS</p>
              <p className={`text-lg font-bold ${getPerformanceColor(campaign.roas, 'roas')}`}>
                {campaign.roas.toFixed(2)}x
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-gray-600 font-semibold">💳 CPA</p>
              <p className={`text-lg font-bold ${getPerformanceColor(campaign.cpa, 'cpa')}`}>
                €{campaign.cpa.toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-gray-600 font-semibold">🛒 AOV</p>
              <p className="text-lg font-bold text-gray-900">€{campaign.aov.toFixed(2)}</p>
            </div>
          </div>

          {/* Ad Sets List */}
          {campaign.adsets && campaign.adsets.length > 0 && (
            <div className="border-t border-gray-200 pt-3 mt-3">
              <p className="text-sm font-bold text-gray-700 mb-2">📌 Ad Sets ({campaign.adsets.length})</p>
              <div className="space-y-2 ml-4">
                {campaign.adsets.map((adset: any) => (
                  <div key={adset.id} className="text-xs bg-red-50 p-2 rounded border border-red-200">
                    <p className="font-semibold text-gray-800">{adset.name}</p>
                    <p className="text-gray-600">
                      💰 €{adset.spend.toFixed(0)} | 👁 {adset.impressions.toLocaleString()} | 📊 {adset.roas.toFixed(2)}x ROAS | ✅ {adset.conversions}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function AnalyticsClient({ kpisByPlatform = {}, isMock }: AnalyticsClientProps) {
  const ALL_PLATFORMS = ['google-ads', 'meta-ads', 'tiktok-ads', 'pinterest', 'organic']
  const availablePlatforms = ALL_PLATFORMS

  const [selectedPlatform, setSelectedPlatform] = useState<string>('meta-ads')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('last7')
  const [customDateRange, setCustomDateRange] = useState<{ start?: string; end?: string }>({})
  const [campaigns, setCampaigns] = useState<CampaignNode[] | null>(null)
  const [campaignsLoading, setCampaignsLoading] = useState(false)
  const [campaignsError, setCampaignsError] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string>('spend')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [expandInsights, setExpandInsights] = useState(false)

  // Fetch campaigns when period changes
  useEffect(() => {
    const fetchCampaigns = async () => {
      setCampaignsLoading(true)
      setCampaignsError(null)
      try {
        let url = `/api/meta-ads/campaigns?period=${selectedPeriod}`
        if (selectedPeriod === 'custom' && customDateRange.start && customDateRange.end) {
          url += `&startDate=${customDateRange.start}&endDate=${customDateRange.end}`
        }

        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setCampaigns(data.campaigns || null)
        } else if (response.status === 503) {
          setCampaignsError('Meta Ads not configured. Please set credentials.')
          setCampaigns(null)
        } else {
          const data = await response.json()
          setCampaignsError(data.message || 'Failed to fetch campaigns')
          setCampaigns(null)
        }
      } catch (error) {
        setCampaignsError(error instanceof Error ? error.message : 'Unknown error')
        setCampaigns(null)
      } finally {
        setCampaignsLoading(false)
      }
    }

    fetchCampaigns()
  }, [selectedPeriod, customDateRange])

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Insights & Watchouts - MOVED TO TOP */}
      {campaigns && campaigns.length > 0 && (() => {
        const activeCampaigns = campaigns
          .filter((c) => c.spend > 0 && c.status?.toUpperCase() === 'ACTIVE')
          .map(enrichCampaignMetrics)

        if (activeCampaigns.length === 0) return null

        const totalSpend = activeCampaigns.reduce((sum, c) => sum + c.spend, 0)
        const totalRevenue = activeCampaigns.reduce((sum, c) => sum + c.revenue, 0)
        const totalConversions = activeCampaigns.reduce((sum, c) => sum + c.conversions, 0)
        const aggregateRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0
        const aggregateAov = totalConversions > 0 ? totalRevenue / totalConversions : 0

        const insights: { type: 'watchout' | 'bestpractice' | 'goldenrule'; icon: string; title: string; description: string }[] = []

        // WATCHOUTS
        const losingMoneyCampaigns = activeCampaigns.filter((c) => c.roas < 1)
        if (losingMoneyCampaigns.length > 0) {
          insights.push({
            type: 'watchout',
            icon: '🚨',
            title: `${losingMoneyCampaigns.length} campanha(s) com ROAS < 1x`,
            description: `${losingMoneyCampaigns.map((c) => c.name).join(', ')} estão perdendo dinheiro. Pausar ou otimizar urgentemente.`,
          })
        }

        const lowCtrCampaigns = activeCampaigns.filter((c) => c.ctr < 0.5 && c.impressions > 1000)
        if (lowCtrCampaigns.length > 0) {
          insights.push({
            type: 'watchout',
            icon: '⚠️',
            title: `CTR muito baixo (<0.5%) em ${lowCtrCampaigns.length} campanha(s)`,
            description: 'Anúncios não atraem cliques. Revisar creative, targeting ou copy.',
          })
        }

        const highCpaCampaigns = activeCampaigns.filter((c) => c.cpa > aggregateAov * 0.7)
        if (highCpaCampaigns.length > 0) {
          insights.push({
            type: 'watchout',
            icon: '💸',
            title: `CPA muito alto em ${highCpaCampaigns.length} campanha(s)`,
            description: `CPA perto ou acima de 70% do AOV. Lucro marginal - otimizar conversões.`,
          })
        }

        const concentration = (activeCampaigns.reduce((max, c) => Math.max(max, c.spend / totalSpend), 0)) * 100
        if (concentration > 80) {
          insights.push({
            type: 'watchout',
            icon: '⚡',
            title: 'Concentração de orçamento muito alta',
            description: `Uma campanha consome ${concentration.toFixed(0)}% do orçamento. Risco elevado - diversificar.`,
          })
        }

        // BEST PRACTICES
        const excellentRoasCampaigns = activeCampaigns.filter((c) => c.roas > 3)
        if (excellentRoasCampaigns.length > 0) {
          insights.push({
            type: 'bestpractice',
            icon: '⭐',
            title: `${excellentRoasCampaigns.length} campanha(s) com ROAS > 3x (excelente!)`,
            description: `${excellentRoasCampaigns.map((c) => c.name).join(', ')} estão super performando. Considerar scaling de 10-20%.`,
          })
        }

        const goodCtrCampaigns = activeCampaigns.filter((c) => c.ctr > 2)
        if (goodCtrCampaigns.length > 0) {
          insights.push({
            type: 'bestpractice',
            icon: '✅',
            title: `${goodCtrCampaigns.length} campanha(s) com CTR > 2% (muito bom!)`,
            description: 'Anúncios estão atraindo bem. Usar como baseline para outras campanhas.',
          })
        }

        const goodConversionCampaigns = activeCampaigns.filter((c) => c.conversionRate > 5)
        if (goodConversionCampaigns.length > 0) {
          insights.push({
            type: 'bestpractice',
            icon: '🎯',
            title: `${goodConversionCampaigns.length} campanha(s) com Conversion Rate > 5%`,
            description: 'Excelente aproveitamento de tráfego. Analisar targeting/landing page.',
          })
        }

        const diverseCampaigns = activeCampaigns.filter((c) => c.adsets && c.adsets.length > 3)
        if (diverseCampaigns.length > 0) {
          insights.push({
            type: 'bestpractice',
            icon: '🎨',
            title: `${diverseCampaigns.length} campanha(s) com >3 ad sets (boa diversificação)`,
            description: 'Teste de creatives bem estruturado. Continuar A/B testing.',
          })
        }

        // GOLDEN RULES
        if (aggregateRoas < 2) {
          insights.push({
            type: 'goldenrule',
            icon: '🏆',
            title: 'ROAS deve ser mínimo 2x para breakeven',
            description: `ROAS atual: ${aggregateRoas.toFixed(2)}x. Abaixo de 2x significa margem muito fina ou prejuízo.`,
          })
        }

        if (activeCampaigns.some((c) => c.spend > totalSpend * 0.2 && c.roas < 1.5)) {
          insights.push({
            type: 'goldenrule',
            icon: '🛑',
            title: 'Pausar underperformers rapidamente',
            description: 'Campanhas com spend alto mas ROAS <1.5x devem ser pausadas para análise em 48h.',
          })
        }

        if (activeCampaigns.some((c) => !c.adsets || c.adsets.length < 2)) {
          insights.push({
            type: 'goldenrule',
            icon: '🧪',
            title: 'Sempre testar múltiplos creatives (A/B testing obrigatório)',
            description: 'Cada ad set deve ter pelo menos 2-3 creatives diferentes. Testar copy, imagem, CTA.',
          })
        }

        if (activeCampaigns.length < 3) {
          insights.push({
            type: 'goldenrule',
            icon: '📊',
            title: 'Diversificar em múltiplas campanhas',
            description: 'Ter apenas 1-2 campanhas é arriscado. Objetivo: 3-5 campanhas ativas simultâneamente.',
          })
        }

        return (
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Insights & Recomendações</h3>
            <div className="space-y-3">
              {insights.slice(0, expandInsights ? 5 : 3).map((insight, idx) => {
                const bgColor = insight.type === 'watchout' ? 'bg-red-50 border-red-200' : insight.type === 'bestpractice' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
                const textColor = insight.type === 'watchout' ? 'text-red-900' : insight.type === 'bestpractice' ? 'text-green-900' : 'text-blue-900'
                const label = insight.type === 'watchout' ? '⚠️ WATCHOUT' : insight.type === 'bestpractice' ? '✅ BEST PRACTICE' : '🏆 GOLDEN RULE'
                const isBlurred = !expandInsights && idx === 2

                return (
                  <div key={idx} className={`border rounded-lg p-3 ${bgColor} ${isBlurred ? 'opacity-50' : ''}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{insight.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold ${textColor} mb-1`}>{label}</p>
                        <p className={`font-semibold text-sm ${textColor}`}>{insight.title}</p>
                        <p className={`text-xs ${textColor} opacity-80 mt-1`}>{insight.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}

              {insights.length > 3 && !expandInsights && (
                <button
                  onClick={() => setExpandInsights(true)}
                  className="w-full mt-3 py-2 text-sm font-semibold text-amber-700 hover:text-amber-900 transition"
                >
                  ↓ Ver tudo
                </button>
              )}

              {expandInsights && insights.length > 3 && (
                <button
                  onClick={() => setExpandInsights(false)}
                  className="w-full mt-3 py-2 text-sm font-semibold text-amber-700 hover:text-amber-900 transition"
                >
                  ↑ Ver menos
                </button>
              )}

              {insights.length === 0 && (
                <div className="text-center py-4 text-gray-600">
                  <p className="text-sm">✨ Tudo a correr bem! Nenhuma recomendação urgente no momento.</p>
                </div>
              )}
            </div>
          </div>
        )
      })()}

      {/* Header - Same style as DashboardClient */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">📊 Análise Detalhada</h1>
      </div>

      {/* Filters - Same style as DashboardClient */}
      <div className="flex flex-col gap-3 py-4 px-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-200 rounded-lg">
        {/* Acquisition Source Selector - Dynamic from Shopify */}
        <SourceSelector
          selectedSource={selectedPlatform}
          onSourceChange={setSelectedPlatform}
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

      {/* Summary Metrics - Total Aggregated */}
      {campaigns && campaigns.length > 0 && (() => {
        const activeCampaigns = campaigns
          .filter((c) => c.spend > 0 && c.status?.toUpperCase() === 'ACTIVE')
          .map(enrichCampaignMetrics)

        if (activeCampaigns.length === 0) return null

        const totalSpend = activeCampaigns.reduce((sum, c) => sum + c.spend, 0)
        const totalRevenue = activeCampaigns.reduce((sum, c) => sum + c.revenue, 0)
        const totalConversions = activeCampaigns.reduce((sum, c) => sum + c.conversions, 0)
        const totalImpressions = activeCampaigns.reduce((sum, c) => sum + c.impressions, 0)
        const totalClicks = activeCampaigns.reduce((sum, c) => sum + c.clicks, 0)
        const totalProfit = totalRevenue - totalSpend
        const aggregateRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0
        const aggregateCpa = totalConversions > 0 ? totalSpend / totalConversions : 0
        const aggregateCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
        const aggregateAov = totalConversions > 0 ? totalRevenue / totalConversions : 0
        const aggregateCpm = totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0
        const aggregateConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

        return (
          <div className="rounded-2xl border border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">📈 Resumo Total de Campanhas</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">💰 Gasto Total</p>
                <p className="text-2xl font-bold text-gray-900">€{totalSpend.toFixed(0)}</p>
                <p className="text-xs text-gray-500 mt-1">{activeCampaigns.length} campanhas</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">💵 Receita Total</p>
                <p className="text-2xl font-bold text-green-700">€{totalRevenue.toFixed(0)}</p>
                <p className="text-xs text-gray-500 mt-1">{(totalRevenue / totalSpend).toFixed(2)}x do gasto</p>
              </div>

              <div className={`bg-white p-4 rounded-lg border shadow-sm ${aggregateRoas >= 3 ? 'border-green-200' : aggregateRoas >= 2 ? 'border-yellow-200' : 'border-red-200'}`}>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">📊 ROAS Total</p>
                <p className={`text-2xl font-bold ${aggregateRoas >= 3 ? 'text-green-700' : aggregateRoas >= 2 ? 'text-yellow-700' : 'text-red-700'}`}>
                  {aggregateRoas.toFixed(2)}x
                </p>
                <p className="text-xs text-gray-500 mt-1">Retorno/Investimento</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">✅ Conversões</p>
                <p className="text-2xl font-bold text-gray-900">{totalConversions}</p>
                <p className="text-xs text-gray-500 mt-1">{aggregateConversionRate.toFixed(2)}% de cliques</p>
              </div>

              <div className={`bg-white p-4 rounded-lg border shadow-sm ${totalProfit > 0 ? 'border-green-200' : 'border-red-200'}`}>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">💚 Lucro Total</p>
                <p className={`text-2xl font-bold ${totalProfit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  €{totalProfit.toFixed(0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{((totalProfit / totalSpend) * 100).toFixed(1)}% margem</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">💳 CPA Médio</p>
                <p className="text-2xl font-bold text-gray-900">€{aggregateCpa.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Custo por conversão</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">👁 Impressões</p>
                <p className="text-2xl font-bold text-gray-900">{totalImpressions.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Alcance total</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">🖱 Cliques</p>
                <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">CTR: {aggregateCtr.toFixed(2)}%</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">📌 CPM Médio</p>
                <p className="text-2xl font-bold text-gray-900">€{aggregateCpm.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Custo/1000 impr.</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">🛒 AOV Médio</p>
                <p className="text-2xl font-bold text-gray-900">€{aggregateAov.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Valor/compra</p>
              </div>
            </div>
          </div>
        )
      })()}


      {/* Performance Table - Active Campaigns with Spend (Meta Ads Manager Style) */}
      {campaigns && campaigns.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">📊 Performance de Campanhas</h3>
          {campaigns.filter((c) => c.spend > 0 && c.status?.toUpperCase() === 'ACTIVE').length > 0 ? (
            <CampaignsTable campaigns={campaigns} />
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>Nenhuma campanha ativa com gasto no período selecionado</p>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
