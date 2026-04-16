'use client'

/**
 * Acquisition Funnel Page
 */

export default function AcquisitionFunnelPage() {
  const funnelData = [
    { stage: 'Sessões', value: 1152, icon: '👁️' },
    { stage: 'Cliques', value: 487, icon: '👆', conversion: 42.2 },
    { stage: 'Add to Cart', value: 156, icon: '🛒', conversion: 32.0 },
    { stage: 'Checkout', value: 45, icon: '💳', conversion: 28.8 },
    { stage: 'Compras', value: 21, icon: '✅', conversion: 46.7 },
  ]

  const getCPA = () => {
    const totalSpend = 640 // Valor total gasto
    const conversions = 21
    return (totalSpend / conversions).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Funil de Aquisição</h1>
        <p className="text-gray-600 mb-8">Onde estão perdidas as conversões?</p>

        {/* Funil Visual */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
          <div className="space-y-4">
            {funnelData.map((stage, idx) => {
              const width = (stage.value / funnelData[0].value) * 100
              return (
                <div key={stage.stage}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">
                      {stage.icon} {stage.stage}
                    </span>
                    <span className="text-gray-600">
                      {stage.value.toLocaleString()} {stage.conversion && `(${stage.conversion}%)`}
                    </span>
                  </div>
                  <div className="w-full h-8 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Taxa de Conversão Geral</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">1.82%</p>
            <p className="text-xs text-gray-500 mt-2">21 compras / 1152 sessões</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600">CPA Médio</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">€{getCPA()}</p>
            <p className="text-xs text-gray-500 mt-2">Custo por aquisição</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Ponto de Maior Abandono</p>
            <p className="text-3xl font-bold text-red-600 mt-2">Checkout</p>
            <p className="text-xs text-gray-500 mt-2">71% abandono (45 → 21)</p>
          </div>
        </div>

        {/* Recomendações */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Oportunidades</h2>
          <ul className="space-y-3 text-sm">
            <li className="p-3 bg-red-50 border border-red-200 rounded">
              <strong>CRÍTICO - Checkout:</strong> 71% abandono. Implementar one-page checkout, guest option, e payment methods diversificados.
            </li>
            <li className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <strong>Add to Cart:</strong> 68% abandono. Adicionar urgency (low stock), reviews, e recomendações de produtos.
            </li>
            <li className="p-3 bg-blue-50 border border-blue-200 rounded">
              <strong>Click-through:</strong> 58% não chegam a produto. Melhorar relevância de anúncios vs landing page.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
