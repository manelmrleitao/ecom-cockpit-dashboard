/**
 * TikTok Ads Metrics API Route
 * Fetches campaigns, spend, clicks, and conversions from TikTok Ads
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPeriodDateRange } from '@/lib/utils/date-helpers'
import { MOCK_30_DAYS_DATA } from '@/lib/mock-data'

interface TikTokAdsMetrics {
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
  const accessToken = process.env.TIKTOK_ADS_ACCESS_TOKEN
  const businessCentralId = process.env.TIKTOK_ADS_BUSINESS_CENTRAL_ID
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'last30'

  // Check if credentials are configured
  if (!accessToken || !businessCentralId) {
    // Return mock data for demo/development
    const mockData = MOCK_30_DAYS_DATA.tiktokAds.daily
    const totalSpend = mockData.reduce((sum, d) => sum + d.spend, 0)
    const totalImpressions = mockData.reduce((sum, d) => sum + d.impressions, 0)
    const totalClicks = mockData.reduce((sum, d) => sum + d.clicks, 0)
    const totalConversions = mockData.reduce((sum, d) => sum + d.conversions, 0)
    const totalConversionValue = mockData.reduce((sum, d) => sum + d.conversionValue, 0)

    const mockMetrics: TikTokAdsMetrics = {
      campaigns: 5, // Mocked number of campaigns
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

    // TikTok Ads API integration would go here
    // For now, we return mock data as well
    const mockData = MOCK_30_DAYS_DATA.tiktokAds.daily
    const totalSpend = mockData.reduce((sum, d) => sum + d.spend, 0)
    const totalImpressions = mockData.reduce((sum, d) => sum + d.impressions, 0)
    const totalClicks = mockData.reduce((sum, d) => sum + d.clicks, 0)
    const totalConversions = mockData.reduce((sum, d) => sum + d.conversions, 0)
    const totalConversionValue = mockData.reduce((sum, d) => sum + d.conversionValue, 0)

    const metrics: TikTokAdsMetrics = {
      campaigns: 5,
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

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('TikTok metrics error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to fetch TikTok metrics',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}
