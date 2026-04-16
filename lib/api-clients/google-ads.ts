/**
 * Cliente Google Ads
 * Integração com Google Ads API
 */

import ApiClient from './base-client'
import type { ApiResponse, AdMetrics } from '@/types'

export class GoogleAdsClient extends ApiClient {
  private customerId: string
  private refreshToken: string

  constructor(customerId: string, refreshToken: string, accessToken: string) {
    const baseUrl = 'https://googleads.googleapis.com/v18'
    super(baseUrl, {
      'Authorization': `Bearer ${accessToken}`,
      'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
    })

    this.customerId = customerId
    this.refreshToken = refreshToken
  }

  /**
   * Busca métricas de campanhas de um período
   * @param startDate Data inicial (YYYY-MM-DD)
   * @param endDate Data final (YYYY-MM-DD)
   */
  async getCampaignMetrics(startDate: string, endDate: string): Promise<AdMetrics[]> {
    // Datas já vêm em formato YYYY-MM-DD das API routes
    const dateRangeStart = startDate
    const dateRangeEnd = endDate

    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversion_value
      FROM campaign
      WHERE segments.date BETWEEN '${dateRangeStart}' AND '${dateRangeEnd}'
      AND campaign.status != 'REMOVED'
    `

    const response = await this.post<any>(`/customers/${this.customerId}/googleAds:search`, {
      query,
    })

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch Google Ads metrics')
    }

    const metrics: AdMetrics[] = (response.data.results || []).map((result: any) => ({
      id: result.campaign.id,
      platform: 'google-ads' as const,
      campaignName: result.campaign.name,
      impressions: parseInt(result.metrics.impressions || 0),
      clicks: parseInt(result.metrics.clicks || 0),
      spend: result.metrics.cost_micros / 1_000_000, // Converter de micros para unidade principal
      conversions: Math.floor(parseFloat(result.metrics.conversions || 0)),
      revenue: parseFloat(result.metrics.conversion_value || 0),
      date: new Date().toISOString().split('T')[0],
    }))

    return metrics
  }

}
