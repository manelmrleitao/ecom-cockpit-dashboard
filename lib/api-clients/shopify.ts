/**
 * Cliente Shopify
 * Integração com Shopify Store API
 */

import ApiClient from './base-client'
import type { ShopifyOrder } from '@/types'

export class ShopifyClient extends ApiClient {
  private storeUrl: string
  private apiToken: string

  constructor(storeUrl: string, apiToken: string) {
    const baseUrl = `${storeUrl}/admin/api/2024-01/graphql.json`
    super(baseUrl, {
      'X-Shopify-Access-Token': apiToken,
    })

    this.storeUrl = storeUrl
    this.apiToken = apiToken
  }

  /**
   * Busca pedidos de um período específico
   * @param startDate Data inicial (YYYY-MM-DD)
   * @param endDate Data final (YYYY-MM-DD)
   */
  async getOrders(
    startDate: string,
    endDate: string,
    limit = 250
  ): Promise<ShopifyOrder[]> {
    const query = `
      query {
        orders(first: ${limit}, query: "created:[${startDate}T00:00:00Z TO ${endDate}T23:59:59Z]") {
          edges {
            node {
              id
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              createdAt
              lineItems(first: 100) {
                edges {
                  node {
                    id
                    title
                    quantity
                    originalUnitPriceSet {
                      shopMoney {
                        amount
                      }
                    }
                  }
                }
              }
              customer {
                id
                email
                firstName
                lastName
              }
            }
          }
        }
      }
    `

    const response = await this.post<any>('', { query })

    if (!response.success) {
      throw new Error(`Shopify API error: ${response.error}`)
    }

    // Mapear resposta GraphQL para tipos locais
    const orders: ShopifyOrder[] = (response.data?.data?.orders?.edges || []).map((edge: any) => ({
      id: edge.node.id,
      totalPrice: parseFloat(edge.node.totalPriceSet?.shopMoney?.amount || 0),
      currency: edge.node.totalPriceSet?.shopMoney?.currencyCode || 'EUR',
      createdAt: edge.node.createdAt.split('T')[0], // Formato YYYY-MM-DD
      lineItems: (edge.node.lineItems?.edges || []).map((item: any) => ({
        id: item.node.id,
        title: item.node.title,
        quantity: item.node.quantity,
        price: parseFloat(item.node.originalUnitPriceSet?.shopMoney?.amount || 0),
      })),
      customer: edge.node.customer
        ? {
            id: edge.node.customer.id,
            email: edge.node.customer.email,
            firstName: edge.node.customer.firstName,
            lastName: edge.node.customer.lastName,
          }
        : undefined,
    }))

    return orders
  }

  /**
   * Busca pedidos com dados de origem/fonte de venda
   * @param startDate Data inicial (YYYY-MM-DD)
   * @param endDate Data final (YYYY-MM-DD)
   */
  async getOrdersWithSource(
    startDate: string,
    endDate: string,
    limit = 250
  ): Promise<any[]> {
    const query = `
      query {
        orders(first: ${limit}, query: "created:[${startDate}T00:00:00Z TO ${endDate}T23:59:59Z]") {
          edges {
            node {
              id
              source
              sourceUrl
              referrerUrl
              userAgent
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              createdAt
              attributes {
                key
                value
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

    const response = await this.post<any>('', { query })

    if (!response.success) {
      throw new Error(`Shopify API error: ${response.error}`)
    }

    return (response.data?.data?.orders?.edges || []).map((edge: any) => ({
      id: edge.node.id,
      source: edge.node.source || '',
      sourceUrl: edge.node.sourceUrl || '',
      referrerUrl: edge.node.referrerUrl || '',
      userAgent: edge.node.userAgent || '',
      totalPrice: parseFloat(edge.node.totalPriceSet?.shopMoney?.amount || 0),
      currency: edge.node.totalPriceSet?.shopMoney?.currencyCode || 'EUR',
      createdAt: edge.node.createdAt.split('T')[0],
      attributes: edge.node.attributes || [],
      customer: edge.node.customer
        ? {
            id: edge.node.customer.id,
            email: edge.node.customer.email,
          }
        : undefined,
    }))
  }
}
