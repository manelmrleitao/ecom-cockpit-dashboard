'use client'

/**
 * Quick Suggestions Component
 * Top 3 principais insights priorizados + expansíveis
 * Mostra problemas críticos primeiro
 */

import { useState } from 'react'
import type { PlatformKPIs } from '@/types'

interface Insight {
  id: string
  icon: string
  title: string
  description: string
  type: 'alert' | 'warning' | 'neutral' | 'positive'
  priority: number // 1=crítico, 2=aviso, 3=neutro, 4=positivo
}

interface QuickSuggestionsProps {
  platformData: PlatformKPIs[]
  shopifyMetrics?: {
    customerReturnRate: number
    uniqueCustomers: number
    uniqueReturningCustomers: number
  }
}

function generateInsights(data: PlatformKPIs[], shopifyMetrics?: any): Insight[] {
  const insights: Insight[] = []

  if (data.length === 0) return insights

  const totalRevenue = data.reduce((sum, p) => sum + p.revenue, 0)
  const totalConversions = data.reduce((sum, p) => sum + p.conversions, 0)
  const paidPlatforms = data.filter(p => p.spend > 0 && p.platform !== 'organic')
  const organicData = data.filter(p => p.platform === 'organic')
  const totalSpend = paidPlatforms.reduce((sum, p) => sum + p.spend, 0)
  const globalRoas = totalSpend > 0 && totalRevenue > 0 ? totalRevenue / totalSpend : 0
  const globalAov = totalConversions > 0 ? totalRevenue / totalConversions : 0

  const platformLabels: Record<string, string> = {
    'google-ads': 'Google',
    'meta-ads': 'Meta',
    'tiktok-ads': 'TikTok',
    'pinterest': 'Pinterest',
  }

  // ===== PROBLEMAS CRÍTICOS (Prioridade 1) =====

  // CRÍTICO: Investimento a perder dinheiro (ROAS < 1 em plataforma específica)
  paidPlatforms.forEach(platform => {
    if (platform.spend > 0 && platform.roas < 1) {
      const label = platformLabels[platform.platform] || platform.platform
      insights.push({
        id: `losing-money-${platform.platform}`,
        icon: '🔴',
        title: `${label}: Perdendo dinheiro (ROAS ${platform.roas.toFixed(2)}x)`,
        description: `€${platform.spend.toFixed(0)} investido com retorno negativo. Pausar imediatamente.`,
        type: 'alert',
        priority: 1
      })
    }
  })

  // CRÍTICO: CPA acima do AOV (custo por compra maior que receita por compra)
  if (totalSpend > 0 && totalConversions > 0) {
    const globalCpa = totalSpend / totalConversions
    if (globalCpa > globalAov && globalAov > 0) {
      insights.push({
        id: 'cpa-above-aov',
        icon: '⛔',
        title: `CPA (€${globalCpa.toFixed(2)}) acima do ticket (€${globalAov.toFixed(2)})`,
        description: `Você está pagando mais por cliente que recebe em receita. Negócio insustentável.`,
        type: 'alert',
        priority: 1
      })
    }
  }

  // CRÍTICO: Gasto sem retorno (platform com spend > €50 e 0 conversões)
  paidPlatforms.forEach(platform => {
    if (platform.spend > 50 && platform.conversions === 0) {
      const label = platformLabels[platform.platform] || platform.platform
      insights.push({
        id: `no-conversions-${platform.platform}`,
        icon: '🚨',
        title: `${label}: €${platform.spend.toFixed(0)} sem conversões`,
        description: `Nenhuma venda com investimento significativo. Verificar targeting/creative urgentemente.`,
        type: 'alert',
        priority: 1
      })
    }
  })

  // ===== AVISOS (Prioridade 2) =====

  // AVISO: CTR muito baixo (< 0.5% com >1000 impressões)
  paidPlatforms.forEach(platform => {
    if (platform.impressions > 1000 && platform.ctr < 0.5) {
      const label = platformLabels[platform.platform] || platform.platform
      insights.push({
        id: `low-ctr-${platform.platform}`,
        icon: '⚠️',
        title: `${label}: CTR muito baixo (${platform.ctr.toFixed(2)}%)`,
        description: `${platform.impressions} impressões mas CTR < 0.5%. Anúncios não atraem clicks.`,
        type: 'warning',
        priority: 2
      })
    }
  })

  // AVISO: ROAS global entre 1-2 (abaixo do breakeven saudável)
  if (globalRoas > 1 && globalRoas < 2 && totalSpend > 0) {
    insights.push({
      id: 'low-global-roas',
      icon: '📉',
      title: `ROAS baixo (${globalRoas.toFixed(2)}x) - abaixo de 2x`,
      description: `Retorno marginal sobre gasto em publicidade. Otimize ou reduza investimento.`,
      type: 'warning',
      priority: 2
    })
  }

  // AVISO: Dependência alta (uma plataforma > 85% do spend)
  if (totalSpend > 0) {
    paidPlatforms.forEach(platform => {
      const concentration = (platform.spend / totalSpend) * 100
      if (concentration > 85) {
        const label = platformLabels[platform.platform] || platform.platform
        insights.push({
          id: `high-concentration-${platform.platform}`,
          icon: '⚠️',
          title: `${label}: ${concentration.toFixed(0)}% do orçamento`,
          description: `Risco alto. Diversifique para reduzir dependência de uma fonte.`,
          type: 'warning',
          priority: 2
        })
      }
    })
  }

  // AVISO: Taxa de retorno de clientes baixa (< 5%)
  if (shopifyMetrics && shopifyMetrics.customerReturnRate < 5 && shopifyMetrics.customerReturnRate > 0) {
    insights.push({
      id: 'low-return-rate',
      icon: '⚠️',
      title: `Retenção: ${shopifyMetrics.customerReturnRate.toFixed(1)}% (muito baixa)`,
      description: `${shopifyMetrics.uniqueReturningCustomers} de ${shopifyMetrics.uniqueCustomers} clientes retornam. Foco em repeat.`,
      type: 'warning',
      priority: 2
    })
  }

  // AVISO: AOV muito baixo (< €30)
  if (globalAov > 0 && globalAov < 30) {
    insights.push({
      id: 'low-aov',
      icon: '🏷️',
      title: `Ticket médio baixo: €${globalAov.toFixed(2)}`,
      description: `AOV < €30. Considere upsell, bundle ou aumentar preços.`,
      type: 'warning',
      priority: 2
    })
  }

  // ===== POSITIVOS E NEUTROS (Prioridade 3-4) =====

  // POSITIVO: Excelente ROAS global
  if (globalRoas > 4) {
    insights.push({
      id: 'excellent-global-roas',
      icon: '📈',
      title: `Excelente ROAS global (${globalRoas.toFixed(2)}x)`,
      description: `Publicidade muito eficiente. Considere escalar o investimento.`,
      type: 'positive',
      priority: 4
    })
  }

  // POSITIVO: Boa retenção de clientes
  if (shopifyMetrics && shopifyMetrics.customerReturnRate > 20) {
    insights.push({
      id: 'good-retention',
      icon: '💪',
      title: `Retenção forte: ${shopifyMetrics.customerReturnRate.toFixed(1)}%`,
      description: `${shopifyMetrics.uniqueReturningCustomers} clientes retornam. Excelente loyalty.`,
      type: 'positive',
      priority: 4
    })
  }

  // POSITIVO: ROI muito saudável (> 100%)
  if (totalSpend > 0 && totalRevenue > totalSpend) {
    const roi = ((totalRevenue - totalSpend) / totalSpend) * 100
    if (roi > 100) {
      insights.push({
        id: 'healthy-roi',
        icon: '💰',
        title: `ROI saudável: +${roi.toFixed(0)}%`,
        description: `Margem após publicidade muito boa. Negócio sustentável.`,
        type: 'positive',
        priority: 4
      })
    }
  }

  // POSITIVO: Receita total alta
  if (totalRevenue > 0) {
    insights.push({
      id: 'total-revenue',
      icon: '💵',
      title: `€${(totalRevenue / 1000).toFixed(1)}k em receita`,
      description: `${totalConversions} conversões. Ticket médio: €${globalAov.toFixed(2)}`,
      type: 'positive',
      priority: 4
    })
  }

  // POSITIVO: Melhor plataforma
  if (paidPlatforms.length > 0) {
    const bestPlatform = paidPlatforms.reduce((best, current) =>
      current.roas > best.roas ? current : best
    )
    const label = platformLabels[bestPlatform.platform] || bestPlatform.platform
    if (bestPlatform.roas > 0) {
      insights.push({
        id: 'best-platform',
        icon: '⭐',
        title: `${label}: ROAS ${bestPlatform.roas.toFixed(2)}x (melhor)`,
        description: `€${bestPlatform.spend.toFixed(0)} investido com ${bestPlatform.conversions} conversões`,
        type: bestPlatform.roas > 3 ? 'positive' : 'neutral',
        priority: bestPlatform.roas > 3 ? 4 : 3
      })
    }
  }

  // NEUTRO: Apenas tráfego orgânico
  if (paidPlatforms.length === 0 && organicData.length > 0 && organicData[0].revenue > 0) {
    insights.push({
      id: 'organic-only',
      icon: '🌱',
      title: 'Apenas tráfego orgânico ativo',
      description: `${organicData[0].conversions} pedidos via Shopify. Sem publicidade paga configurada.`,
      type: 'neutral',
      priority: 3
    })
  }

  // Ordenar por prioridade (1 = crítico primeiro, 4 = positivo último)
  insights.sort((a, b) => a.priority - b.priority)

  return insights
}

