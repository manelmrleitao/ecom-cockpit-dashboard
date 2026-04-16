'use client'

/**
 * CreativeView - Shows all creatives for an adset
 */

import { MetricsTable, type Column } from './MetricsTable'
import type { Platform, Campaign, Adset, Creative } from './types'

interface CreativeViewProps {
  platform: Platform
  campaign: Campaign
  adset: Adset
  onBack: () => void
}

// Mock data - replace with API call
const MOCK_CREATIVES: Record<string, Creative[]> = {
  'adset-1': [
    {
      id: 'cr-1',
      name: 'Product Showcase - Video',
      adsetId: 'adset-1',
      type: 'video',
      status: 'active',
      spend: 400,
      revenue: 1800,
      roas: 4.5,
      conversions: 15,
      cac: 26.67,
      impressions: 15000,
      clicks: 600,
      ctr: 4.0,
      cpc: 0.67,
      copy: 'Veja como este produto pode transformar sua vida!',
      videoCompletionRate: 52.3,
      thumbstopRate: 65.2,
    },
    {
      id: 'cr-2',
      name: 'Testimonial - User Review',
      adsetId: 'adset-1',
      type: 'video',
      status: 'active',
      spend: 200,
      revenue: 900,
      roas: 4.5,
      conversions: 7,
      cac: 28.57,
      impressions: 7500,
      clicks: 300,
      ctr: 4.0,
      cpc: 0.67,
      copy: 'Clientes reais compartilham suas histórias',
      videoCompletionRate: 48.1,
      thumbstopRate: 61.5,
    },
  ],
  'adset-2': [
    {
      id: 'cr-3',
      name: 'Limited Time Offer - Image',
      adsetId: 'adset-2',
      type: 'image',
      status: 'active',
      spend: 350,
      revenue: 1600,
      roas: 4.57,
      conversions: 13,
      cac: 26.92,
      impressions: 11250,
      clicks: 450,
      ctr: 4.0,
      cpc: 0.78,
      copy: '⏰ Oferta por tempo limitado - 40% off',
      thumbstopRate: 72.1,
    },
    {
      id: 'cr-4',
      name: 'Free Shipping Banner - Image',
      adsetId: 'adset-2',
      type: 'image',
      status: 'active',
      spend: 250,
      revenue: 1100,
      roas: 4.4,
      conversions: 10,
      cac: 25.0,
      impressions: 11250,
      clicks: 450,
      ctr: 4.0,
      cpc: 0.56,
      copy: '🚚 Envio grátis para Portugal',
    },
  ],
  'adset-3': [
    {
      id: 'cr-5',
      name: 'Product Feed - Dynamic',
      adsetId: 'adset-3',
      type: 'carousel',
      status: 'active',
      spend: 330,
      revenue: 1540,
      roas: 4.67,
      conversions: 18,
      cac: 18.33,
      impressions: 40215,
      clicks: 730,
      ctr: 1.82,
      cpc: 0.45,
    },
  ],
  'adset-5': [
    {
      id: 'cr-6',
      name: 'UGC Video #1',
      adsetId: 'adset-5',
      type: 'video',
      status: 'active',
      spend: 450,
      revenue: 2414.25,
      roas: 5.37,
      conversions: 21,
      cac: 21.43,
      impressions: 287654,
      clicks: 4890,
      ctr: 1.7,
      cpc: 0.092,
      copy: 'Unboxing e review realista do produto',
      videoCompletionRate: 71.2,
      thumbstopRate: 78.9,
    },
  ],
  'adset-7': [
    {
      id: 'cr-7',
      name: 'Brand Story - Long Form',
      adsetId: 'adset-7',
      type: 'video',
      status: 'active',
      spend: 570,
      revenue: 1812.75,
      roas: 3.18,
      conversions: 22,
      cac: 25.91,
      impressions: 53765,
      clicks: 1176,
      ctr: 2.19,
      cpc: 0.48,
      copy: 'A história por trás da nossa marca',
      videoCompletionRate: 34.5,
      thumbstopRate: 19.2,
    },
  ],
}

export function CreativeView({ platform, campaign, adset, onBack }: CreativeViewProps) {
  const creatives = MOCK_CREATIVES[adset.id] || []

  const columns: Column[] = [
    { key: 'name', label: 'Criativo', width: '20%' },
    { key: 'type', label: 'Tipo', width: '10%' },
    { key: 'status', label: 'Status', width: '10%' },
    { key: 'spend', label: 'Gasto (€)', width: '10%', format: 'currency' },
    { key: 'revenue', label: 'Receita (€)', width: '12%', format: 'currency' },
    { key: 'roas', label: 'ROAS', width: '8%', format: 'decimal' },
    { key: 'conversions', label: 'Conversões', width: '10%', format: 'number' },
    { key: 'ctr', label: 'CTR (%)', width: '8%', format: 'percent' },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {adset.name}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{creatives.length} criativos</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ← Voltar
        </button>
      </div>

      {/* Creatives Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <MetricsTable
          columns={columns}
          data={creatives}
          onRowClick={() => {}}
          rowKey="id"
        />
      </div>

      {/* Creative Details - Expandable cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {creatives.map((creative) => (
          <div key={creative.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-900">{creative.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {creative.type.toUpperCase()} • {creative.status}
                </p>
              </div>
            </div>

            {creative.copy && (
              <p className="text-sm text-gray-700 mb-3 italic bg-gray-50 p-2 rounded">
                "{creative.copy}"
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">ROAS</p>
                <p className="font-bold text-gray-900">{creative.roas.toFixed(2)}x</p>
              </div>
              <div>
                <p className="text-gray-600">CAC</p>
                <p className="font-bold text-gray-900">€{creative.cac.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">CTR</p>
                <p className="font-bold text-gray-900">{creative.ctr.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-gray-600">Conversões</p>
                <p className="font-bold text-gray-900">{creative.conversions}</p>
              </div>

              {creative.videoCompletionRate && (
                <div>
                  <p className="text-gray-600">Video Completion</p>
                  <p className="font-bold text-gray-900">{creative.videoCompletionRate.toFixed(1)}%</p>
                </div>
              )}

              {creative.thumbstopRate && (
                <div>
                  <p className="text-gray-600">Thumbstop Rate</p>
                  <p className="font-bold text-gray-900">{creative.thumbstopRate.toFixed(1)}%</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
