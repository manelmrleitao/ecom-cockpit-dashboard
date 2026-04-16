'use client'

/**
 * Ads Health Check Page
 */

export default function AdsHealthPage() {
  const healthChecks = [
    { name: 'Google Ads', score: 78, status: 'good', issues: 3 },
    { name: 'Meta Ads', score: 65, status: 'warning', issues: 6 },
    { name: 'TikTok Ads', score: 82, status: 'good', issues: 1 },
    { name: 'Pinterest Ads', score: 55, status: 'danger', issues: 8 },
  ]

  const avgScore = Math.round(healthChecks.reduce((sum, h) => sum + h.score, 0) / healthChecks.length)

  const getStatusColor = (score: number) => {
    if (score >= 75) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const getStatusLabel = (score: number) => {
    if (score >= 75) return '✅ Saudável'
    if (score >= 60) return '⚠️ Atenção'
    return '❌ Crítico'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🏥 Ads Health Check</h1>
        <p className="text-gray-600 mb-8">Diagnóstico da estrutura e performance das campanhas</p>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600">{avgScore}</div>
            <p className="text-gray-600 mt-2">Ads Health Score Global</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {healthChecks.map((h) => (
            <div key={h.name} className={`rounded-lg border p-6 ${getStatusColor(h.score)}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900">{h.name}</h3>
                <span className="text-2xl">{getStatusLabel(h.score)}</span>
              </div>

              <div className="mb-4">
                <div className="text-4xl font-bold text-gray-900">{h.score}</div>
                <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      h.score >= 75 ? 'bg-green-500' : h.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${h.score}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-gray-600">{h.issues} problemas identificados</p>

              <ul className="mt-3 space-y-1 text-xs text-gray-700">
                <li>• Estrutura de campanha</li>
                <li>• Budget distribution</li>
                <li>• Creative freshness</li>
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚙️ Recomendações Gerais</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Pausar campanhas com ROAS &lt; 1.5x</li>
            <li>• Aumentar budget em campanhas com ROAS &gt; 4x</li>
            <li>• Testar novos criativos em todas as plataformas</li>
            <li>• Implementar regra de pausar após 3 dias sem conversão</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
