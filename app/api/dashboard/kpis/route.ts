/**
 * Dashboard KPIs Aggregation API Route
 * Fetches data from Shopify + Google Ads and returns DashboardKPIs format
 * All currencies converted to EUR
 */

import { NextRequest, NextResponse } from 'next/server'
import type { DashboardKPIs, PlatformKPIs } from '@/types'

// Exchange rate: USD to EUR (approximate)
const USD_TO_EUR = 0.92

interface ShopifyMetrics {
  orders: number
  revenue: number
  averageOrderValue: number
  uniqueCustomers: number
  currency: string
  isMock: boolean
}

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
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'last30'

    // Fetch data from all sources in parallel
    const [shopifyRes, googleAdsRes, metaAdsRes] = await Promise.allSettled([
      fetch(`${baseUrl}/api/shopify/metrics?period=${period}`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/google-ads/metrics?period=${period}`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/meta-ads/metrics?period=${period}`, { cache: 'no-store' }),
    ])

    // Extract data with proper null handling and error detection
    let shopifyData: ShopifyMetrics | null = null
    let googleAdsData: GoogleAdsMetrics | null = null
    let metaAdsData: MetaAdsMetrics | null = null
    let shopifyAvailable = false
    let googleAdsAvailable = false
    let metaAdsAvailable = false
    const errors: Record<string, string> = {}

    if (shopifyRes.status === 'fulfilled' && shopifyRes.value.ok) {
      const data = await shopifyRes.value.json()
      console.log('[Dashboard KPIs] Shopify response:', { revenue: data.revenue, orders: data.orders, currency: data.currency })
      // Check if response contains an error
      if (data && 'error' in data) {
        errors.shopify = (data as { message: string }).message || 'Failed to fetch Shopify metrics'
        console.error('[Dashboard KPIs] Shopify error:', errors.shopify)
      } else if (data) {
        shopifyData = data
        shopifyAvailable = true
      }
    } else if (shopifyRes.status === 'rejected') {
      errors.shopify = 'Request to Shopify API failed'
      console.error('[Dashboard KPIs] Shopify request rejected:', errors.shopify)
    }

    if (googleAdsRes.status === 'fulfilled' && googleAdsRes.value.ok) {
      const data = await googleAdsRes.value.json()
      // Check if response contains an error
      if (data && 'error' in data) {
        errors.googleAds = (data as { message: string }).message || 'Failed to fetch Google Ads metrics'
      } else if (data) {
        googleAdsData = data
        googleAdsAvailable = true
      }
    } else if (googleAdsRes.status === 'rejected') {
      errors.googleAds = 'Request to Google Ads API failed'
    }

    if (metaAdsRes.status === 'fulfilled' && metaAdsRes.value.ok) {
      const data = await metaAdsRes.value.json()
      // Check if response contains an error
      if (data && 'error' in data) {
        errors.metaAds = (data as { message: string }).message || 'Failed to fetch Meta Ads metrics'
      } else if (data) {
        metaAdsData = data
        metaAdsAvailable = true
      }
    } else if (metaAdsRes.status === 'rejected') {
      errors.metaAds = 'Request to Meta Ads API failed'
    }

    // Build byPlatform object
    const byPlatform: Record<string, PlatformKPIs> = {}

    // Google Ads Platform (convert USD to EUR if needed)
    if (googleAdsData) {
      const googleSpendEur = googleAdsData.currency === 'USD' ? googleAdsData.spend * USD_TO_EUR : googleAdsData.spend
      const googleRevenueEur = googleAdsData.currency === 'USD' ? googleAdsData.conversionValue * USD_TO_EUR : googleAdsData.conversionValue
      byPlatform['google-ads'] = {
        platform: 'google-ads',
        spend: googleSpendEur,
        revenue: googleRevenueEur,
        roas: googleRevenueEur > 0 && googleSpendEur > 0 ? googleRevenueEur / googleSpendEur : 0,
        conversions: googleAdsData.conversions,
        cpa: googleAdsData.conversions > 0 ? googleSpendEur / googleAdsData.conversions : 0,
        impressions: googleAdsData.impressions,
        clicks: googleAdsData.clicks,
        ctr: googleAdsData.impressions > 0 ? (googleAdsData.clicks / googleAdsData.impressions) * 100 : 0,
      }
    }

    // Organic (from Shopify)
    if (shopifyData) {
      byPlatform['organic'] = {
        platform: 'organic',
        spend: 0,
        revenue: shopifyData.revenue,
        roas: 0,
        conversions: shopifyData.orders,
        cpa: 0,
        impressions: 0,
        clicks: 0,
        ctr: 0,
      }
    }

    // Meta Ads Platform (convert USD to EUR)
    if (metaAdsData) {
      const metaSpendEur = metaAdsData.spend * USD_TO_EUR
      const metaRevenueEur = metaAdsData.conversionValue * USD_TO_EUR
      byPlatform['meta-ads'] = {
        platform: 'meta-ads',
        spend: metaSpendEur,
        revenue: metaRevenueEur,
        roas: metaRevenueEur > 0 && metaSpendEur > 0 ? metaRevenueEur / metaSpendEur : 0,
        conversions: metaAdsData.conversions,
        cpa: metaAdsData.conversions > 0 ? metaSpendEur / metaAdsData.conversions : 0,
        impressions: metaAdsData.impressions,
        clicks: metaAdsData.clicks,
        ctr: metaAdsData.impressions > 0 ? (metaAdsData.clicks / metaAdsData.impressions) * 100 : 0,
      }
    }

    const dashboardKPIs: DashboardKPIs = {
      byPlatform,
      dataSources: {
        shopify: shopifyAvailable,
        googleAds: googleAdsAvailable,
        metaAds: metaAdsAvailable,
      },
    }

    const hasErrors = Object.keys(errors).length > 0

    return NextResponse.json({
      success: !hasErrors,
      data: dashboardKPIs,
      timestamp: new Date().toISOString(),
      ...(hasErrors && { errors }),
    })
  } catch (error) {
    console.error('Dashboard KPIs error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard KPIs',
        message: errorMessage,
        data: null,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
