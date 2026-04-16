'use client'

/**
 * Componente OrdersChart
 * Gráfico de barras para pedidos com Recharts (100% grátis)
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface OrdersChartProps {
  data?: Array<{ day: string; orders: number; conversions: number }>
}

const DEFAULT_DATA = [
  { day: 'Seg', orders: 18, conversions: 12 },
  { day: 'Ter', orders: 24, conversions: 19 },
  { day: 'Qua', orders: 22, conversions: 17 },
  { day: 'Qui', orders: 28, conversions: 22 },
  { day: 'Sex', orders: 21, conversions: 16 },
  { day: 'Sab', orders: 26, conversions: 20 },
  { day: 'Dom', orders: 17, conversions: 13 },
]

export function OrdersChart({ data = DEFAULT_DATA }: OrdersChartProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Pedidos & Conversões - Últimos 7 Dias</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value) => value as number}
          />
          <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Pedidos" />
          <Bar dataKey="conversions" fill="#06b6d4" radius={[8, 8, 0, 0]} name="Conversões" />
        </BarChart>
      </ResponsiveContainer>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-600">Total Pedidos</p>
          <p className="text-lg font-bold text-gray-900">154</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Média/Dia</p>
          <p className="text-lg font-bold text-gray-900">22</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Taxa Conv.</p>
          <p className="text-lg font-bold text-blue-600">72.1%</p>
        </div>
      </div>
    </div>
  )
}
