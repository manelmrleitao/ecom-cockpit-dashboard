/**
 * Shopify Debug Endpoint
 * Shows raw order data and calculations for debugging data reading issues
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPeriodDateRange } from '@/lib/utils/date-helpers'

export async function GET(request: NextRequest) {
  const storeUrl = process.env.SHOPIFY_STORE_URL
  const apiToken = process.env.SHOPIFY_API_TOKEN
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'last30'

  // Check if credentials are configured
  if (!storeUrl || !apiToken) {
    return NextResponse.json(
      {
        error: 'Shopify credentials not configured',
        missingEnvVars: [
          !storeUrl && 'SHOPIFY_STORE_URL',
          !apiToken && 'SHOPIFY_API_TOKEN',
        ].filter(Boolean),
      },
      { status: 503 }
    )
  }

  try {
    const { startDate, endDate } = getPeriodDateRange(period)
    console.log(`[Debug] Fetching orders for period: ${period}`)
    console.log(`[Debug] Date range: ${startDate} to ${endDate}`)

    // Shopify GraphQL query for orders with more details
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
              subtotalPriceSet {
                shopMoney {
                  amount
                }
              }
              totalShippingPriceSet {
                shopMoney {
                  amount
                }
              }
              totalTaxSet {
                shopMoney {
                  amount
                }
              }
              totalDiscountsSet {
                shopMoney {
                  amount
                }
              }
              totalRefundedSet {
                shopMoney {
                  amount
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

    console.log(`[Debug] Total orders fetched from Shopify: ${orders.length}`)

    // Filter orders by date range
    const startDateTime = new Date(startDate + 'T00:00:00Z').getTime()
    const endDateTime = new Date(endDate + 'T23:59:59Z').getTime()

    console.log(`[Debug] Start time (UTC): ${new Date(startDateTime).toISOString()}`)
    console.log(`[Debug] End time (UTC): ${new Date(endDateTime).toISOString()}`)

    // Show first 5 orders for debugging
    const sampleOrders = orders.slice(0, 5).map((order: any) => {
      const orderTime = new Date(order.createdAt).getTime()
      const isInRange = orderTime >= startDateTime && orderTime <= endDateTime
      return {
        id: order.id,
        createdAt: order.createdAt,
        orderTime,
        isInRange,
        totalPrice: order.totalPriceSet?.shopMoney?.amount,
        subtotal: order.subtotalPriceSet?.shopMoney?.amount,
        shipping: order.totalShippingPriceSet?.shopMoney?.amount,
        tax: order.totalTaxSet?.shopMoney?.amount,
        discounts: order.totalDiscountsSet?.shopMoney?.amount,
        refunded: order.totalRefundedSet?.shopMoney?.amount,
      }
    })

    console.log(`[Debug] Sample orders (first 5):`, JSON.stringify(sampleOrders, null, 2))

    const filteredOrders = orders.filter((order: any) => {
      const orderTime = new Date(order.createdAt).getTime()
      return orderTime >= startDateTime && orderTime <= endDateTime
    })

    console.log(`[Debug] Orders in date range: ${filteredOrders.length}`)

    // Calculate metrics
    const revenue = filteredOrders.reduce((sum: number, order: any) => {
      return sum + parseFloat(order.totalPriceSet?.shopMoney?.amount || 0)
    }, 0)

    const subtotal = filteredOrders.reduce((sum: number, order: any) => {
      return sum + parseFloat(order.subtotalPriceSet?.shopMoney?.amount || 0)
    }, 0)

    const shipping = filteredOrders.reduce((sum: number, order: any) => {
      return sum + parseFloat(order.totalShippingPriceSet?.shopMoney?.amount || 0)
    }, 0)

    const tax = filteredOrders.reduce((sum: number, order: any) => {
      return sum + parseFloat(order.totalTaxSet?.shopMoney?.amount || 0)
    }, 0)

    const discounts = filteredOrders.reduce((sum: number, order: any) => {
      return sum + parseFloat(order.totalDiscountsSet?.shopMoney?.amount || 0)
    }, 0)

    const refunded = filteredOrders.reduce((sum: number, order: any) => {
      return sum + parseFloat(order.totalRefundedSet?.shopMoney?.amount || 0)
    }, 0)

    // Get unique customers
    const customerPurchases: { [customerId: string]: number } = {}
    filteredOrders.forEach((order: any) => {
      if (order.customer && order.customer.id) {
        customerPurchases[order.customer.id] = (customerPurchases[order.customer.id] || 0) + 1
      }
    })

    const uniqueCustomers = Object.keys(customerPurchases).length
    const uniqueReturningCustomers = Object.values(customerPurchases).filter((count) => count > 1).length

    return NextResponse.json({
      period,
      dateRange: { startDate, endDate },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      debug: {
        totalOrdersFetched: orders.length,
        sampleOrders,
        filteredOrdersCount: filteredOrders.length,
      },
      metrics: {
        orders: filteredOrders.length,
        revenue: Math.round(revenue * 100) / 100,
        subtotal: Math.round(subtotal * 100) / 100,
        shipping: Math.round(shipping * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        discounts: Math.round(discounts * 100) / 100,
        refunded: Math.round(refunded * 100) / 100,
        // Verify: subtotal - discounts + shipping + tax should equal total revenue
        calculatedTotal: Math.round((subtotal - discounts + shipping + tax) * 100) / 100,
        // Alternative calculation: subtotal - discounts - refunded + shipping + tax
        calculatedWithRefund: Math.round((subtotal - discounts - refunded + shipping + tax) * 100) / 100,
        averageOrderValue: filteredOrders.length > 0 ? Math.round((revenue / filteredOrders.length) * 100) / 100 : 0,
        averageOrderValueAfterRefund: filteredOrders.length > 0 ? Math.round(((revenue - refunded) / filteredOrders.length) * 100) / 100 : 0,
        uniqueCustomers,
        uniqueReturningCustomers,
        customerReturnRate: uniqueCustomers > 0 ? Math.round((uniqueReturningCustomers / uniqueCustomers) * 100 * 100) / 100 : 0,
        currency: filteredOrders[0]?.totalPriceSet?.shopMoney?.currencyCode || 'USD',
      },
    })
  } catch (error) {
    console.error('Shopify debug error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to fetch Shopify debug data',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}
