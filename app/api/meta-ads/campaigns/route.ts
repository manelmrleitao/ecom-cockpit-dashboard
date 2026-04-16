/**
 * Meta Ads Campaign Hierarchy API Route
 * Fetches complete hierarchy: Campaigns → Adsets → Ads/Creatives
 * with full metrics and insights from Meta Marketing API
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPeriodDateRange } from '@/lib/utils/date-helpers'

interface MetaInsights {
  impressions: number
  clicks: number
  spend: number
  conversions: number
  revenue: number
  roas: number
  ctr: number
  cpa: number
}

interface AdNode {
  id: string
  name: string
  status: string
  thumbnail?: string
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  spend: number
  revenue: number
  roas: number
  cpa: number
}

interface AdsetNode {
  id: string
  name: string
  status: string
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  spend: number
  revenue: number
  roas: number
  cpa: number
  ads: AdNode[]
}

interface CampaignNode {
  id: string
  name: string
  status: string
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  spend: number
  revenue: number
  roas: number
  cpa: number
  adsets: AdsetNode[]
}

interface CampaignsResponse {
  campaigns: CampaignNode[]
  period: string
  isMock: boolean
}

/**
 * Calculate CTR, ROAS, CPA from raw metrics
 */
function calculateMetrics(spend: number, clicks: number, conversions: number, revenue: number): MetaInsights {
  const impressions = 0 // Will be fetched from insights
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0
  const roas = spend > 0 ? revenue / spend : 0
  const cpa = conversions > 0 ? spend / conversions : 0

  return { impressions, clicks, spend, conversions, revenue, roas, ctr, cpa }
}

/**
 * Fetch campaigns for an account
 */
