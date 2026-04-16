'use client'

/**
 * CampaignView - Shows all campaigns for a platform
 */

import { MetricsTable, type Column } from './MetricsTable'
import type { Platform, Campaign } from './types'

interface CampaignViewProps {
  platform: Platform
  onSelectCampaign: (campaign: Campaign) => void
  onBack: () => void
}

// Mock data - replace with API call
const MOCK_CAMPAIGNS: Record<string, Campaign[]> = {
  'google-ads': [
    {
      id: 'camp-1',
      name: 'Search - Product Launch',
      platform: 'google-ads',
      status: 'active',
      spend: 1200,
      revenue: 5400,
      roas: 4.5,
      conversions: 45,
      cac: 26.67,
      impressions: 45000,
      clicks: 1800,
      ctr: 4.0,
    },
    {
      id: 'camp-2',
      name: 'Shopping - Best Sellers',
      platform: 'google-ads',
      status: 'active',
      spend: 650,
      revenue: 3020,
      roas: 4.65,
      conversions: 34,
      cac: 19.12,
      impressions: 80430,
      clicks: 1454,
      ctr: 1.81,
    },
  ],
  'meta-ads': [
    {
      id: 'camp-3',
      name: 'Retargeting - Cart Abandoned',
      platform: 'meta-ads',
      status: 'active',
      spend: 750,
      revenue: 3200,
      roas: 4.27,
      conversions: 32,
      cac: 23.44,
      impressions: 45000,
      clicks: 980,
      ctr: 2.18,
    },
    {
      id: 'camp-4',
      name: 'Brand Awareness - Video',
      platform: 'meta-ads',
      status: 'active',
      spend: 570,
      revenue: 1812.75,
      roas: 3.18,
      conversions: 22,
      cac: 25.91,
      impressions: 53765,
      clicks: 1176,
      ctr: 2.19,
    },
  ],
  'tiktok-ads': [
    {
      id: 'camp-5',
      name: 'UGC Creators - Feed',
      platform: 'tiktok-ads',
      status: 'active',
      spend: 450,
      revenue: 2414.25,
      roas: 5.37,
      conversions: 21,
      cac: 21.43,
      impressions: 287654,
      clicks: 4890,
      ctr: 1.7,
    },
  ],
  pinterest: [
    {
      id: 'camp-6',
      name: 'Pinterest - Lifestyle',
      platform: 'pinterest',
      status: 'active',
      spend: 380,
      revenue: 1850,
      roas: 4.87,
      conversions: 18,
      cac: 21.11,
      impressions: 98432,
      clicks: 1856,
      ctr: 1.89,
    },
  ],
}

export function CampaignView({ platform, onSelectCampaign, onBack }: CampaignViewProps) {
  const campaigns = MOCK_CAMPAIGNS[platform.id] || []

  const columns: Column[] = [
    { key: 'name', label: 'Campanha', width: '25%' },
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
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span>{platform.icon}</span>
            {platform.name}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{campaigns.length} campanhas ativas</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ← Voltar
        </button>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <MetricsTable
          columns={columns}
          data={campaigns}
          onRowClick={onSelectCampaign}
          rowKey="id"
        />
      </div>
    </div>
  )
}
