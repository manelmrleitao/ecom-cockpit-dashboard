'use client'

/**
 * AdsetView - Shows all adsets for a campaign
 */

import { MetricsTable, type Column } from './MetricsTable'
import type { Platform, Campaign, Adset } from './types'

interface AdsetViewProps {
  platform: Platform
  campaign: Campaign
  onSelectAdset: (adset: Adset) => void
  onBack: () => void
}

// Mock data - replace with API call
const MOCK_ADSETS: Record<string, Adset[]> = {
  'camp-1': [
    {
      id: 'adset-1',
      name: 'Age 25-34 - Desktop',
      campaignId: 'camp-1',
      status: 'active',
      spend: 600,
      revenue: 2700,
      roas: 4.5,
      conversions: 22,
      cac: 27.27,
      impressions: 22500,
      clicks: 900,
      ctr: 4.0,
      cpc: 0.67,
    },
    {
      id: 'adset-2',
      name: 'Age 35-44 - Mobile',
      campaignId: 'camp-1',
      status: 'active',
      spend: 600,
      revenue: 2700,
      roas: 4.5,
      conversions: 23,
      cac: 26.09,
      impressions: 22500,
      clicks: 900,
      ctr: 4.0,
      cpc: 0.67,
    },
  ],
  'camp-2': [
    {
      id: 'adset-3',
      name: 'Shopping - Clothing',
      campaignId: 'camp-2',
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
    {
      id: 'adset-4',
      name: 'Shopping - Accessories',
      campaignId: 'camp-2',
      status: 'active',
      spend: 320,
      revenue: 1480,
      roas: 4.63,
      conversions: 16,
      cac: 20.0,
      impressions: 40215,
      clicks: 724,
      ctr: 1.8,
      cpc: 0.44,
    },
  ],
  'camp-3': [
    {
      id: 'adset-5',
      name: 'Retargeting - Video - 3sec+',
      campaignId: 'camp-3',
      status: 'active',
      spend: 450,
      revenue: 1920,
      roas: 4.27,
      conversions: 19,
      cac: 23.68,
      impressions: 22500,
      clicks: 590,
      ctr: 2.62,
      cpc: 0.76,
      videoCompletionRate: 45.2,
    },
    {
      id: 'adset-6',
      name: 'Retargeting - Carousel',
      campaignId: 'camp-3',
      status: 'active',
      spend: 300,
      revenue: 1280,
      roas: 4.27,
      conversions: 13,
      cac: 23.08,
      impressions: 22500,
      clicks: 390,
      ctr: 1.73,
      cpc: 0.77,
    },
  ],
  'camp-4': [
    {
      id: 'adset-7',
      name: 'Brand Video - Interests',
      campaignId: 'camp-4',
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
      videoCompletionRate: 32.1,
      thumbstopRate: 18.5,
    },
  ],
  'camp-5': [
    {
      id: 'adset-8',
      name: 'Creator Content #1',
      campaignId: 'camp-5',
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
      videoCompletionRate: 68.2,
      thumbstopRate: 72.1,
    },
  ],
  'camp-6': [
    {
      id: 'adset-9',
      name: 'Lifestyle - DIY',
      campaignId: 'camp-6',
      status: 'active',
      spend: 380,
      revenue: 1850,
      roas: 4.87,
      conversions: 18,
      cac: 21.11,
      impressions: 98432,
      clicks: 1856,
      ctr: 1.89,
      cpc: 0.205,
    },
  ],
}

export function AdsetView({ platform, campaign, onSelectAdset, onBack }: AdsetViewProps) {
  const adsets = MOCK_ADSETS[campaign.id] || []

  const columns: Column[] = [
    { key: 'name', label: 'Adset', width: '25%' },
    { key: 'status', label: 'Status', width: '10%' },
    { key: 'spend', label: 'Gasto (€)', width: '10%', format: 'currency' },
    { key: 'revenue', label: 'Receita (€)', width: '12%', format: 'currency' },
    { key: 'roas', label: 'ROAS', width: '8%', format: 'decimal' },
    { key: 'conversions', label: 'Conversões', width: '10%', format: 'number' },
    { key: 'cac', label: 'CAC (€)', width: '10%', format: 'currency' },
    { key: 'ctr', label: 'CTR (%)', width: '8%', format: 'percent' },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {campaign.name}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{adsets.length} adsets</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ← Voltar
        </button>
      </div>

      {/* Adsets Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <MetricsTable
          columns={columns}
          data={adsets}
          onRowClick={onSelectAdset}
          rowKey="id"
        />
      </div>
    </div>
  )
}
