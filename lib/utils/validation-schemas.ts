/**
 * Schemas Zod para validação de dados
 */

import { z } from 'zod'

// Schemas de Métricas
export const AdMetricsSchema = z.object({
  id: z.string(),
  platform: z.enum(['google-ads', 'meta-ads', 'tiktok-ads']),
  campaignName: z.string(),
  impressions: z.number().min(0),
  clicks: z.number().min(0),
  spend: z.number().min(0),
  conversions: z.number().min(0),
  revenue: z.number().min(0),
  date: z.date(),
})

export const DashboardKPIsSchema = z.object({
  totalRevenue: z.number().min(0),
  totalSpend: z.number().min(0),
  totalOrders: z.number().min(0),
  roas: z.number(),
  aov: z.number(),
  cpa: z.number(),
  conversionRate: z.number(),
  byPlatform: z.record(z.any()),
})

// Schema para Date Range
export const DateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
})

// Schema para resposta de API
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.date(),
})

// Schemas de Variáveis de Ambiente
export const EnvironmentSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  NEXT_PUBLIC_SHOPIFY_STORE_URL: z.string().url().optional(),
  SHOPIFY_API_TOKEN: z.string().optional(),
  GOOGLE_ADS_CUSTOMER_ID: z.string().optional(),
  GOOGLE_ADS_CLIENT_ID: z.string().optional(),
  GOOGLE_ADS_CLIENT_SECRET: z.string().optional(),
  META_ADS_ACCESS_TOKEN: z.string().optional(),
  META_ADS_ACCOUNT_ID: z.string().optional(),
  TIKTOK_ADS_ACCESS_TOKEN: z.string().optional(),
  TIKTOK_ADS_BUSINESS_CENTRAL_ID: z.string().optional(),
})

// Types derivados dos schemas
export type AdMetrics = z.infer<typeof AdMetricsSchema>
export type DashboardKPIs = z.infer<typeof DashboardKPIsSchema>
export type DateRange = z.infer<typeof DateRangeSchema>
export type ApiResponse = z.infer<typeof ApiResponseSchema>
