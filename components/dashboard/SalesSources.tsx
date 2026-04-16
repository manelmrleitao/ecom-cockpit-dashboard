'use client'

import { useState, useEffect } from 'react'
import type { SalesSourceData } from '@/lib/utils/sales-source-classifier'

interface SalesSourcesProps {
  period: string
}

export function SalesSources({ period }: SalesSourcesProps) {
  const [data, setData] = useState<SalesSourceData[]>([])
  const [summary, setSummary] = useState({ totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSalesSources = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/shopify/sales-sources?period=${period}`)

        if (!response.ok) {
          throw new Error('Failed to fetch sales sources')
        }

        const result = await response.json()
        setData(result.salesBySource || [])
        setSummary(result.summary || {})
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchSalesSources()
  }, [period])

  const getSourceIcon = (source: string): string => {
    const icons: Record<string, string> = {
      Instagram: '📱',
      Facebook: 'f',
      TikTok: '🎵',
      Pinterest: '📌',
      Google: '🔍',
      'Google Ads': '🎯',
      YouTube: '▶️',
      Linktree: '🔗',
      Direct: '⚡',
      Email: '✉️',
      Organic: '🌱',
      Unknown: '❓',
    }
    return icons[source] || '•'
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Vendas por Fonte</h3>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-red-900 mb-2">⚠️ Erro ao carregar fontes de venda</h3>
        <p className="text-sm text-red-700">{error}</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Vendas por Fonte</h3>
        <p className="text-center text-gray-600 py-8">Sem dados disponíveis para este período.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Vendas por Fonte</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-purple-200 rounded-lg p-3">
          <p className="text-xs text-gray-600 font-semibold">Receita Total</p>
          <p className="text-xl font-bold text-gray-900">€{summary.totalRevenue.toLocaleString('pt-PT', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-lg p-3">
          <p className="text-xs text-gray-600 font-semibold">Pedidos</p>
          <p className="text-xl font-bold text-gray-900">{summary.totalOrders.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-lg p-3">
          <p className="text-xs text-gray-600 font-semibold">Ticket Médio</p>
          <p className="text-xl font-bold text-gray-900">€{summary.averageOrderValue.toLocaleString('pt-PT', { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      {/* Sources Table */}
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.source} className="bg-white border border-purple-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getSourceIcon(item.source)}</span>
                <div>
                  <p className="font-semibold text-gray-900">{item.source}</p>
                  <p className="text-xs text-gray-500">{item.orders} pedidos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">€{item.revenue.toLocaleString('pt-PT', { maximumFractionDigits: 0 })}</p>
                <p className="text-xs text-purple-600 font-semibold">{item.percentage}%</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Average Order Value per Source */}
      <div className="mt-6 pt-6 border-t border-purple-200">
        <p className="text-xs font-semibold text-gray-600 mb-3">Ticket Médio por Fonte</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {data.map((item) => (
            <div key={`aov-${item.source}`} className="bg-white border border-purple-200 rounded p-2">
              <p className="text-gray-600">{item.source}</p>
              <p className="font-bold text-gray-900">€{item.avgOrderValue.toLocaleString('pt-PT', { maximumFractionDigits: 0 })}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
