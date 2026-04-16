/**
 * Analytics Page - Detailed Campaign Analysis
 * Shows campaign treemap and performance metrics with platform filtering
 */

import { AnalyticsClient } from '@/components/analytics/AnalyticsClient'
import type { DashboardKPIs } from '@/types'

async function fetchAnalyticsData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
    const url = `${baseUrl}/api/dashboard/kpis`
    console.log('[Analytics] Fetching data from:', url)

    const response = await fetch(url, {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('[Analytics] Failed to fetch:', response.status)
      return null
    }

    const json = await response.json()
    return json.data || null
  } catch (error) {
    console.error('[Analytics] Error:', error)
    return null
  }
}

const MOCK_DATA: DashboardKPIs = {
  byPlatform: {
    'google-ads': {
      platform: 'google-ads',
      spend: 250.00,
      revenue: 350.00,
      roas: 1.40,
      conversions: 8,
      cpa: 31.25,
      impressions: 12543,
      clicks: 325,
      ctr: 2.59,
    },
    'meta-ads': {
      platform: 'meta-ads',
      spend: 180.00,
      revenue: 280.00,
      roas: 1.56,
      conversions: 5,
      cpa: 36.00,
      impressions: 9876,
      clicks: 215,
      ctr: 2.18,
    },
    'tiktok-ads': {
      platform: 'tiktok-ads',
      spend: 120.00,
      revenue: 240.00,
      roas: 2.00,
      conversions: 4,
      cpa: 30.00,
      impressions: 28765,
      clicks: 489,
      ctr: 1.70,
    },
    pinterest: {
      platform: 'pinterest',
      spend: 90.00,
      revenue: 139.00,
      roas: 1.54,
      conversions: 3,
      cpa: 30.00,
      impressions: 9843,
      clicks: 186,
      ctr: 1.89,
    },
    organic: {
      platform: 'organic',
      spend: 0.00,
      revenue: 1109.00,
      roas: 0,
      conversions: 21,
      cpa: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
    },
    outros: {
      platform: 'outros',
      spend: 0.00,
      revenue: 0.00,
      roas: 0,
      conversions: 0,
      cpa: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
    },
  },
  dataSources: {
    shopify: false,
    googleAds: false,
    metaAds: false,
  },
}

export default async function AnalyticsPage() {
  const data = await fetchAnalyticsData()
  const isMock = !data
  const dashboardData = data || MOCK_DATA

  return <AnalyticsClient kpisByPlatform={dashboardData.byPlatform} isMock={isMock} />
}
