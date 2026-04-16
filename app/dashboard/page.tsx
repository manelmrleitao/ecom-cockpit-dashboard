/**
 * Dashboard Home Page - Cockpit Command Center (Server Component)
 * Fetches real data from APIs, passes to client component
 */

import { DashboardClient } from '@/components/dashboard/DashboardClient'
import type { DashboardKPIs } from '@/types'

interface FetchedDashboardData {
  data: DashboardKPIs | null
  errors?: Record<string, string>
  dataSources?: { shopify: boolean; googleAds: boolean; metaAds: boolean }
  success?: boolean
}

async function fetchDashboardData(): Promise<FetchedDashboardData> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
    const url = `${baseUrl}/api/dashboard/kpis`
    console.log('[Dashboard] Fetching KPIs from:', url)

    const response = await fetch(url, {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('[Dashboard] Failed to fetch dashboard KPIs:', response.status)
      return { data: null }
    }

    const json = await response.json()
    console.log('[Dashboard] KPIs response:', {
      success: json.success,
      hasData: !!json.data?.byPlatform,
      errors: json.errors
    })

    return {
      data: json.data || null,
      errors: json.errors,
      dataSources: json.data?.dataSources,
      success: json.success,
    }
  } catch (error) {
    console.error('[Dashboard] Error fetching dashboard data:', error)
    return { data: null }
  }
}

const MOCK_DASHBOARD_DATA: DashboardKPIs = {
  byPlatform: {
    'google-ads': {
      platform: 'google-ads',
      spend: 0,
      revenue: 0,
      roas: 0,
      conversions: 0,
      cpa: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
    },
    'meta-ads': {
      platform: 'meta-ads',
      spend: 0,
      revenue: 0,
      roas: 0,
      conversions: 0,
      cpa: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
    },
    'tiktok-ads': {
      platform: 'tiktok-ads',
      spend: 0,
      revenue: 0,
      roas: 0,
      conversions: 0,
      cpa: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
    },
    pinterest: {
      platform: 'pinterest',
      spend: 0,
      revenue: 0,
      roas: 0,
      conversions: 0,
      cpa: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
    },
    organic: {
      platform: 'organic',
      spend: 0,
      revenue: 0,
      roas: 0,
      conversions: 0,
      cpa: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
    },
    outros: {
      platform: 'outros',
      spend: 0,
      revenue: 0,
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

export default async function DashboardPage() {
  const response = await fetchDashboardData()
  const hasErrors = response.errors && Object.keys(response.errors).length > 0

  const dashboardData = response.data || MOCK_DASHBOARD_DATA

  return (
    <DashboardClient
      kpisByPlatform={dashboardData.byPlatform}
      isMock={!response.data}
      errors={response.errors}
      dataSources={response.dataSources}
    />
  )
}