async function fetchCampaigns(accountId: string, accessToken: string, startDate: string, endDate: string): Promise<any[]> {
  const fields = `id,name,status,insights.time_range({"since":"${startDate}","until":"${endDate}"}){impressions,clicks,spend,actions,action_values}`

  const params = new URLSearchParams({
    fields,
    access_token: accessToken,
    limit: '100',
  })

  const response = await fetch(
    `https://graph.facebook.com/v18.0/act_${accountId.replace('act_', '')}/campaigns?${params.toString()}`,
    { method: 'GET' }
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Meta API (campaigns): ${errorData.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.data || []
}

/**
 * Fetch adsets for a campaign
 */
async function fetchAdsets(campaignId: string, accessToken: string, startDate: string, endDate: string): Promise<any[]> {
  const fields = `id,name,status,insights.time_range({"since":"${startDate}","until":"${endDate}"}){impressions,clicks,spend,actions,action_values}`

  const params = new URLSearchParams({
    fields,
    access_token: accessToken,
    limit: '100',
  })

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${campaignId}/adsets?${params.toString()}`,
    { method: 'GET' }
  )

  if (!response.ok) {
    // Adsets might not exist for a campaign, return empty
    return []
  }

  const data = await response.json()
  return data.data || []
}

/**
 * Fetch ads (creatives) for an adset
 */
async function fetchAds(adsetId: string, accessToken: string, startDate: string, endDate: string): Promise<any[]> {
  const fields = `id,name,status,creative{image_url,thumbnail_url},insights.time_range({"since":"${startDate}","until":"${endDate}"}){impressions,clicks,spend,actions,action_values}`

  const params = new URLSearchParams({
    fields,
    access_token: accessToken,
    limit: '100',
  })

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${adsetId}/ads?${params.toString()}`,
    { method: 'GET' }
  )

  if (!response.ok) {
    // Ads might not exist, return empty
    return []
  }

  const data = await response.json()
  return data.data || []
}

/**
 * Extract metrics from Meta insights
 */
function parseMetrics(insightData: any) {
  if (!insightData || !Array.isArray(insightData) || insightData.length === 0) {
    return { spend: 0, clicks: 0, impressions: 0, conversions: 0, revenue: 0, roas: 0, ctr: 0, cpa: 0 }
  }

  const insight = insightData[0]
  const spend = parseFloat(insight.spend || 0)
  const clicks = parseInt(insight.clicks || 0)
  const impressions = parseInt(insight.impressions || 0)

  // Extract purchase conversions
  const conversions = (insight.actions || [])
    .filter((a: any) => a.action_type === 'purchase')
    .reduce((sum: number, a: any) => sum + parseFloat(a.value || 0), 0)

  // Extract purchase value
  const revenue = (insight.action_values || [])
    .filter((a: any) => a.action_type === 'purchase')
    .reduce((sum: number, a: any) => sum + parseFloat(a.value || 0), 0)

  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0
  const roas = spend > 0 ? revenue / spend : 0
  const cpa = conversions > 0 ? spend / conversions : 0

  return {
    spend: Math.round(spend * 100) / 100,
    clicks,
    impressions,
    conversions: Math.round(conversions),
    revenue: Math.round(revenue * 100) / 100,
    roas: Math.round(roas * 100) / 100,
    ctr: Math.round(ctr * 100) / 100,
    cpa: Math.round(cpa * 100) / 100,
  }
}

export async function GET(request: NextRequest) {
  const accountId = process.env.META_ADS_ACCOUNT_ID
  const accessToken = process.env.META_ADS_ACCESS_TOKEN
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'last30'

  // Check credentials
  if (!accountId || !accessToken) {
    const missingCredentials = [
      !accountId && 'META_ADS_ACCOUNT_ID',
      !accessToken && 'META_ADS_ACCESS_TOKEN',
    ].filter(Boolean)

    return NextResponse.json(
      {
        error: 'Meta Ads credentials not configured',
        message: `Missing: ${missingCredentials.join(', ')}`,
      },
      { status: 503 }
    )
  }

  try {
    // Check for custom dates, otherwise use period
    const customStartDate = searchParams.get('startDate')
    const customEndDate = searchParams.get('endDate')

    let startDate: string
    let endDate: string

    if (customStartDate && customEndDate) {
      startDate = customStartDate
      endDate = customEndDate
    } else {
      const dates = getPeriodDateRange(period)
      startDate = dates.startDate
      endDate = dates.endDate
    }

    // Fetch campaigns
    const campaignsList = await fetchCampaigns(accountId, accessToken, startDate, endDate)

    // Enrich each campaign with adsets and ads
    const campaigns: CampaignNode[] = await Promise.all(
      campaignsList.map(async (campaign) => {
        const metrics = parseMetrics(campaign.insights?.data)

        // Fetch adsets for this campaign
        const adsetsList = await fetchAdsets(campaign.id, accessToken, startDate, endDate)

        // Enrich each adset with ads
        const adsets: AdsetNode[] = await Promise.all(
          adsetsList.map(async (adset) => {
            const adsetMetrics = parseMetrics(adset.insights?.data)

            // Fetch ads for this adset
            const adsList = await fetchAds(adset.id, accessToken, startDate, endDate)

            // Map ads to AdNodes
            const ads: AdNode[] = adsList.map((ad) => {
              const adMetrics = parseMetrics(ad.insights?.data)
              return {
                id: ad.id,
                name: ad.name || 'Untitled Ad',
                status: ad.status || 'UNKNOWN',
                thumbnail: ad.creative?.image_url || ad.creative?.thumbnail_url || undefined,
                ...adMetrics,
              }
            })

            return {
              id: adset.id,
              name: adset.name || 'Untitled Adset',
              status: adset.status || 'UNKNOWN',
              ...adsetMetrics,
              ads,
            }
          })
        )

        return {
          id: campaign.id,
          name: campaign.name || 'Untitled Campaign',
          status: campaign.status || 'UNKNOWN',
          ...metrics,
          adsets,
        }
      })
    )

    const response: CampaignsResponse = {
      campaigns,
      period,
      isMock: false,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Meta Ads campaigns error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to fetch Meta Ads campaign hierarchy',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}
