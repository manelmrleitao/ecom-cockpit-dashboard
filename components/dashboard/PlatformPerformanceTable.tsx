'use client'

/**
 * Componente PlatformPerformanceTable
 * Tabela comparativa de performance por plataforma
 */

import type { PlatformKPIs } from '@/types'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils/kpi-calculator'

interface PlatformPerformanceTableProps {
  data: PlatformKPIs[]
  loading?: boolean
}

const platformNames = {
  'google-ads': 'Google Ads',
  'meta-ads': 'Meta Ads',
  'tiktok-ads': 'TikTok Ads',
  'pinterest': 'Pinterest',
  'shopify': 'Shopify',
  'organic': 'Orgânico',
  'outros': 'Outros',
}

const platformColors = {
  'google-ads': 'bg-blue-50 border-l-4 border-blue-500',
  'meta-ads': 'bg-blue-50 border-l-4 border-blue-600',
  'tiktok-ads': 'bg-gray-50 border-l-4 border-gray-900',
  'pinterest': 'bg-red-50 border-l-4 border-red-500',
  'shopify': 'bg-green-50 border-l-4 border-green-500',
  'organic': 'bg-purple-50 border-l-4 border-purple-500',
  'outros': 'bg-slate-50 border-l-4 border-slate-500',
}

export function PlatformPerformanceTable({
  data,
  loading = false,
}: PlatformPerformanceTableProps) {
  if (loading) {
    return (
      <div className="space-y-3 p-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              Plataforma
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
              Gasto
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
              Receita
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">ROAS</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">CPA</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
              Conversões
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">CTR</th>
          </tr>
        </thead>
        <tbody>
          {data.map((platform) => (
            <tr
              key={platform.platform}
              className={`border-b border-gray-200 transition-colors hover:bg-gray-50 ${
                platformColors[platform.platform]
              }`}
            >
              <td className="px-6 py-4">
                <p className="text-sm font-medium text-gray-900">
                  {platformNames[platform.platform]}
                </p>
              </td>
              <td className="px-6 py-4 text-right">
                <p className="text-sm text-gray-600">{formatCurrency(platform.spend)}</p>
              </td>
              <td className="px-6 py-4 text-right">
                <p className="text-sm font-medium text-green-600">
                  {formatCurrency(platform.revenue)}
                </p>
              </td>
              <td className="px-6 py-4 text-right">
                <p
                  className={`text-sm font-semibold ${
                    platform.roas >= 1 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatNumber(platform.roas, 2)}x
                </p>
              </td>
              <td className="px-6 py-4 text-right">
                <p className="text-sm text-gray-600">{formatCurrency(platform.cpa)}</p>
              </td>
              <td className="px-6 py-4 text-right">
                <p className="text-sm text-gray-600">{platform.conversions}</p>
              </td>
              <td className="px-6 py-4 text-right">
                <p className="text-sm text-gray-600">{formatPercent(platform.ctr, 2)}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
