/**
 * Shopify Sales Sources API
 * Retorna vendas agregadas por fonte/origem
 */

import { NextRequest, NextResponse } from 'next/server'
import { ShopifyClient } from '@/lib/api-clients/shopify'
import { getPeriodDateRange } from '@/lib/utils/date-helpers'
import { aggregateBySalesSource } from '@/lib/utils/sales-source-classifier'

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
        message: 'Missing NEXT_PUBLIC_SHOPIFY_STORE_URL or SHOPIFY_API_TOKEN',
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

    // Agregar por fonte de venda
    const salesBySource = aggregateBySalesSource(
      orders.map((order) => ({
        totalPrice: order.totalPrice,
        sourceUrl: order.sourceUrl,
        referrerUrl: order.referrerUrl,
        userAgent: order.userAgent,
      }))
    )

    // Calcular totais
    const totalRevenue = salesBySource.reduce((sum, item) => sum + item.revenue, 0)
    const totalOrders = salesBySource.reduce((sum, item) => sum + item.orders, 0)

    return NextResponse.json({
      period,
      startDate,
      endDate,
      salesBySource,
      summary: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0,
        sourceCount: salesBySource.length,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Shopify sales-sources error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to fetch sales sources',
        message: errorMessage,
        salesBySource: [],
        summary: {
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          sourceCount: 0,
        },
      },
      { status: 500 }
    )
  }
}
