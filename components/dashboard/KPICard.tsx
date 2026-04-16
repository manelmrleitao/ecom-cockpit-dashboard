'use client'

/**
 * Componente KPICard
 * Card reutilizável para exibir um KPI
 */

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  icon?: string
  trend?: number // Percentagem de mudança
  trendLabel?: string
  color?: 'blue' | 'green' | 'red' | 'purple' | 'amber'
  loading?: boolean
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
}

export function KPICard({
  title,
  value,
  unit,
  icon,
  trend,
  trendLabel,
  color = 'blue',
  loading = false,
}: KPICardProps) {
  const getTrendColor = () => {
    if (!trend) return 'text-gray-600'
    if (trend > 0) return 'text-green-600'
    return 'text-red-600'
  }

  const getTrendIcon = () => {
    if (!trend) return '→'
    if (trend > 0) return '↑'
    return '↓'
  }

  return (
    <div
      className={`rounded-lg border ${colorClasses[color]} p-6 shadow-sm transition-shadow hover:shadow-md`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">{title}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>

      {/* Value */}
      <div className="mt-4">
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
        ) : (
          <p className="text-3xl font-bold text-gray-900">
            {value}
            {unit && <span className="text-lg text-gray-600">{unit}</span>}
          </p>
        )}
      </div>

      {/* Trend */}
      {trend !== undefined && !loading && (
        <div className={`mt-2 flex items-center gap-1 text-sm ${getTrendColor()}`}>
          <span>{getTrendIcon()}</span>
          <span>{Math.abs(trend)}%</span>
          {trendLabel && <span className="ml-1 text-gray-600">({trendLabel})</span>}
        </div>
      )}
    </div>
  )
}
