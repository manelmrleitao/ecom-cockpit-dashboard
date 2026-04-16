'use client'

/**
 * Componente RevenueChart
 * Gráfico de receita com Recharts (100% grátis)
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RevenueChartProps {
  data?: Array<{ day: string; value: number }>
}

const DEFAULT_DATA = [
  { day: 'Seg', value: 2850 },
  { day: 'Ter', value: 3920 },
  { day: 'Qua', value: 4230 },
  { day: 'Qui', value: 4847 },
  { day: 'Sex', value: 3560 },
  { day: 'Sab', value: 4920 },
  { day: 'Dom', value: 3520 },
]

export function RevenueChart({ data = DEFAULT_DATA }: RevenueChartProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Receita - Últimos 7 Dias</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value) => [
              `€${(value as number).toLocaleString('pt-PT')}`,
              'Receita',
            ]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            dot={{ fill: '#10b981', r: 5 }}
            activeDot={{ r: 7 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-600">Máximo</p>
          <p className="text-lg font-bold text-gray-900">€4,920</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Médio</p>
          <p className="text-lg font-bold text-gray-900">€3,982</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Total</p>
          <p className="text-lg font-bold text-green-600">€27,848</p>
        </div>
      </div>
    </div>
  )
}
