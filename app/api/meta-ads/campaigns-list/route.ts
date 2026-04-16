/**
 * Meta Ads Campaigns List - Simple Version
 * Retorna apenas campanhas com métricas básicas (sem adsets/ads)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPeriodDateRange } from '@/lib/utils/date-helpers'

interface CampaignMetrics {
  id: string
  name: string
  spend: number
  clicks: number
  impressions: number
  conversions: number
  revenue: number
  roas: number
  ctr: number
  cpa: number
}

export async function GET(request: NextRequest) {
  const accountId = process.env.META_ADS_ACCOUNT_ID
  const accessToken = process.env.META_ADS_ACCESS_TOKEN
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'last30'

  if (!accountId || !accessToken) {
    return NextResponse.json(
      { error: 'Meta Ads credentials not configured' },
      { status: 503 }
    )
  }

  try {
    const { startDate, endDate } = getPeriodDateRange(period)

    const params = new URLSearchParams({
      fields: `id,name,insights.time_range({"since":"${startDate}","until":"${endDate}"}){impressions,clicks,spend,actions,action_values}`,
      access_token: accessToken,
      limit: '100',
    })

    const response = await fetch(
      `https://graph.facebook.com/v18.0/act_${accountId.replace('act_', '')}/campaigns?${params.toString()}`,
      { method: 'GET' }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Meta API error: ${errorData.error?.message}`)
    }

    const data = await response.json()

    if (!data.data) {
      throw new Error('No campaign data returned')
    }

    // Parse campaigns with metrics
    const campaigns: CampaignMetrics[] = data.data.map((campaign: any) => {
      const insight = campaign.insights?.data?.[0] || {}

      const spend = parseFloat(insight.spend || 0)
      const clicks = parseInt(insight.clicks || 0)
      const impressions = parseInt(insight.impressions || 0)

      const conversions = (insight.actions || [])
        .filter((a: any) => a.action_type === 'purchase')
        .reduce((sum: number, a: any) => sum + parseInt(a.value || 0), 0)

      const revenue = (insight.action_values || [])
        .filter((a: any) => a.action_type === 'purchase')
        .reduce((sum: number, a: any) => sum + parseFloat(a.value || 0), 0)

      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0
      const roas = spend > 0 ? revenue / spend : 0
      const cpa = conversions > 0 ? spend / conversions : 0

      return {
        id: campaign.id,
        name: campaign.name || 'Unnamed Campaign',
        spend: Math.round(spend * 100) / 100,
        clicks,
        impressions,
        conversions: Math.round(conversions),
        revenue: Math.round(revenue * 100) / 100,
        roas: Math.round(roas * 100) / 100,
        ctr: Math.round(ctr * 100) / 100,
        cpa: Math.round(cpa * 100) / 100,
      }
    })

    // Sort by spend descending
    campaigns.sort((a, b) => b.spend - a.spend)

    return NextResponse.json({
      campaigns,
      period,
      topCampaign: campaigns[0] || null,
      total: campaigns.length,
    })
  } catch (error) {
    console.error('Meta Ads campaigns-list error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to fetch campaigns',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}
