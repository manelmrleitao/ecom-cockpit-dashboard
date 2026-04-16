'use client'

/**
 * Componente PlatformRanking
 * Ranking de plataformas por diferentes métricas
 */

interface PlatformScore {
  platform: string
  icon: string
  roas: number
  roi: number
  volume: number
}

interface PlatformRankingProps {
  platforms: PlatformScore[]
}

export function PlatformRanking({ platforms }: PlatformRankingProps) {
  // Ordenar por ROAS
  const rankedByRoas = [...platforms].sort((a, b) => b.roas - a.roas)
  const rankedByRoi = [...platforms].sort((a, b) => b.roi - a.roi)
  const rankedByVolume = [...platforms].sort((a, b) => b.volume - a.volume)

  const bestRoas = rankedByRoas[0]
  const bestRoi = rankedByRoi[0]
  const bestVolume = rankedByVolume[0]
  const worstRoas = rankedByRoas[rankedByRoas.length - 1]

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-900 mb-4">🏆 Ranking de Fontes de Aquisição</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Best ROAS */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <p className="text-xs text-emerald-700 font-semibold mb-2">🥇 Melhor ROAS</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{bestRoas.icon}</span>
            <div>
              <p className="text-sm font-bold text-gray-900">{bestRoas.platform}</p>
              <p className="text-lg font-bold text-emerald-600">{bestRoas.roas.toFixed(2)}x</p>
            </div>
          </div>
        </div>

        {/* Best ROI */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700 font-semibold mb-2">🥈 Melhor ROI</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{bestRoi.icon}</span>
            <div>
              <p className="text-sm font-bold text-gray-900">{bestRoi.platform}</p>
              <p className="text-lg font-bold text-blue-600">{bestRoi.roi.toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Best Volume */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-xs text-purple-700 font-semibold mb-2">🥉 Maior Volume</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{bestVolume.icon}</span>
            <div>
              <p className="text-sm font-bold text-gray-900">{bestVolume.platform}</p>
              <p className="text-lg font-bold text-purple-600">{bestVolume.volume} pedidos</p>
            </div>
          </div>
        </div>

        {/* Worst ROAS */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p className="text-xs text-orange-700 font-semibold mb-2">⚠️ Pior ROAS</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{worstRoas.icon}</span>
            <div>
              <p className="text-sm font-bold text-gray-900">{worstRoas.platform}</p>
              <p className="text-lg font-bold text-orange-600">{worstRoas.roas.toFixed(2)}x</p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Ranking Table */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-600 mb-3">Ranking Completo (ROAS)</p>
        <div className="space-y-2">
          {rankedByRoas.map((platform, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-600 w-6">#{idx + 1}</span>
                <span className="text-lg">{platform.icon}</span>
                <span className="font-medium text-gray-900">{platform.platform}</span>
              </div>
              <span className="font-bold text-gray-900">{platform.roas.toFixed(2)}x</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
