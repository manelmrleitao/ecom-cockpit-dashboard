'use client'

/**
 * Oferta & Pricing Audit Page
 * Análise de estratégia de preço, AOV, upsells, e posicionamento
 */

export default function PricingAuditPage() {
  const metrics = [
    { label: 'AOV (Average Order Value)', value: '€47.40', target: '€65', status: 'warning' },
    { label: 'Ticket Médio', value: '€52', target: '€75', status: 'warning' },
    { label: 'Taxa de Upsell', value: 18, target: 35, status: 'danger', unit: '%' },
    { label: 'Taxa de Cross-sell', value: 12, target: 25, status: 'danger', unit: '%' },
  ]

  const pricingStrategies = [
    {
      name: 'Bundling',
      status: 'not_implemented',
      description: 'Vender produtos em pacotes com desconto',
      impact: '+15-20% AOV',
      effort: 'Baixo',
    },
    {
      name: 'Tiered Pricing',
      status: 'implemented',
      description: 'Diferentes níveis de preço com variações de produto',
      impact: '+8-12% conversão',
      effort: 'Médio',
    },
    {
      name: 'Upsell na Página de Checkout',
      status: 'not_implemented',
      description: 'Sugerir produtos de preço maior antes de finalizar',
      impact: '+10-18% AOV',
      effort: 'Médio',
    },
    {
      name: 'Volume Discounts',
      status: 'implemented',
      description: 'Descontos progressivos por quantidade',
      impact: '+12-15% ticket médio',
      effort: 'Baixo',
    },
    {
      name: 'Recomendações Personalizadas',
      status: 'partial',
      description: 'Sugerir cross-sells baseado em histórico',
      impact: '+20-25% cross-sell',
      effort: 'Alto',
    },
  ]

  const competitorAnalysis = [
    {
      competitor: 'Shopify (Padrão)',
      pricing_strategy: 'Dinâmica com volume',
      avg_aov: '€58-75',
      upsell_strategy: 'Carrinho + Checkout',
      strength: 'Diversidade de preços',
    },
    {
      competitor: 'Concorrente A',
      pricing_strategy: 'Premium fixo',
      avg_aov: '€95-120',
      upsell_strategy: 'Bundles forte',
      strength: 'Posicionamento premium',
    },
    {
      competitor: 'Concorrente B',
      pricing_strategy: 'Competitivo com promos',
      avg_aov: '€35-45',
      upsell_strategy: 'Cross-sell e bundles',
      strength: 'Volume e acessibilidade',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented':
        return 'bg-green-50 border-green-200'
      case 'partial':
        return 'bg-yellow-50 border-yellow-200'
      case 'not_implemented':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'implemented':
        return '✅ Implementado'
      case 'partial':
        return '⚠️ Parcial'
      case 'not_implemented':
        return '❌ Não Implementado'
      default:
        return '❓'
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">💰 Oferta & Pricing Audit</h1>
        <p className="text-gray-600 mb-8">Análise de estratégia de preço, AOV, upsells e posicionamento vs mercado</p>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-600 mb-2">{m.label}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{m.value}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Meta: {m.target}</p>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    m.status === 'good'
                      ? 'bg-green-100 text-green-800'
                      : m.status === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {m.status === 'good' ? '✅' : m.status === 'warning' ? '⚠️' : '❌'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Estratégias de Pricing */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Estratégias de Pricing & Upselling</h2>

          <div className="space-y-4">
            {pricingStrategies.map((strategy, idx) => (
              <div key={idx} className={`rounded-lg border p-6 ${getStatusColor(strategy.status)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{strategy.name}</h3>
                    <p className="text-sm text-gray-700 mt-1">{strategy.description}</p>
                  </div>
                  <span className="text-sm font-semibold">{getStatusLabel(strategy.status)}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-current border-opacity-20">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Impacto Esperado</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{strategy.impact}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Esforço</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{strategy.effort}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Análise de Concorrência */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 Benchmarking vs Concorrência</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b-2 border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Concorrente</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Estratégia de Preço</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-900">AOV Médio</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Estratégia de Upsell</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Ponto Forte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {competitorAnalysis.map((comp, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">{comp.competitor}</td>
                    <td className="py-3 px-4 text-gray-700">{comp.pricing_strategy}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{comp.avg_aov}</td>
                    <td className="py-3 px-4 text-gray-700">{comp.upsell_strategy}</td>
                    <td className="py-3 px-4 text-gray-700">{comp.strength}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recomendações */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Plano de Ação Prioritizado</h2>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-bold text-red-900 mb-2">🔴 CRÍTICO: Implementar Upsell no Checkout</p>
              <p className="text-sm text-red-800">
                Adicionar sugestão de produto de maior preço antes da finalização → Impacto: +10-18% AOV (+€4.74-8.53)
              </p>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="font-bold text-orange-900 mb-2">🟠 ALTA: Implementar Bundling</p>
              <p className="text-sm text-orange-800">
                Criar pacotes de 2-3 produtos com preço discounted → Impacto: +15-20% AOV (+€7.10-9.48)
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-bold text-yellow-900 mb-2">🟡 ALTA: Melhorar Cross-sell Pós-compra</p>
              <p className="text-sm text-yellow-800">
                Email de recomendação 24h após compra com produtos relacionados → Impacto: +12-18% cross-sell
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-blue-900">📈 Potencial de Melhoria</p>
              <p className="text-sm text-blue-800 mt-2">
                Se implementar estas 3 estratégias, pode aumentar AOV de €47.40 para €65-75 (+37-58%), alinhado com o positioning premium no mercado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
