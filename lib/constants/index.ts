/**
 * Constantes do projeto
 */

export const APP_NAME = 'Ecom Cockpit Dashboard'
export const APP_DESCRIPTION = 'Dashboard centralizado de análise de publicidade e vendas'

// Plataformas suportadas
export const PLATFORMS = {
  GOOGLE_ADS: 'google-ads',
  META_ADS: 'meta-ads',
  TIKTOK_ADS: 'tiktok-ads',
} as const

export const PLATFORM_NAMES = {
  'google-ads': 'Google Ads',
  'meta-ads': 'Meta Ads',
  'tiktok-ads': 'TikTok Ads',
} as const

// Cores para gráficos
export const PLATFORM_COLORS = {
  'google-ads': '#4285F4', // Google Blue
  'meta-ads': '#1877F2', // Meta Blue
  'tiktok-ads': '#000000', // TikTok Black
} as const

// Rotas da aplicação
export const ROUTES = {
  DASHBOARD: '/dashboard',
  ANALYTICS: '/dashboard/analytics',
  SETTINGS: '/dashboard/settings',
  LOGIN: '/login',
  LOGOUT: '/logout',
} as const

// Endpoints de API
export const API_ENDPOINTS = {
  SYNC_GOOGLE_ADS: '/api/sync/google-ads',
  SYNC_META_ADS: '/api/sync/meta-ads',
  SYNC_TIKTOK_ADS: '/api/sync/tiktok-ads',
  SYNC_SHOPIFY: '/api/sync/shopify',
  DASHBOARD_KPIS: '/api/dashboard/kpis',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
} as const

// Horários de sincronização (em minutos)
export const SYNC_INTERVALS = {
  GOOGLE_ADS: 60, // A cada 1 hora
  META_ADS: 60,
  TIKTOK_ADS: 60,
  SHOPIFY: 15, // A cada 15 minutos (via webhooks)
} as const
