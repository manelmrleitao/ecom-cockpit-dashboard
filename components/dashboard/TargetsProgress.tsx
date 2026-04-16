'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

/**
 * Componente TargetsProgress
 * Mostra progresso vs. landing com gráficos de linha ao longo dos dias do mês
 */

interface Target {
  label: string
  current: number
  format: 'currency' | 'number' | 'percent'
  icon: string
}

interface TargetsProgressProps {
  targets: Target[]
}

function formatValue(value: number, format: string): string {
  switch (format) {
    case 'currency':
      return `€${(value / 1000).toFixed(1)}k`
    case 'percent':
      return `${value.toFixed(1)}%`
    default:
      return Math.round(value).toString()
  }
}

/**
 * Gera dados diários para o gráfico
 * Real: dados acumulados até hoje
 * Landing: projeção linear até fim do mês
 */
function generateChartData(currentValue: number, format: string) {
  const today = new Date()
  const dayOfMonth = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  const dailyRate = currentValue / dayOfMonth

  const data = []
  for (let day = 1; day <= daysInMonth; day++) {
    const real = day <= dayOfMonth ? (dailyRate * day) : null
    const landing = dailyRate * day

    data.push({
      day,
      real: real !== null ? Math.round(real * 100) / 100 : undefined,
      landing: Math.round(landing * 100) / 100,
    })
  }

  return data
}

/**
 * Calcula o valor projetado para o final do mês
 */
function calculateLanding(current: number): number {
  const today = new Date()
  const dayOfMonth = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  if (dayOfMonth === 0) return current
  const dailyRate = current / dayOfMonth
  return dailyRate * daysInMonth
}

export function TargetsProgress({ targets }: TargetsProgressProps) {
  const today = new Date()
  const dayOfMonth = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const daysRemaining = daysInMonth - dayOfMonth
  const daysProgress = Math.round((dayOfMonth / daysInMonth) * 100)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">📊 Realidade vs. Ritmo de Landing</h3>
          <p className="text-xs text-gray-500">
            {dayOfMonth}/{daysInMonth} dias ({daysProgress}%) — {daysRemaining} dias restantes
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {targets.map((target, idx) => {
          const chartData = generateChartData(target.current, target.format)
          const landing = calculateLanding(target.current)

          return (
            <div key={idx} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{target.icon}</span>
                <p className="text-sm font-semibold text-gray-700">{target.label}</p>
              </div>

              {/* Gráfico */}
              <div className="mb-4 -mx-4">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="day"
                      label={{ value: 'Dias do mês', position: 'insideBottomRight', offset: -5 }}
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <YAxis
                      label={{ value: formatValue(target.current, target.format), angle: -90, position: 'insideLeft' }}
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <Tooltip
                      formatter={(value) => (value !== undefined ? formatValue(Number(value), target.format) : '—')}
                      labelFormatter={(label) => `Dia ${label}`}
                      contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '12px' }}
                      iconType="line"
                    />
                    <Line
                      type="monotone"
                      dataKey="real"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={false}
                      name="Real (até hoje)"
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="landing"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Projeção (fim do mês)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Resumo */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded p-2.5">
                  <p className="text-xs text-gray-600 mb-1">Real (hoje)</p>
                  <p className="text-sm font-bold text-blue-600">{formatValue(target.current, target.format)}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded p-2.5">
                  <p className="text-xs text-gray-600 mb-1">Projeção (fim do mês)</p>
                  <p className="text-sm font-bold text-emerald-600">{formatValue(landing, target.format)}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 italic">
          💡 A linha azul mostra valores reais até hoje. A linha tracejada verde mostra a projeção se mantiver o ritmo atual.
        </p>
      </div>
    </div>
  )
}