export function QuickSuggestions({ platformData, shopifyMetrics }: QuickSuggestionsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const allInsights = generateInsights(platformData, shopifyMetrics)
  const displayedInsights = isExpanded ? allInsights : allInsights.slice(0, 3)

  if (allInsights.length === 0) {
    return null
  }

  const alertCount = allInsights.filter((i) => i.type === 'alert').length
  const warningCount = allInsights.filter((i) => i.type === 'warning').length

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-red-100 border-red-400'
      case 'warning':
        return 'bg-amber-50 border-amber-300'
      case 'positive':
        return 'bg-green-50 border-green-200'
      case 'neutral':
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-900">💡 Principais Insights</h3>
        <div className="flex gap-2 items-center">
          {alertCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded">
              🚨 {alertCount} crítico{alertCount !== 1 ? 's' : ''}
            </span>
          )}
          {warningCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded">
              ⚠️ {warningCount} aviso{warningCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {displayedInsights.map((insight) => (
          <div
            key={insight.id}
            className={`p-3 rounded-lg border ${getTypeColor(insight.type)} transition-colors`}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl flex-shrink-0">{insight.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{insight.title}</p>
                <p className="text-xs text-gray-700 mt-1">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botão expandir */}
      {allInsights.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          {isExpanded ? '↑ Mostrar menos (3)' : `↓ Mostrar mais (${allInsights.length - 3} adicionais)`}
        </button>
      )}
    </div>
  )
}
