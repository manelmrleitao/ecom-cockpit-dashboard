/**
 * Types for Ecom Cockpit Dashboard
 */

// Plataformas de anúncios
export type AdPlatform = 'google-ads' | 'meta-ads' | 'tiktok-ads'

// Todas as plataformas de tráfego (Orgânico, Pinterest e Outros)
export type Platform = AdPlatform | 'organic' | 'pinterest' | 'outros'

// Dados de uma campanha/anúncio
export interface AdMetrics {
  id: string
  platform: AdPlatform
  campaignName: string
  impressions: number
  clicks: number
  spend: number
  conversions: number
  revenue: number
  date: string | Date
}

// Dados de Shopify
export interface ShopifyOrder {
  id: string
  totalPrice: number
  currency: string
  createdAt: string | Date
  lineItems: ShopifyLineItem[]
  customer?: ShopifyCustomer
}

export interface ShopifyLineItem {
  id: string
  title: string
  quantity: number
  price: number
}

export interface ShopifyCustomer {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

// KPIs consolidados
export interface DashboardKPIs {
  byPlatform: Record<Platform, PlatformKPIs>
  dataSources: {
    shopify: boolean
    googleAds: boolean
    metaAds: boolean
  }
}

export interface PlatformKPIs {
  platform: Platform
  spend: number
  revenue: number
  roas: number
  conversions: number
  cpa: number
  impressions: number
  clicks: number
  ctr: number // Click Through Rate
}

// Métricas gerais de loja (Shopify)
export interface StoreMetrics {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  uniqueReturningCustomers: number
  customerReturnRate: number // Taxa de Retorno de Cliente (CRR)
  averageOrderValue: number
  currency: string
}

// Período de tempo para análise
export interface DateRange {
  startDate: Date
  endDate: Date
}

// Resposta de API
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: Date
}
