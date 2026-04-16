/**
 * Cliente TikTok Ads
 * Integração com TikTok Ads Manager API
 */

import ApiClient from './base-client'
import type { ApiResponse, AdMetrics } from '@/types'

export class TikTokAdsClient extends ApiClient {
  private businessCentralId: string
  private accessToken: string

  constructor(businessCentralId: string, accessToken: string) {
    const baseUrl = 'https://business-api.tiktok.com/open_api/v1.3'
    super(baseUrl, {
      Authorization: `Bearer ${accessToken}`,
    })

    this.businessCentralId = businessCentralId
    this.accessToken = accessToken
  }

  /**
   * Busca métricas de campanhas de um período
   */
  async getCampaignMetrics(startDate: Date, endDate: Date): Promise<ApiResponse<AdMetrics[]>> {
    const response = await this.post<any>('/campaign/get/', {
      advertiser_id: this.businessCentralId,
      fields: ['id', 'name', 'status', 'create_time', 'modify_time'],
      filtering: {
        filter_fields: ['campaign_type'],
        filter_type: 'EQUAL',
        filter_value: ['REGULAR_CAMPAIGN'],
      },
      page_size: 100,
    })

    if (!response.success || !response.data) {
      return {
        success: false,
        error: 'Failed to fetch TikTok campaigns',
        timestamp: new Date(),
      }
    }

    const campaigns = response.data.data?.list || []
    const metrics: AdMetrics[] = []

    // Buscar métricas de cada campanha
    for (const campaign of campaigns) {
      const metricsResponse = await this.getCampaignInsights(
        campaign.id,
        startDate,
        endDate
      )

      if (metricsResponse.success && metricsResponse.data) {
        metrics.push({
          id: campaign.id,
          platform: 'tiktok-ads' as const,
          campaignName: campaign.name,
          impressions: metricsResponse.data.impressions,
          clicks: metricsResponse.data.clicks,
          spend: metricsResponse.data.spend,
          conversions: metricsResponse.data.conversions,
          revenue: metricsResponse.data.revenue,
          date: new Date(),
        })
      }
    }

    return {
      success: true,
      data: metrics,
      timestamp: new Date(),
    }
  }

  /**
   * Busca insights de uma campanha específica
   */
  private async getCampaignInsights(
    campaignId: string,
    startDate: Date,
    endDate: Date
  ): Promise<
    ApiResponse<{
      impressions: number
      clicks: number
      spend: number
      conversions: number
      revenue: number
    }>
  > {
    const response = await this.post<any>('/campaign/get_report/', {
      advertiser_id: this.businessCentralId,
      campaign_ids: [campaignId],
      data_level: 'CAMPAIGN',
      metrics: [
        'impressions',
        'clicks',
        'spend',
        'conversions',
        'conversion_rate',
        'cpc',
        'cpm',
      ],
      start_date: this.formatDate(startDate),
      end_date: this.formatDate(endDate),
    })

    if (!response.success || !response.data?.data) {
      return {
        success: false,
        error: 'Failed to fetch campaign insights',
        timestamp: new Date(),
      }
    }

    const insights = response.data.data[0] || {}

    return {
      success: true,
      data: {
        impressions: parseInt(insights.impressions || 0),
        clicks: parseInt(insights.clicks || 0),
        spend: parseFloat(insights.spend || 0),
        conversions: Math.floor(parseFloat(insights.conversions || 0)),
        revenue: parseFloat(insights.conversion_value || 0), // TikTok pode não ter isso
      },
      timestamp: new Date(),
    }
  }

  /**
   * Formata data para formato YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}${month}${day}` // TikTok usa YYYYMMDD
  }
}

/**
 * Factory para criar cliente TikTok Ads
 */
export function createTikTokAdsClient(): TikTokAdsClient | null {
  const businessCentralId = process.env.TIKTOK_ADS_BUSINESS_CENTRAL_ID
  const accessToken = process.env.TIKTOK_ADS_ACCESS_TOKEN

  if (!businessCentralId || !accessToken) {
    console.error('TikTok Ads credentials not found in environment variables')
    return null
  }

  return new TikTokAdsClient(businessCentralId, accessToken)
}
