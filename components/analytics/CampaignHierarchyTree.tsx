'use client'

/**
 * Campaign Hierarchy Tree - Meta Ads Drilldown
 * Expandable tree view: Campaigns → Ad Sets → Creatives
 * Shows metrics at each level with thumbnails for creatives
 */

import { useState } from 'react'

interface AdNode {
  id: string
  name: string
  status: string
  thumbnail?: string
  spend: number
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  revenue: number
  roas: number
  cpa: number
}

interface AdsetNode {
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
  ads: AdNode[]
}

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
  adsets: AdsetNode[]
}

interface CampaignHierarchyTreeProps {
  campaigns: CampaignNode[] | null
  isLoading: boolean
  error: string | null
}

function getStatusColor(status: string): string {
  const statusUpper = status?.toUpperCase()
  if (statusUpper === 'ACTIVE') return '🟢'
  if (statusUpper === 'PAUSED') return '🟡'
  if (statusUpper === 'ARCHIVED') return '⚪'
  return '🔵'
}

function getStatusBg(status: string): string {
  const statusUpper = status?.toUpperCase()
  if (statusUpper === 'ACTIVE') return 'bg-green-100 text-green-800'
  if (statusUpper === 'PAUSED') return 'bg-yellow-100 text-yellow-800'
  if (statusUpper === 'ARCHIVED') return 'bg-gray-100 text-gray-800'
  return 'bg-blue-100 text-blue-800'
}

function MetricsRow({ node, compact = false }: { node: AdNode | AdsetNode | CampaignNode; compact?: boolean }) {
  if (compact) {
    return (
      <div className="grid grid-cols-6 gap-3 text-xs text-gray-600 mt-1">
        <span className="font-medium">
          💰 <span className="text-gray-900">€{(node.spend).toFixed(0)}</span>
        </span>
        <span className="font-medium">
          📊 <span className="text-green-700">€{(node.revenue).toFixed(0)}</span>
        </span>
        <span className={`font-semibold ${node.roas >= 2 ? 'text-green-700' : node.roas >= 1 ? 'text-yellow-700' : 'text-red-700'}`}>
          📈 {node.roas.toFixed(2)}x
        </span>
        <span className="font-medium">
          ✅ <span className="text-gray-900">{node.conversions}</span>
        </span>
        <span className="font-medium">
          👁 <span className="text-gray-900">{(node.impressions).toLocaleString()}</span>
        </span>
        <span className="font-medium">
          🖱 <span className="text-gray-900">{(node.clicks).toLocaleString()}</span>
        </span>
      </div>
    )
  }

  return (
    <div className="flex gap-4 text-xs text-gray-600 mt-1 ml-4">
      <span>💰 €{node.spend.toFixed(0)}</span>
      <span>📊 €{node.revenue.toFixed(0)}</span>
      <span>📈 {node.roas.toFixed(2)}x ROAS</span>
      <span>✅ {node.conversions} conv</span>
      <span>👁 {node.impressions.toLocaleString()}</span>
      <span>🖱 {node.clicks.toLocaleString()}</span>
    </div>
  )
}

