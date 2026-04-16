/**
 * Utilitários para cálculo de KPIs
 */

import type { AdMetrics, DashboardKPIs, PlatformKPIs, AdPlatform, Platform } from '@/types'

/**
 * Calcula ROAS (Return on Ad Spend)
 * ROAS = Receita / Gasto
 */
export function calculateROAS(revenue: number, spend: number): number {
  if (spend === 0) return 0
  return Math.round((revenue / spend) * 100) / 100
}

/**
 * Calcula CPA (Custo Por Aquisição)
 * CPA = Gasto / Conversões
 */
export function calculateCPA(spend: number, conversions: number): number {
  if (conversions === 0) return 0
  return Math.round((spend / conversions) * 100) / 100
}

/**
 * Calcula CTR (Click Through Rate)
 * CTR = Cliques / Impressões
 */
export function calculateCTR(clicks: number, impressions: number): number {
  if (impressions === 0) return 0
  return Math.round((clicks / impressions) * 10000) / 100 // Percentagem
}

/**
 * Calcula AOV (Average Order Value)
 * AOV = Receita Total / Número de Pedidos
 */
export function calculateAOV(totalRevenue: number, orderCount: number): number {
  if (orderCount === 0) return 0
  return Math.round((totalRevenue / orderCount) * 100) / 100
}

/**
 * Calcula Taxa de Conversão
 * Conversion Rate = Conversões / Cliques
 */
export function calculateConversionRate(conversions: number, clicks: number): number {
  if (clicks === 0) return 0
  return Math.round((conversions / clicks) * 10000) / 100 // Percentagem
}

/**
 * Calcula KPIs para uma plataforma específica
 */
export function calculatePlatformKPIs(metrics: AdMetrics[]): PlatformKPIs {
  const platform = metrics[0].platform

  const totalSpend = metrics.reduce((sum, m) => sum + m.spend, 0)
  const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0)
  const totalConversions = metrics.reduce((sum, m) => sum + m.conversions, 0)
  const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0)
  const totalClicks = metrics.reduce((sum, m) => sum + m.clicks, 0)

  return {
    platform,
    spend: Math.round(totalSpend * 100) / 100,
    revenue: Math.round(totalRevenue * 100) / 100,
    roas: calculateROAS(totalRevenue, totalSpend),
    conversions: totalConversions,
    cpa: calculateCPA(totalSpend, totalConversions),
    impressions: totalImpressions,
    clicks: totalClicks,
    ctr: calculateCTR(totalClicks, totalImpressions),
  }
}

/**
 * Calcula KPIs consolidados de todas as plataformas
 * @deprecated Use o endpoint /api/dashboard/kpis diretamente
 */
export function calculateDashboardKPIs(
  allMetrics: Record<AdPlatform, AdMetrics[]>,
  totalRevenue: number,
  totalOrders: number
): DashboardKPIs {
  let totalSpend = 0
  let totalConversions = 0

  const byPlatform: Record<Platform, PlatformKPIs> = {
    'google-ads': calculatePlatformKPIs(allMetrics['google-ads']),
    'meta-ads': calculatePlatformKPIs(allMetrics['meta-ads']),
    'tiktok-ads': calculatePlatformKPIs(allMetrics['tiktok-ads']),
    'organic': {
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
    'pinterest': {
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
    'outros': {
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
  }

  // Soma os valores de todas as plataformas
  Object.values(byPlatform).forEach((platform) => {
    totalSpend += platform.spend
    totalConversions += platform.conversions
  })

  return {
    byPlatform,
    dataSources: {
      shopify: false,
      googleAds: false,
      metaAds: false,
    },
  }
}

/**
 * Formata um número como moeda
 */
export function formatCurrency(value: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency,
  }).format(value)
}

/**
 * Formata um número com 2 casas decimais
 */
export function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString('pt-PT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Formata uma percentagem
 */
export function formatPercent(value: number, decimals = 2): string {
  return `${formatNumber(value, decimals)}%`
}

/**
 * Calcula KPIs para uma plataforma de forma segura, lidando com arrays vazios
 * Evita erros quando não há dados disponíveis para uma plataforma
 */
export function safeCalculatePlatformKPIs(metrics: AdMetrics[], platform: Platform): PlatformKPIs {
  if (metrics.length === 0) {
    return {
      platform,
      spend: 0,
      revenue: 0,
      roas: 0,
      conversions: 0,
      cpa: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
    }
  }
  return calculatePlatformKPIs(metrics)
}
