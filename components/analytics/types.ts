/**
 * Types for Analytics/Detailed Analysis
 */

export interface Platform {
  id: string
  name: string
  icon: string
  color: string
}

export interface Campaign {
  id: string
  name: string
  platform: string
  status: 'active' | 'paused' | 'ended'
  spend: number
  revenue: number
  roas: number
  conversions: number
  cac: number
  impressions: number
  clicks: number
  ctr: number
}

export interface Adset {
  id: string
  name: string
  campaignId: string
  status: 'active' | 'paused' | 'ended'
  spend: number
  revenue: number
  roas: number
  conversions: number
  cac: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  thumbstopRate?: number
  videoCompletionRate?: number
  engagementRate?: number
}

export interface Creative {
  id: string
  name: string
  adsetId: string
  type: 'image' | 'video' | 'carousel' | 'collection'
  status: 'active' | 'learning' | 'inactive'
  spend: number
  revenue: number
  roas: number
  conversions: number
  cac: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  copy?: string
  thumbnail?: string
  thumbstopRate?: number
  videoCompletionRate?: number
  engagementRate?: number
}

export interface AnalyticsMetrics {
  spend: number
  revenue: number
  roas: number
  conversions: number
  cac: number
  impressions: number
  clicks: number
  ctr: number
  cpc?: number
  thumbstopRate?: number
  videoCompletionRate?: number
  engagementRate?: number
}
