'use client'

/**
 * Componente Opportunities
 * Identifica principais oportunidades de otimização
 */

interface Opportunity {
  id: string
  title: string
  description: string
  platform: string
  icon: string
  impact: 'high' | 'medium' | 'low'
  action: string
}

interface OpportunitiesProps {
  opportunities: Opportunity[]
}

export function Opportunities({ opportunities }: OpportunitiesProps) {
  const highImpact = opportunities.filter((o) => o.impact === 'high')
  const mediumImpact = opportunities.filter((o) => o.impact === 'medium')

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-900 mb-4">💡 Principais Oportunidades</h3>

      {opportunities.length === 0 ? (
        <p className="text-sm text-gray-600 italic">Nenhuma oportunidade identificada no momento</p>
      ) : (
        <div className="space-y-3">
          {highImpact.map((opp) => (
            <div key={opp.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">{opp.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-bold text-red-900">{opp.title}</p>
                    <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded">Alto Impacto</span>
                  </div>
                  <p className="text-xs text-red-700 mb-2">{opp.description}</p>
                  <button className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors">
                    → {opp.action}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {mediumImpact.map((opp) => (
            <div key={opp.id} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex gap-3">
                <span className="text-lg flex-shrink-0">{opp.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-bold text-amber-900">{opp.title}</p>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Médio</span>
                  </div>
                  <p className="text-xs text-amber-700 mb-2">{opp.description}</p>
                  <button className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                    → {opp.action}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {opportunities.filter((o) => o.impact === 'low').length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-700 mb-2">Mais {opportunities.filter((o) => o.impact === 'low').length} oportunidade(s) de baixo impacto</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
