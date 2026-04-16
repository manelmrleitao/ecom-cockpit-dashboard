/**
 * Dashboard Data Sources - Shows data attribution per platform
 * Helps verify that data is coming from the correct source
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPeriodDateRange } from '@/lib/utils/date-helpers'

interface DataSource {
  name: string
  type: 'paid' | 'organic' | 'direct'
  spend: number
  revenue: number
  roas: number
  conversions: number
  cpa: number
  impressions: number
  clicks: number
  ctr: number
  lastUpdated: string
  status: 'success' | 'error' | 'pending'
  message?: string
}

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'last30'

    const USD_TO_EUR = 0.92

    // Fetch all data sources in parallel
    const [shopifyRes, googleAdsRes, metaAdsRes, tiktokRes] = await Promise.allSettled([
      fetch(`${baseUrl}/api/shopify/metrics?period=${period}`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/google-ads/metrics?period=${period}`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/meta-ads/metrics?period=${period}`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/tiktok-ads/metrics?period=${period}`, { cache: 'no-store' }).catch(() => ({ ok: false })),
    ])

    const dataSources: DataSource[] = []

    // SHOPIFY (Organic/Direct)
    if (shopifyRes.status === 'fulfilled' && shopifyRes.value.ok) {
      const data = await shopifyRes.value.json()
      if (!data.error && data.revenue !== undefined) {
        dataSources.push({
          name: 'Shopify',
          type: 'organic',
          spend: 0,
          revenue: data.revenue,
          roas: 0,
          conversions: data.orders,
          cpa: 0,
          impressions: 0,
          clicks: 0,
          ctr: 0,
          lastUpdated: new Date().toISOString(),
          status: 'success',
        })
      } else {
        dataSources.push({
          name: 'Shopify',
          type: 'organic',
          spend: 0,
          revenue: 0,
          roas: 0,
          conversions: 0,
          cpa: 0,
          impressions: 0,
          clicks: 0,
          ctr: 0,
          lastUpdated: new Date().toISOString(),
          status: 'error',
          message: data.error || 'No data',
        })
      }
    }

    // GOOGLE ADS (Paid)
    if (googleAdsRes.status === 'fulfilled' && googleAdsRes.value.ok) {
      const data = await googleAdsRes.value.json()
      if (!data.error && data.spend !== undefined) {
        const spendEur = (data.currency === 'USD' ? data.spend * USD_TO_EUR : data.spend)
        const revenueEur = (data.currency === 'USD' ? data.conversionValue * USD_TO_EUR : data.conversionValue)
        dataSources.push({
          name: 'Google Ads',
          type: 'paid',
          spend: spendEur,
          revenue: revenueEur,
          roas: revenueEur > 0 && spendEur > 0 ? revenueEur / spendEur : 0,
          conversions: data.conversions,
          cpa: data.conversions > 0 ? spendEur / data.conversions : 0,
          impressions: data.impressions,
          clicks: data.clicks,
          ctr: data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0,
          lastUpdated: new Date().toISOString(),
          status: 'success',
        })
      } else {
        dataSources.push({
          name: 'Google Ads',
          type: 'paid',
          spend: 0,
          revenue: 0,
          roas: 0,
          conversions: 0,
          cpa: 0,
          impressions: 0,
          clicks: 0,
          ctr: 0,
          lastUpdated: new Date().toISOString(),
          status: 'error',
          message: data.error || 'Not configured',
        })
      }
    }

    // META ADS (Paid)
    if (metaAdsRes.status === 'fulfilled' && metaAdsRes.value.ok) {
      const data = await metaAdsRes.value.json()
      if (!data.error && data.spend !== undefined) {
        const spendEur = data.spend * USD_TO_EUR
        const revenueEur = data.conversionValue * USD_TO_EUR
        dataSources.push({
          name: 'Meta Ads',
          type: 'paid',
          spend: spendEur,
          revenue: revenueEur,
          roas: revenueEur > 0 && spendEur > 0 ? revenueEur / spendEur : 0,
          conversions: data.conversions,
          cpa: data.conversions > 0 ? spendEur / data.conversions : 0,
          impressions: data.impressions,
          clicks: data.clicks,
          ctr: data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0,
          lastUpdated: new Date().toISOString(),
          status: 'success',
        })
      } else {
        dataSources.push({
          name: 'Meta Ads',
          type: 'paid',
          spend: 0,
          revenue: 0,
          roas: 0,
          conversions: 0,
          cpa: 0,
          impressions: 0,
          clicks: 0,
          ctr: 0,
          lastUpdated: new Date().toISOString(),
          status: 'error',
          message: data.error || 'Not configured',
        })
      }
    }

    // TIKTOK ADS (Paid) - Optional
    dataSources.push({
      name: 'TikTok Ads',
      type: 'paid',
      spend: 0,
      revenue: 0,
      roas: 0,
      conversions: 0,
      cpa: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      lastUpdated: new Date().toISOString(),
      status: 'pending',
      message: 'Not configured',
    })

    return NextResponse.json({
      period,
      dataSources,
      timestamp: new Date().toISOString(),
      totalRevenue: dataSources.reduce((sum, ds) => sum + ds.revenue, 0),
      totalSpend: dataSources.reduce((sum, ds) => sum + ds.spend, 0),
      totalConversions: dataSources.reduce((sum, ds) => sum + ds.conversions, 0),
    })
  } catch (error) {
    console.error('Dashboard data-sources error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to fetch data sources',
        message: errorMessage,
        dataSources: [],
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
