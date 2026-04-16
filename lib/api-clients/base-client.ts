/**
 * Cliente HTTP base para chamadas a APIs
 */

import type { ApiResponse } from '@/types'

export class ApiClient {
  private baseUrl: string
  private headers: Record<string, string>

  constructor(baseUrl: string = '', defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl
    this.headers = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    }
  }

  /**
   * Faz um GET request
   */
  async get<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  /**
   * Faz um POST request
   */
  async post<T>(path: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * Faz um PUT request
   */
  async put<T>(path: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * Faz um DELETE request
   */
  async delete<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }

  /**
   * Faz um request genérico
   */
  private async request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${path}`
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.headers,
        ...(options.headers as Record<string, string>),
      },
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        success: true,
        data: data as T,
        timestamp: new Date(),
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      return {
        success: false,
        error: errorMessage,
        timestamp: new Date(),
      }
    }
  }

  /**
   * Adiciona um header personalizado
   */
  setHeader(key: string, value: string): void {
    this.headers[key] = value
  }

  /**
   * Remove um header
   */
  removeHeader(key: string): void {
    delete this.headers[key]
  }
}

export default ApiClient