function CreativeItem({ ad }: { ad: AdNode }) {
  return (
    <div className="ml-6 mb-2 p-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        {ad.thumbnail && (
          <div className="flex-shrink-0">
            <img
              src={ad.thumbnail}
              alt={ad.name}
              className="w-16 h-16 object-cover rounded border border-orange-200"
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{getStatusColor(ad.status)}</span>
            <span className="font-medium text-gray-900 truncate">{ad.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap ${getStatusBg(ad.status)}`}>
              {ad.status?.toUpperCase()}
            </span>
          </div>
          <MetricsRow node={ad} compact />
        </div>
      </div>
    </div>
  )
}

function AdsetItem({
  adset,
}: {
  adset: AdsetNode
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="ml-4 my-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left py-3 px-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg hover:shadow-sm transition-all"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base font-semibold text-red-700 w-5">{isExpanded ? '▼' : '▶'}</span>
          <span className="text-lg">{getStatusColor(adset.status)}</span>
          <span className="font-bold text-gray-900 flex-1 truncate">{adset.name}</span>
          <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusBg(adset.status)}`}>
            {adset.status?.toUpperCase()}
          </span>
          <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded">
            {adset.ads.length} criativo{adset.ads.length !== 1 ? 's' : ''}
          </span>
        </div>
        <MetricsRow node={adset} />
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2">
          {adset.ads.length > 0 ? (
            adset.ads.map((ad) => (
              <CreativeItem key={ad.id} ad={ad} />
            ))
          ) : (
            <div className="ml-6 py-3 text-xs text-gray-500 italic text-center">
              Sem criativos neste ad set
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CampaignItem({ campaign }: { campaign: CampaignNode }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border border-blue-300 rounded-lg p-4 mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left py-3 px-4 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-lg hover:shadow-sm transition-all"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base font-bold text-blue-700 w-5">{isExpanded ? '▼' : '▶'}</span>
          <span className="text-lg">{getStatusColor(campaign.status)}</span>
          <span className="font-bold text-gray-900 flex-1 truncate text-lg">{campaign.name}</span>
          <span className={`text-xs px-2 py-1 rounded font-bold ${getStatusBg(campaign.status)}`}>
            {campaign.status?.toUpperCase()}
          </span>
          <span className="text-xs font-bold text-blue-700 bg-blue-200 px-2 py-1 rounded">
            {campaign.adsets.length} ad set{campaign.adsets.length !== 1 ? 's' : ''}
          </span>
        </div>
        <MetricsRow node={campaign} />
      </button>

      {isExpanded && (
        <div className="mt-4">
          {campaign.adsets.length > 0 ? (
            campaign.adsets.map((adset) => (
              <AdsetItem key={adset.id} adset={adset} />
            ))
          ) : (
            <div className="ml-4 py-3 text-xs text-gray-500 italic text-center">
              Sem ad sets nesta campanha
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function CampaignHierarchyTree({
  campaigns,
  isLoading,
  error,
}: CampaignHierarchyTreeProps) {
  if (error) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4">
        <p className="text-sm font-semibold text-red-900">❌ Erro ao carregar campanhas</p>
        <p className="text-sm text-red-800 mt-2">{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">📊 Performance de Campanhas</h3>
          <p className="text-sm text-gray-600 mt-1">
            Campanha → Ad Sets → Criativos (com drilldown)
          </p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-blue-200 rounded-lg p-4 bg-blue-50 animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">📊 Performance de Campanhas</h3>
          <p className="text-sm text-gray-600 mt-1">
            Meta Ads: Campanha → Ad Sets → Criativos
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-base text-gray-500">📭 Nenhuma campanha com dados para este período</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-gray-900">📊 Performance de Campanhas (Meta Ads)</h3>
        <p className="text-sm text-gray-600 mt-1">
          Clique em uma campanha para expandir e ver ad sets e criativos
        </p>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-lg">💰</span>
          <span className="text-gray-700 font-medium">Gasto</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <span className="text-gray-700 font-medium">Receita</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">📈</span>
          <span className="text-gray-700 font-medium">ROAS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">✅</span>
          <span className="text-gray-700 font-medium">Conv.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">👁</span>
          <span className="text-gray-700 font-medium">Impress.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🖱</span>
          <span className="text-gray-700 font-medium">Cliques</span>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap gap-3 text-xs p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2">
          <span className="text-lg">🟢</span>
          <span className="text-gray-700">Ativo</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🟡</span>
          <span className="text-gray-700">Pausado</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">⚪</span>
          <span className="text-gray-700">Arquivado</span>
        </div>
      </div>

      {/* Campaigns Tree */}
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <CampaignItem key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  )
}
