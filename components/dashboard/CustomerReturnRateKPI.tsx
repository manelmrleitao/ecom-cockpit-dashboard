'use client'

/**
 * Customer Return Rate KPI Component
 * Shows the percentage of customers making repeat purchases
 * Styled identically to TripleWhaleKPI for consistency
 */

interface SparklineDataPoint {
  day: string
  value: number
}

interface CustomerReturnRateKPIProps {
  returnRate: number // Percentage (0-100)
  returningCustomers: number
  totalCustomers: number
  isLoading?: boolean
  icon?: string
  sparklineData?: SparklineDataPoint[]
  change?: number
  previousValue?: string
}

export function CustomerReturnRateKPI({
  returnRate,
  returningCustomers,
  totalCustomers,
  isLoading = false,
  icon = '🔄',
  sparklineData,
  change,
  previousValue,
}: CustomerReturnRateKPIProps) {
  const isPositive = (change ?? 0) >= 0

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-red-900 text-xs font-semibold">Taxa de Retorno de Cliente</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>

      {/* Value */}
      <div className="mb-3">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        ) : (
          <div className="text-red-600 text-3xl md:text-4xl font-bold tracking-tight flex items-baseline gap-1">
            <span>{returnRate.toFixed(1)}</span>
            <span className="text-base md:text-lg">%</span>
          </div>
        )}
      </div>

      {/* Subtitle */}
      {!isLoading && (
        <p className="text-xs text-gray-600 mb-3">
          {returningCustomers} de {totalCustomers} clientes
        </p>
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
