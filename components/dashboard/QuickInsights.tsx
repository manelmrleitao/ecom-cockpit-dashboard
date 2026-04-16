'use client'

/**
 * Componente QuickInsights
 * Análise rápida dos principais KPIs com insights e watchouts
 */

interface KPIs {
  totalRevenue: number
  totalSpend: number
  roas: number
  cpa: number
  totalOrders: number
  aov: number
  conversionRate: number
}

interface Insight {
  type: 'positive' | 'warning' | 'alert' | 'neutral'
  icon: string
  title: string
  description: string
}

interface QuickInsightsProps {
  kpis: KPIs
  platformLabel?: string
}

export function QuickInsights({ kpis, platformLabel = 'Todas as plataformas' }: QuickInsightsProps) {
  const insights: Insight[] = []

  // Análise ROAS
  if (kpis.roas >= 4) {
    insights.push({
      type: 'positive',
      icon: '📈',
      title: 'Excelente ROAS',
      description: `ROAS de ${kpis.roas.toFixed(2)}x indica muito bom retorno sobre investimento`,
    })
  } else if (kpis.roas >= 2) {
    insights.push({
      type: 'positive',
      icon: '✅',
      title: 'ROAS Saudável',
      description: `ROAS de ${kpis.roas.toFixed(2)}x está acima da meta mínima de 2x`,
    })
  } else if (kpis.roas > 0) {
    insights.push({
      type: 'warning',
      icon: '⚠️',
      title: 'ROAS Baixo',
      description: `ROAS de ${kpis.roas.toFixed(2)}x está abaixo de 2x - considere otimizar anúncios`,
    })
  }

  // Análise CPA
  if (kpis.cpa < 20) {
    insights.push({
      type: 'positive',
      icon: '💰',
      title: 'CPA Otimizado',
      description: `Custo por compra de €${kpis.cpa.toFixed(2)} é muito competitivo`,
    })
  } else if (kpis.cpa < 30) {
    insights.push({
      type: 'neutral',
      icon: '👁️',
      title: 'CPA Moderado',
      description: `Custo por compra de €${kpis.cpa.toFixed(2)} está dentro do normal`,
    })
  } else {
    insights.push({
      type: 'alert',
      icon: '🚨',
      title: 'CPA Elevado',
      description: `Custo por compra de €${kpis.cpa.toFixed(2)} está alto - verificar conversões`,
    })
  }

  // Análise AOV
  if (kpis.aov > 100) {
    insights.push({
      type: 'positive',
      icon: '🎁',
      title: 'AOV Alto',
      description: `Valor médio de €${kpis.aov.toFixed(2)} por pedido é excelente`,
    })
  } else if (kpis.aov > 50) {
    insights.push({
      type: 'neutral',
      icon: '📊',
      title: 'AOV Estável',
      description: `Valor médio de €${kpis.aov.toFixed(2)} está consistente`,
    })
  }

  // Análise de Volume
  if (kpis.totalOrders < 50) {
    insights.push({
      type: 'alert',
      icon: '📉',
      title: 'Volume Baixo',
      description: `Apenas ${kpis.totalOrders} pedidos - considere aumentar investimento`,
    })
  } else if (kpis.totalOrders > 200) {
    insights.push({
      type: 'positive',
      icon: '🚀',
      title: 'Alto Volume',
      description: `${kpis.totalOrders} pedidos demonstra escala de negócio forte`,
    })
  }

  // Análise de Spend vs Revenue
  const marginPercent = ((kpis.totalRevenue - kpis.totalSpend) / kpis.totalRevenue) * 100
  if (marginPercent > 75) {
    insights.push({
      type: 'positive',
      icon: '💵',
      title: 'Margem Excelente',
      description: `Margem de ${marginPercent.toFixed(0)}% após publicidade é muito saudável`,
    })
  } else if (marginPercent < 50) {
    insights.push({
      type: 'warning',
      icon: '⚠️',
      title: 'Margem Comprimida',
      description: `Margem de ${marginPercent.toFixed(0)}% pode ser insustentável a longo prazo`,
    })
  }

  const alertCount = insights.filter((i) => i.type === 'alert').length
  const warningCount = insights.filter((i) => i.type === 'warning').length
  const positiveCount = insights.filter((i) => i.type === 'positive').length

  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 mb-4">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-900">📊 Análise Rápida</h3>
        <p className="text-xs text-gray-600 mt-0.5">{platformLabel}</p>
      </div>

      {/* Stats Summary */}
      <div className="flex gap-3 mb-3 pb-3 border-b border-slate-200">
        {alertCount > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-lg">🚨</span>
            <span className="text-xs font-semibold text-red-700">{alertCount} alerta</span>
          </div>
        )}
        {warningCount > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-lg">⚠️</span>
            <span className="text-xs font-semibold text-amber-700">{warningCount} aviso</span>
          </div>
        )}
        {positiveCount > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-lg">✅</span>
            <span className="text-xs font-semibold text-emerald-700">{positiveCount} ponto forte</span>
          </div>
        )}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {insights.map((insight, idx) => {
          const bgColor = {
            alert: 'bg-red-50',
            warning: 'bg-amber-50',
            positive: 'bg-emerald-50',
            neutral: 'bg-blue-50',
          }[insight.type]

          const borderColor = {
            alert: 'border-red-200',
            warning: 'border-amber-200',
            positive: 'border-emerald-200',
            neutral: 'border-blue-200',
          }[insight.type]

          const titleColor = {
            alert: 'text-red-900',
            warning: 'text-amber-900',
            positive: 'text-emerald-900',
            neutral: 'text-blue-900',
          }[insight.type]

          const textColor = {
            alert: 'text-red-700',
            warning: 'text-amber-700',
            positive: 'text-emerald-700',
            neutral: 'text-blue-700',
          }[insight.type]

          return (
            <div key={idx} className={`${bgColor} ${borderColor} border rounded-lg p-2.5`}>
              <div className="flex gap-2">
                <span className="text-lg flex-shrink-0">{insight.icon}</span>
                <div className="min-w-0">
                  <p className={`text-xs font-bold ${titleColor}`}>{insight.title}</p>
                  <p className={`text-xs ${textColor} mt-0.5 leading-tight`}>{insight.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {insights.length === 0 && (
        <p className="text-xs text-gray-500 italic">Nenhum insight disponível no momento</p>
      )}
    </div>
  )
}
