'use client'

/**
 * Email Marketing Audit Page
 */

export default function EmailAuditPage() {
  const metrics = [
    { label: 'Taxa de Abertura', value: 22, target: 25, status: 'warning' },
    { label: 'Taxa de Clique', value: 3.2, target: 5, status: 'danger' },
    { label: 'Automações Ativas', value: 4, target: 8, status: 'warning' },
    { label: 'Taxa de Conversão Email', value: 2.1, target: 3, status: 'warning' },
    { label: 'Listas Segmentadas', value: 60, target: 80, status: 'warning' },
    { label: 'Frequência (emails/semana)', value: 2, target: 2.5, status: 'good' },
  ]

  const getScore = () => {
    const avgScore = metrics.reduce((sum, m) => sum + (m.value / m.target * 100), 0) / metrics.length
    return Math.round(avgScore)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📧 Email Marketing Audit</h1>
        <p className="text-gray-600 mb-8">Diagnóstico da saúde do teu programa de email</p>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600">{getScore()}/100</div>
            <p className="text-gray-600 mt-2">Email Marketing Health Score</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600">{m.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{m.value}%</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    m.status === 'good' ? 'bg-green-500' : m.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((m.value / m.target) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Meta: {m.target}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
