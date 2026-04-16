'use client'

/**
 * Componente TripleWhaleKPI
 * Card estilo Triple Whale com valores grandes e destacados
 */

import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface SparklineDataPoint {
  day: string
  value: number
}

interface TripleWhaleKPIProps {
  label: string
  value: string | number
  unit?: string
  change?: number
  previousValue?: string | number
  sparklineData?: SparklineDataPoint[]
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink'
  icon?: string
  onClick?: () => void
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-600',
    label: 'text-blue-900',
  },
  green: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-600',
    label: 'text-emerald-900',
  },
  purple: {
    bg: 'bg-purple-50 border-purple-200',
    text: 'text-purple-600',
    label: 'text-purple-900',
  },
  orange: {
    bg: 'bg-orange-50 border-orange-200',
    text: 'text-orange-600',
    label: 'text-orange-900',
  },
  pink: {
    bg: 'bg-pink-50 border-pink-200',
    text: 'text-pink-600',
    label: 'text-pink-900',
  },
}

export function TripleWhaleKPI({
  label,
  value,
  unit,
  change,
  previousValue,
  sparklineData,
  color = 'blue',
  icon,
  onClick,
}: TripleWhaleKPIProps) {
  const styles = colorStyles[color]
  const isPositive = (change ?? 0) >= 0

  return (
    <div
      onClick={onClick}
      className={`${styles.bg} border rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p className={`${styles.label} text-xs font-semibold`}>{label}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>

      {/* Value */}
      <div className="mb-3">
        <div className={`${styles.text} text-3xl md:text-4xl font-bold tracking-tight flex items-baseline gap-1 flex-wrap`}>
          <span>{value}</span>
          {unit && <span className="text-base md:text-lg">{unit}</span>}
        </div>
      </div>

      {/* Sparkline Chart */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="mb-2 -mx-2">
          <ResponsiveContainer width="100%" height={40}>
            <LineChart data={sparklineData} margin={{ top: 5, right: 5, left: -20, bottom: -10 }}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={color === 'green' ? '#10b981' : color === 'blue' ? '#3b82f6' : color === 'orange' ? '#f97316' : color === 'purple' ? '#a855f7' : '#ec4899'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Change */}
      {change !== undefined && (
        <div className="space-y-1">
          <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(change).toFixed(1)}%</span>
            <span className="text-gray-500 font-normal text-xs">vs anterior</span>
          </div>
          {previousValue !== undefined && (
            <p className="text-xs text-gray-600">Anterior: {previousValue}</p>
          )}
        </div>
      )}
    </div>
  )
}
