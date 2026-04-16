/**
 * Shopify Acquisition Sources API
 * Retorna a lista de fontes de aquisição únicas registadas
 */

import { NextRequest, NextResponse } from 'next/server'
import { ShopifyClient } from '@/lib/api-clients/shopify'
import { getPeriodDateRange } from '@/lib/utils/date-helpers'
import { classifySalesSource, type SalesSource } from '@/lib/utils/sales-source-classifier'

export async function GET(request: NextRequest) {
  const storeUrl = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL
  const apiToken = process.env.SHOPIFY_API_TOKEN
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'last30'

  // Validar credenciais
  if (!storeUrl || !apiToken) {
    return NextResponse.json(
      {
        error: 'Shopify credentials not configured',
        sources: [],
      },
      { status: 503 }
    )
  }

  try {
    // Obter datas do período
    const { startDate, endDate } = getPeriodDateRange(period)

    // Criar cliente Shopify
    const shopifyClient = new ShopifyClient(storeUrl, apiToken)

    // Buscar pedidos com informação de origem
    const orders = await shopifyClient.getOrdersWithSource(startDate, endDate, 250)

    // Extrair fontes únicas
    const sourcesSet = new Set<SalesSource>()

    for (const order of orders) {
      const classification = classifySalesSource(
        order.sourceUrl || '',
        order.referrerUrl || '',
        order.userAgent || ''
      )
      sourcesSet.add(classification.source)
    }

    // Converter para array e ordenar
    const sources = Array.from(sourcesSet).sort()

    return NextResponse.json({
      period,
      sources,
      count: sources.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Shopify acquisition-sources error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to fetch acquisition sources',
        message: errorMessage,
        sources: [],
        count: 0,
      },
      { status: 500 }
    )
  }
}
