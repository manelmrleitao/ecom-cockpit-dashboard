'use client'

/**
 * Componente RevenueDistributionChart
 * Gráfico de pizza da distribuição de receita por plataforma
 */

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

interface RevenueDistributionChartProps {
  data?: Array<{ name: string; value: number; color: string }>
}

const DEFAULT_DATA = [
  { name: 'Google Ads', value: 8420.5, color: '#4285F4' },
  { name: 'Meta Ads', value: 5012.75, color: '#1877F2' },
  { name: 'TikTok Ads', value: 2414.25, color: '#000000' },
]

export function RevenueDistributionChart({ data = DEFAULT_DATA }: RevenueDistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Distribuição de Receita por Fonte de Aquisição</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `€${(value as number).toLocaleString('pt-PT', { minimumFractionDigits: 0 })}`}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>

      {/* Breakdown */}
      <div className="mt-6 space-y-2 pt-4 border-t border-gray-200">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">
                €{item.value.toLocaleString('pt-PT', { minimumFractionDigits: 0 })}
              </span>
              <span className="text-xs text-gray-500">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
