'use client'

/**
 * Componente PeriodComparison
 * Compara KPIs com período anterior
 */

export interface ComparisonData {
  label: string
  current: number
  previous: number
  format: 'currency' | 'number' | 'percent'
  icon: string
}

interface PeriodComparisonProps {
  data: ComparisonData[]
}

function formatValue(value: number, format: string): string {
  switch (format) {
    case 'currency':
      return `€${(value / 1000).toFixed(1)}k`
    case 'percent':
      return `${value.toFixed(1)}%`
    case 'number':
      // For ROAS and similar decimals, show 2 decimal places
      return value % 1 !== 0 ? value.toFixed(2) : Math.round(value).toString()
    default:
      return Math.round(value).toString()
  }
}

export function PeriodComparison({ data }: PeriodComparisonProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-900 mb-4">📊 Comparação vs. Período Anterior</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {data.map((item, idx) => {
          const change = ((item.current - item.previous) / item.previous) * 100
          const isPositive = change >= 0
          const changeColor = isPositive ? 'text-emerald-600' : 'text-red-600'
          const bgColor = isPositive ? 'bg-emerald-50' : 'bg-red-50'

          return (
            <div key={idx} className={`${bgColor} border border-gray-200 rounded-lg p-3`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-600">{item.label}</p>
                <span className="text-lg">{item.icon}</span>
              </div>

              <p className="text-2xl font-bold text-gray-900 mb-1">
                {formatValue(item.current, item.format)}
              </p>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  vs. {formatValue(item.previous, item.format)}
                </p>
                <p className={`text-xs font-bold ${changeColor}`}>
                  {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
