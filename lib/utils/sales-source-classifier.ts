/**
 * Classifica a fonte de venda baseado em sourceUrl, referrer, userAgent, etc
 */

export type SalesSource =
  | 'Instagram'
  | 'Facebook'
  | 'TikTok'
  | 'Pinterest'
  | 'Google'
  | 'Google Ads'
  | 'YouTube'
  | 'Linktree'
  | 'Direct'
  | 'Email'
  | 'Organic'
  | 'Unknown'

interface ClassificationResult {
  source: SalesSource
  confidence: 'high' | 'medium' | 'low'
  reason: string
}

/**
 * Classifica uma venda baseado em múltiplas fontes de informação
 */
export function classifySalesSource(
  sourceUrl: string = '',
  referrerUrl: string = '',
  userAgent: string = ''
): ClassificationResult {
  // Remover protocolo e www para padronização
  const normalizeUrl = (url: string) => url.toLowerCase().replace(/^https?:\/\/(www\.)?/, '')

  const source = normalizeUrl(sourceUrl)
  const referrer = normalizeUrl(referrerUrl)

  // 1. Verificar por Instagram
  if (
    source.includes('instagram.com') ||
    referrer.includes('instagram.com') ||
    source.includes('l.instagram.com')
  ) {
    return {
      source: 'Instagram',
      confidence: 'high',
      reason: 'Detected from Instagram URL',
    }
  }

  // 2. Verificar por Facebook
  if (source.includes('facebook.com') || referrer.includes('facebook.com')) {
    return {
      source: 'Facebook',
      confidence: 'high',
      reason: 'Detected from Facebook URL',
    }
  }

  // 3. Verificar por TikTok
  if (source.includes('tiktok.com') || referrer.includes('tiktok.com')) {
    return {
      source: 'TikTok',
      confidence: 'high',
      reason: 'Detected from TikTok URL',
    }
  }

  // 4. Verificar por Pinterest
  if (source.includes('pinterest.com') || referrer.includes('pinterest.com')) {
    return {
      source: 'Pinterest',
      confidence: 'high',
      reason: 'Detected from Pinterest URL',
    }
  }

  // 5. Verificar por Linktree
  if (source.includes('linktr.ee') || source.includes('linktree.com') || referrer.includes('linktr.ee')) {
    return {
      source: 'Linktree',
      confidence: 'high',
      reason: 'Detected from Linktree URL',
    }
  }

  // 6. Verificar por Google Ads (utm_source=google)
  if (source.includes('utm_source=google') || source.includes('gclid=')) {
    return {
      source: 'Google Ads',
      confidence: 'high',
      reason: 'Detected from Google Ads parameters',
    }
  }

  // 7. Verificar por Google Search/Organic
  if (referrer.includes('google.') || source.includes('google.')) {
    return {
      source: 'Google',
      confidence: 'medium',
      reason: 'Detected from Google referrer',
    }
  }

  // 8. Verificar por YouTube
  if (source.includes('youtube.com') || referrer.includes('youtube.com')) {
    return {
      source: 'YouTube',
      confidence: 'high',
      reason: 'Detected from YouTube URL',
    }
  }

  // 9. Verificar por Email (utm_source=email)
  if (source.includes('utm_source=email') || source.includes('utm_medium=email')) {
    return {
      source: 'Email',
      confidence: 'high',
      reason: 'Detected from Email parameters',
    }
  }

  // 10. Direct - sem referrer
  if (!referrer || referrer === '' || referrer.includes('(direct)')) {
    return {
      source: 'Direct',
      confidence: 'high',
      reason: 'No referrer detected (direct access)',
    }
  }

  // 11. Organic - sem utm_source
  if (referrer && !source.includes('utm_')) {
    return {
      source: 'Organic',
      confidence: 'medium',
      reason: 'Appears to be organic traffic',
    }
  }

  // Default
  return {
    source: 'Unknown',
    confidence: 'low',
    reason: 'Could not determine sales source',
  }
}

/**
 * Agrupa vendas por fonte
 */
export interface SalesSourceData {
  source: SalesSource
  revenue: number
  orders: number
  avgOrderValue: number
  percentage: number
}

export function aggregateBySalesSource(
  orders: Array<{ totalPrice: number; sourceUrl?: string; referrerUrl?: string; userAgent?: string }>
): SalesSourceData[] {
  const sourceMap = new Map<SalesSource, { revenue: number; count: number }>()

  for (const order of orders) {
    const classification = classifySalesSource(
      order.sourceUrl || '',
      order.referrerUrl || '',
      order.userAgent || ''
    )

    const current = sourceMap.get(classification.source) || { revenue: 0, count: 0 }
    current.revenue += order.totalPrice
    current.count += 1
    sourceMap.set(classification.source, current)
  }

  const totalRevenue = Array.from(sourceMap.values()).reduce((sum, item) => sum + item.revenue, 0)

  const result: SalesSourceData[] = Array.from(sourceMap.entries())
    .map(([source, data]) => ({
      source,
      revenue: Math.round(data.revenue * 100) / 100,
      orders: data.count,
      avgOrderValue: Math.round((data.revenue / data.count) * 100) / 100,
      percentage: Math.round((data.revenue / totalRevenue) * 100 * 100) / 100,
    }))
    .sort((a, b) => b.revenue - a.revenue)

  return result
}
