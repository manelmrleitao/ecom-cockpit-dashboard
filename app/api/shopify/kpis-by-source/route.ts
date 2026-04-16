/**
 * Shopify KPIs by Acquisition Source
 * Retorna performance (revenue, orders, AOV, etc) agrupada por fonte de aquisição
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
  const source = searchParams.get('source') // Filtro opcional por fonte

  // Validar credenciais
  if (!storeUrl || !apiToken) {
    return NextResponse.json(
      {
        error: 'Shopify credentials not configured',
        bySource: {},
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

    // Agregar por fonte
    const salesBySource = aggregateBySalesSource(
      orders.map((order) => ({
        totalPrice: order.totalPrice,
        sourceUrl: order.sourceUrl,
        referrerUrl: order.referrerUrl,
        userAgent: order.userAgent,
      }))
    )

    // Se source foi especificado, filtrar
    const filteredData = source ? salesBySource.filter((item) => item.source === source) : salesBySource

    // Estruturar resposta similar a KPIs de plataformas
    const bySource: Record<string, any> = {}
    for (const item of salesBySource) {
      bySource[item.source] = {
        source: item.source,
        revenue: item.revenue,
        orders: item.orders,
        averageOrderValue: item.avgOrderValue,
        percentage: item.percentage,
        conversions: item.orders, // Usar orders como proxy de conversões
        spend: 0, // Não temos dados de spend do Shopify
        roas: 0, // Não podemos calcular ROAS sem spend
        cpa: 0,
        impressions: 0,
        clicks: 0,
        ctr: 0,
      }
    }

    // Calcular totais
    const totalRevenue = salesBySource.reduce((sum, item) => sum + item.revenue, 0)
    const totalOrders = salesBySource.reduce((sum, item) => sum + item.orders, 0)
    const totalAOV = totalOrders > 0 ? totalRevenue / totalOrders : 0

    return NextResponse.json({
      period,
      startDate,
      endDate,
      bySource,
      summary: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        averageOrderValue: Math.round(totalAOV * 100) / 100,
        sourceCount: salesBySource.length,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Shopify kpis-by-source error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to fetch KPIs by source',
        message: errorMessage,
        bySource: {},
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
