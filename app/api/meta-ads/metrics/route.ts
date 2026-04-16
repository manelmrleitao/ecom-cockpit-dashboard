/**
 * Meta Ads Metrics API Route
 * Fetches campaigns, spend, clicks, and conversions from Meta Ads
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPeriodDateRange } from '@/lib/utils/date-helpers'
import { MOCK_30_DAYS_DATA } from '@/lib/mock-data'

interface MetaAdsMetrics {
  campaigns: number
  spend: number
  clicks: number
  impressions: number
  conversions: number
  conversionValue: number
  cpc: number
  roas: number
  currency: string
  isMock: boolean
}

export async function GET(request: NextRequest) {
  const accountId = process.env.META_ADS_ACCOUNT_ID
  const accessToken = process.env.META_ADS_ACCESS_TOKEN
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'last30'

  // Check if credentials are configured
  if (!accountId || !accessToken) {
    // Return mock data for demo/development
    const mockData = MOCK_30_DAYS_DATA.metaAds.daily
    const totalSpend = mockData.reduce((sum, d) => sum + d.spend, 0)
    const totalImpressions = mockData.reduce((sum, d) => sum + d.impressions, 0)
    const totalClicks = mockData.reduce((sum, d) => sum + d.clicks, 0)
    const totalConversions = mockData.reduce((sum, d) => sum + d.conversions, 0)
    const totalConversionValue = mockData.reduce((sum, d) => sum + d.conversionValue, 0)

    const mockMetrics: MetaAdsMetrics = {
      campaigns: 12, // Mocked number of campaigns
      spend: Math.round(totalSpend * 100) / 100,
      clicks: totalClicks,
      impressions: totalImpressions,
      conversions: totalConversions,
      conversionValue: Math.round(totalConversionValue * 100) / 100,
      cpc: Math.round((totalSpend / totalClicks) * 100) / 100,
      roas: Math.round((totalConversionValue / totalSpend) * 100) / 100,
      currency: 'USD',
      isMock: true,
    }

    return NextResponse.json(mockMetrics)
  }

  try {
    const { startDate, endDate } = getPeriodDateRange(period)

    // Dates are already formatted as YYYY-MM-DD from getLast30Days()
    const startDateStr = startDate
    const endDateStr = endDate

    // Fetch campaign insights from Meta API
    const params = new URLSearchParams({
      fields:
        'id,name,insights.time_range({"since":"' +
        startDateStr +
        '","until":"' +
        endDateStr +
        '"}){impressions,clicks,spend,actions,action_values}',
      access_token: accessToken,
    })

    const response = await fetch(
      `https://graph.facebook.com/v18.0/act_${accountId.replace('act_', '')}/campaigns?${params.toString()}`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Meta API error: ${errorData.error?.message || response.statusText}`
      )
    }

    const data = await response.json()

    if (!data.data) {
      throw new Error('No campaign data returned from Meta API')
    }

    // Parse campaign metrics
    let totalSpend = 0
    let totalClicks = 0
    let totalImpressions = 0
    let totalConversions = 0
    let totalConversionValue = 0
    const campaignCount = data.data.length

    data.data.forEach((campaign: any) => {
      const insight = campaign.insights?.data?.[0] || {}

      totalSpend += parseFloat(insight.spend || 0)
      totalClicks += parseInt(insight.clicks || 0)
      totalImpressions += parseInt(insight.impressions || 0)

      // Extract purchase conversions from actions array (count number of conversions)
      const conversions = (insight.actions || [])
        .filter((action: any) => action.action_type === 'purchase')
        .reduce((sum: number, action: any) => sum + parseInt(action.value || 0), 0)
      totalConversions += conversions

      // Extract purchase value
      const conversionValue = (insight.action_values || [])
        .filter((action: any) => action.action_type === 'purchase')
        .reduce((sum: number, action: any) => sum + parseFloat(action.value || 0), 0)
      totalConversionValue += conversionValue
    })

    const metrics: MetaAdsMetrics = {
      campaigns: campaignCount,
      spend: Math.round(totalSpend * 100) / 100,
      clicks: totalClicks,
      impressions: totalImpressions,
      conversions: Math.round(totalConversions),
      conversionValue: Math.round(totalConversionValue * 100) / 100,
      cpc: totalClicks > 0 ? Math.round((totalSpend / totalClicks) * 100) / 100 : 0,
      roas: totalSpend > 0 ? Math.round((totalConversionValue / totalSpend) * 100) / 100 : 0,
      currency: 'USD',
      isMock: false,
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Meta Ads metrics error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to fetch Meta Ads metrics',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}
