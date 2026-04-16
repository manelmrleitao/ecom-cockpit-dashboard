'use client'

/**
 * Componente PerformanceHeatmap
 * Mostra padrões de performance por dia da semana e horários
 */

interface HeatmapData {
  day: string
  dayShort: string
  roas: number
  revenue: number
  orders: number
}

interface PerformanceHeatmapProps {
  data: HeatmapData[]
}

function getHeatmapColor(roas: number, maxRoas: number): string {
  const intensity = roas / maxRoas
  if (intensity >= 0.8) return 'bg-emerald-500'
  if (intensity >= 0.6) return 'bg-blue-500'
  if (intensity >= 0.4) return 'bg-amber-500'
  return 'bg-red-500'
}

export function PerformanceHeatmap({ data }: PerformanceHeatmapProps) {
  const maxRoas = Math.max(...data.map((d) => d.roas))
  const avgRoas = data.reduce((sum, d) => sum + d.roas, 0) / data.length
  const bestDay = [...data].sort((a, b) => b.roas - a.roas)[0]
  const worstDay = [...data].sort((a, b) => a.roas - b.roas)[0]

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-900 mb-4">🔥 Padrões de Performance (Dia da Semana)</h3>

      {/* Legend */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500"></div>
          <p className="text-xs text-gray-600">Excelente (80%+)</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500"></div>
          <p className="text-xs text-gray-600">Bom (60-80%)</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500"></div>
          <p className="text-xs text-gray-600">Médio (40-60%)</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <p className="text-xs text-gray-600">Fraco (&lt;40%)</p>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 overflow-x-auto">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
          {/* Header */}
          {data.map((day, idx) => (
            <div key={`header-${idx}`} className="text-center">
              <p className="text-xs font-bold text-gray-700 mb-2">{day.dayShort}</p>
            </div>
          ))}

          {/* Heatmap Cells */}
          {data.map((day, idx) => (
            <div
              key={`heatmap-${idx}`}
              className={`${getHeatmapColor(day.roas, maxRoas)} rounded p-2 text-white text-center transition-all hover:scale-110`}
            >
              <p className="text-xs font-bold">{day.roas.toFixed(2)}x</p>
              <p className="text-xs opacity-80">{day.orders} pedidos</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <p className="text-xs text-emerald-700 font-semibold mb-1">🥇 Melhor Dia</p>
          <p className="text-sm font-bold text-gray-900">{bestDay.day}</p>
          <p className="text-xs text-emerald-600 font-semibold">{bestDay.roas.toFixed(2)}x ROAS</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700 font-semibold mb-1">📊 Média</p>
          <p className="text-sm font-bold text-gray-900">{avgRoas.toFixed(2)}x</p>
          <p className="text-xs text-blue-600">ROAS médio</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs text-red-700 font-semibold mb-1">⚠️ Pior Dia</p>
          <p className="text-sm font-bold text-gray-900">{worstDay.day}</p>
          <p className="text-xs text-red-600 font-semibold">{worstDay.roas.toFixed(2)}x ROAS</p>
        </div>
      </div>

      {/* Tip */}
      <p className="text-xs text-gray-500 mt-4 italic">
        💡 Dica: Concentre orçamento nos dias com melhor performance
      </p>
    </div>
  )
}
