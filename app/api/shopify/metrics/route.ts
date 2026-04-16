/**
 * Shopify Metrics API Route
 * Fetches orders, revenue, and customer data from Shopify
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPeriodDateRange } from '@/lib/utils/date-helpers'
import { MOCK_30_DAYS_DATA } from '@/lib/mock-data'

interface ShopifyOrder {
  id: string
  created_at: string
  total_price: string
  currency: string
  line_items: Array<{ quantity: number }>
  customer: { id: string; email: string } | null
}

interface ShopifyMetrics {
  orders: number
  revenue: number
  averageOrderValue: number
  uniqueCustomers: number
  uniqueReturningCustomers: number
  customerReturnRate: number
  currency: string
  isMock: boolean
}

export async function GET(request: NextRequest) {
  const storeUrl = process.env.SHOPIFY_STORE_URL
  const apiToken = process.env.SHOPIFY_API_TOKEN
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'last30'

  // Check if credentials are configured
  if (!storeUrl || !apiToken) {
    // Return mock data for demo/development
    const mockData = MOCK_30_DAYS_DATA.shopify.daily
    const totalOrders = mockData.reduce((sum, d) => sum + d.orders, 0)
    const totalRevenue = mockData.reduce((sum, d) => sum + d.revenue, 0)
    const totalCustomers = mockData.reduce((sum, d) => sum + d.customers, 0)
    const totalReturning = mockData.reduce((sum, d) => sum + d.returning, 0)

    const mockMetrics: ShopifyMetrics = {
      orders: totalOrders,
      revenue: Math.round(totalRevenue * 100) / 100,
      averageOrderValue: Math.round((totalRevenue / totalOrders) * 100) / 100,
      uniqueCustomers: totalCustomers,
      uniqueReturningCustomers: totalReturning,
      customerReturnRate: Math.round((totalReturning / totalCustomers) * 100 * 100) / 100,
      currency: 'EUR',
      isMock: true,
    }

    return NextResponse.json(mockMetrics)
  }

  try {
    const { startDate, endDate } = getPeriodDateRange(period)

    // Shopify GraphQL query for orders
    // Note: Shopify's date filters don't work reliably in API, so we fetch recent orders and filter in code
    const query = `
      {
        orders(first: 250, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              createdAt
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              lineItems(first: 10) {
                edges {
                  node {
                    quantity
                  }
                }
              }
              customer {
                id
                email
              }
            }
          }
        }
      }
    `

    const response = await fetch(`${storeUrl}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(`GraphQL error: ${data.errors[0].message}`)
    }

    let orders = data.data.orders.edges.map((edge: any) => edge.node)

    // Filter orders by date range (client-side since Shopify API date filters don't work reliably)
    // Parse dates as local dates (not UTC) to match user's timezone
    // startDate and endDate are in format YYYY-MM-DD
    const startDateParts = startDate.split('-')
    const endDateParts = endDate.split('-')

    const startDateTime = new Date(
      parseInt(startDateParts[0]),
      parseInt(startDateParts[1]) - 1,
      parseInt(startDateParts[2]),
      0, 0, 0, 0
    ).getTime()

    const endDateTime = new Date(
      parseInt(endDateParts[0]),
      parseInt(endDateParts[1]) - 1,
      parseInt(endDateParts[2]),
      23, 59, 59, 999
    ).getTime()

    console.log(`[Shopify] Date range: ${startDate} to ${endDate}`)
    console.log(`[Shopify] Start time: ${new Date(startDateTime).toISOString()}`)
    console.log(`[Shopify] End time: ${new Date(endDateTime).toISOString()}`)

    orders = orders.filter((order: any) => {
      const orderTime = new Date(order.createdAt).getTime()
      const isInRange = orderTime >= startDateTime && orderTime <= endDateTime
      if (!isInRange && orders.length < 10) {
        console.log(`[Shopify] Order ${order.id} created at ${order.createdAt} (${orderTime}) - outside range [${startDateTime}, ${endDateTime}]`)
      }
      return isInRange
    })

    console.log(`[Shopify] Filtered to ${orders.length} orders in date range`)

    // Calculate metrics
    const revenue = orders.reduce((sum: number, order: any) => {
      return sum + parseFloat(order.totalPriceSet?.shopMoney?.amount || 0)
    }, 0)

    // Get unique customers and count their purchases
    const customerPurchases: { [customerId: string]: number } = {}
    orders.forEach((order: any) => {
      if (order.customer && order.customer.id) {
        customerPurchases[order.customer.id] = (customerPurchases[order.customer.id] || 0) + 1
      }
    })

    const uniqueCustomers = Object.keys(customerPurchases).length
    const uniqueReturningCustomers = Object.values(customerPurchases).filter((count) => count > 1).length
    const customerReturnRate = uniqueCustomers > 0 ? Math.round((uniqueReturningCustomers / uniqueCustomers) * 100 * 100) / 100 : 0

    const metrics: ShopifyMetrics = {
      orders: orders.length,
      revenue: Math.round(revenue * 100) / 100,
      averageOrderValue: orders.length > 0 ? Math.round((revenue / orders.length) * 100) / 100 : 0,
      uniqueCustomers,
      uniqueReturningCustomers,
      customerReturnRate,
      currency: orders[0]?.totalPriceSet?.shopMoney?.currencyCode || 'USD',
      isMock: false,
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Shopify metrics error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to fetch Shopify metrics',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}
