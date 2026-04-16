'use client'

/**
 * Componente PlatformROASChart
 * Gráfico comparativo de ROAS por plataforma com Recharts
 */

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PlatformROASChartProps {
  data?: Array<{ platform: string; roas: number; spend: number; revenue: number }>
  previousData?: Array<{ platform: string; roas: number; spend: number; revenue: number }>
}

const DEFAULT_DATA = [
  { platform: 'Google Ads', roas: 4.55, spend: 1850, revenue: 8420.5 },
  { platform: 'Meta Ads', roas: 3.8, spend: 1320, revenue: 5012.75 },
  { platform: 'TikTok Ads', roas: 5.37, spend: 450, revenue: 2414.25 },
]

const DEFAULT_PREVIOUS_DATA = [
  { platform: 'Google Ads', roas: 4.0, spend: 1700, revenue: 6800 },
  { platform: 'Meta Ads', roas: 3.2, spend: 1200, revenue: 3840 },
  { platform: 'TikTok Ads', roas: 4.5, spend: 400, revenue: 1800 },
]

export function PlatformROASChart({ data = DEFAULT_DATA, previousData = DEFAULT_PREVIOUS_DATA }: PlatformROASChartProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  const chartData = data && data.length > 0 ? data : DEFAULT_DATA
  const prevData = previousData && previousData.length > 0 ? previousData : DEFAULT_PREVIOUS_DATA

  // Merge current and previous data for chart
  const mergedChartData = chartData.map((item) => {
    const prev = prevData.find((p) => p.platform === item.platform)
    return {
      platform: item.platform,
      'ROAS Atual': item.roas,
      'ROAS Anterior': prev?.roas || 0,
    }
  })

  const selectedData = selectedPlatform ? chartData.find((item) => item.platform === selectedPlatform) : null
  const selectedPrevData = selectedPlatform ? prevData.find((item) => item.platform === selectedPlatform) : null

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6">ROAS por Fonte de Aquisição</h3>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={mergedChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="platform" stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value) => [(value as number).toFixed(2), '']}
            labelFormatter={(label) => `${label}`}
          />
          <Legend />
          <Bar
            dataKey="ROAS Atual"
            fill="#f59e0b"
            radius={[8, 8, 0, 0]}
            onClick={(data) => setSelectedPlatform(data.platform)}
          />
          <Bar
            dataKey="ROAS Anterior"
            fill="#cbd5e1"
            radius={[8, 8, 0, 0]}
            onClick={(data) => setSelectedPlatform(data.platform)}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Selected Platform Details */}
      {selectedData && selectedPrevData && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-900">{selectedData.platform}</h4>
            <button
              onClick={() => setSelectedPlatform(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">ROAS Atual</p>
              <p className="text-2xl font-bold text-orange-600">{selectedData.roas.toFixed(2)}x</p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedPrevData.roas > 0 ? `+${((selectedData.roas - selectedPrevData.roas) / selectedPrevData.roas * 100).toFixed(1)}%` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">ROAS Anterior</p>
              <p className="text-2xl font-bold text-slate-400">{selectedPrevData.roas.toFixed(2)}x</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Receita Atual</p>
              <p className="text-lg font-bold text-green-600">€{selectedData.revenue.toLocaleString('pt-PT')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Gasto Atual</p>
              <p className="text-lg font-bold text-blue-600">€{selectedData.spend.toLocaleString('pt-PT')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Platform Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        {chartData.map((item) => {
          const prev = prevData.find((p) => p.platform === item.platform)
          const trend = prev ? ((item.roas - prev.roas) / prev.roas) * 100 : 0
          return (
            <div
              key={item.platform}
              onClick={() => setSelectedPlatform(item.platform)}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                selectedPlatform === item.platform
                  ? 'bg-blue-100 border border-blue-300'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <p className="text-xs text-gray-600 font-semibold mb-2">{item.platform}</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${item.roas >= 2 ? 'text-green-600' : 'text-orange-600'}`}>
                  {item.roas.toFixed(2)}x
                </span>
                <span className={`text-xs font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Gasto: €{item.spend.toLocaleString('pt-PT', { minimumFractionDigits: 0 })}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
