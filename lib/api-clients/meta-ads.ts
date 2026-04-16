/**
 * Cliente Meta Ads (Facebook/Instagram)
 * Integração com Meta Marketing API
 */

import ApiClient from './base-client'
import type { ApiResponse, AdMetrics } from '@/types'

export class MetaAdsClient extends ApiClient {
  private accountId: string
  private accessToken: string

  constructor(accountId: string, accessToken: string) {
    const baseUrl = 'https://graph.instagram.com/v18.0'
    super(baseUrl, {
      Authorization: `Bearer ${accessToken}`,
    })

    this.accountId = accountId
    this.accessToken = accessToken
  }

  /**
   * Busca métricas de campanhas de um período
   */
  async getCampaignMetrics(startDate: Date, endDate: Date): Promise<ApiResponse<AdMetrics[]>> {
    const fields = [
      'id',
      'name',
      'status',
      'insights{impressions,clicks,spend,actions,action_values}',
    ].join(',')

    const params = new URLSearchParams({
      fields,
      access_token: this.accessToken,
      date_preset: 'custom',
      time_range: JSON.stringify({
        since: this.formatDate(startDate),
        until: this.formatDate(endDate),
      }),
    })

    const response = await this.get<any>(`/act_${this.accountId}/campaigns?${params.toString()}`)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: 'Failed to fetch Meta Ads metrics',
        timestamp: new Date(),
      }
    }

    const metrics: AdMetrics[] = (response.data.data || []).map((campaign: any) => {
      const insight = campaign.insights?.data?.[0] || {}

      // Extrair conversões (purchases) do array actions
      const conversions = (insight.actions || [])
        .filter((action: any) => action.action_type === 'purchase')
        .reduce((sum: number, action: any) => sum + action.value, 0)

      // Extrair valor de vendas
      const revenue = (insight.action_values || [])
        .filter((action: any) => action.action_type === 'purchase')
        .reduce((sum: number, action: any) => sum + parseFloat(action.value || 0), 0)

      return {
        id: campaign.id,
        platform: 'meta-ads' as const,
        campaignName: campaign.name,
        impressions: parseInt(insight.impressions || 0),
        clicks: parseInt(insight.clicks || 0),
        spend: parseFloat(insight.spend || 0),
        conversions: Math.floor(conversions),
        revenue,
        date: new Date(),
      }
    })

    return {
      success: true,
      data: metrics,
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
    return `${year}-${month}-${day}`
  }
}

/**
 * Factory para criar cliente Meta Ads
 */
export function createMetaAdsClient(): MetaAdsClient | null {
  const accountId = process.env.META_ADS_ACCOUNT_ID
  const accessToken = process.env.META_ADS_ACCESS_TOKEN

  if (!accountId || !accessToken) {
    console.error('Meta Ads credentials not found in environment variables')
    return null
  }

  return new MetaAdsClient(accountId, accessToken)
}
