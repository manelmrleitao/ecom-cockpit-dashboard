/**
 * Google Ads Metrics API Route
 * Fetches campaigns, spend, clicks, and conversions from Google Ads
 */

import { NextRequest, NextResponse } from 'next/server'
import { refreshGoogleAccessToken } from '@/lib/utils/google-auth'
import { getPeriodDateRange } from '@/lib/utils/date-helpers'
import { GoogleAdsClient } from '@/lib/api-clients/google-ads'
import { MOCK_30_DAYS_DATA } from '@/lib/mock-data'

interface GoogleAdsMetrics {
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
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'last30'

  // Check if credentials are configured
  if (!customerId || !developerToken || !clientId || !clientSecret || !refreshToken) {
    // Return mock data for demo/development
    const mockData = MOCK_30_DAYS_DATA.googleAds.daily
    const totalSpend = mockData.reduce((sum, d) => sum + d.spend, 0)
    const totalImpressions = mockData.reduce((sum, d) => sum + d.impressions, 0)
    const totalClicks = mockData.reduce((sum, d) => sum + d.clicks, 0)
    const totalConversions = mockData.reduce((sum, d) => sum + d.conversions, 0)
    const totalConversionValue = mockData.reduce((sum, d) => sum + d.conversionValue, 0)

    const mockMetrics: GoogleAdsMetrics = {
      campaigns: 8, // Mocked number of campaigns
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
    // Get access token
    const accessToken = await refreshGoogleAccessToken()

    // Initialize Google Ads client
    const client = new GoogleAdsClient(customerId, refreshToken, accessToken)

    // Get date range
    const { startDate, endDate } = getPeriodDateRange(period)

    // Fetch campaign metrics
    const metrics = await client.getCampaignMetrics(startDate, endDate)

    // Aggregate metrics
    const aggregated = {
      campaigns: new Set(metrics.map(m => m.id)).size,
      spend: metrics.reduce((sum, m) => sum + (m.spend || 0), 0),
      clicks: metrics.reduce((sum, m) => sum + (m.clicks || 0), 0),
      impressions: metrics.reduce((sum, m) => sum + (m.impressions || 0), 0),
      conversions: metrics.reduce((sum, m) => sum + (m.conversions || 0), 0),
      conversionValue: metrics.reduce((sum, m) => sum + (m.revenue || 0), 0),
    }

    const googleAdsMetrics: GoogleAdsMetrics = {
      campaigns: aggregated.campaigns,
      spend: Math.round(aggregated.spend * 100) / 100,
      clicks: aggregated.clicks,
      impressions: aggregated.impressions,
      conversions: Math.round(aggregated.conversions),
      conversionValue: Math.round(aggregated.conversionValue * 100) / 100,
      cpc: aggregated.clicks > 0 ? Math.round((aggregated.spend / aggregated.clicks) * 100) / 100 : 0,
      roas: aggregated.spend > 0 ? Math.round((aggregated.conversionValue / aggregated.spend) * 100) / 100 : 0,
      currency: 'USD',
      isMock: false,
    }

    return NextResponse.json(googleAdsMetrics)
  } catch (error) {
    console.error('Google Ads metrics error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to fetch Google Ads metrics',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}
