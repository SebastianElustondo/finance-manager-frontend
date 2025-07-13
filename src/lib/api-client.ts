import { auth } from './supabase'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const API_VERSION = 'v1'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/${API_VERSION}`
  }

  private async getAuthToken(): Promise<string | null> {
    const { data } = await auth.getSession()
    return data.session?.access_token || null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await this.getAuthToken()
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Portfolio operations
  async getPortfolios() {
    return this.request<any[]>('/portfolio')
  }

  async createPortfolio(portfolio: any) {
    return this.request<any>('/portfolio', {
      method: 'POST',
      body: JSON.stringify(portfolio),
    })
  }

  async updatePortfolio(id: string, updates: any) {
    return this.request<any>(`/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deletePortfolio(id: string) {
    return this.request<any>(`/portfolio/${id}`, {
      method: 'DELETE',
    })
  }

  // Asset operations
  async getAssets(portfolioId: string) {
    return this.request<any[]>(`/assets?portfolioId=${portfolioId}`)
  }

  async createAsset(asset: any) {
    return this.request<any>('/assets', {
      method: 'POST',
      body: JSON.stringify(asset),
    })
  }

  async updateAsset(id: string, updates: any) {
    return this.request<any>(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteAsset(id: string) {
    return this.request<any>(`/assets/${id}`, {
      method: 'DELETE',
    })
  }

  // Alert operations
  async getAlerts() {
    return this.request<any[]>('/alerts')
  }

  async createAlert(alert: any) {
    return this.request<any>('/alerts', {
      method: 'POST',
      body: JSON.stringify(alert),
    })
  }

  async updateAlert(id: string, updates: any) {
    return this.request<any>(`/alerts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteAlert(id: string) {
    return this.request<any>(`/alerts/${id}`, {
      method: 'DELETE',
    })
  }

  // Price operations
  async getCurrentPrice(symbol: string) {
    return this.request<any>(`/prices/current/${symbol}`)
  }

  async getHistoricalPrices(symbol: string, period = '1y', interval = '1d') {
    return this.request<any[]>(`/prices/history/${symbol}?period=${period}&interval=${interval}`)
  }

  async getBatchPrices(symbols: string[]) {
    return this.request<any[]>('/prices/batch', {
      method: 'POST',
      body: JSON.stringify({ symbols }),
    })
  }

  // WebSocket connection helper
  connectWebSocket(onMessage: (data: any) => void, onError?: (error: any) => void): WebSocket {
    const wsUrl = API_BASE_URL.replace('http', 'ws')
    const ws = new WebSocket(wsUrl)

    ws.onopen = async () => {
      console.log('WebSocket connected')
      
      // Authenticate with the server
      const token = await this.getAuthToken()
      if (token) {
        ws.send(JSON.stringify({
          type: 'auth',
          token: token,
        }))
      }
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage(data)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      if (onError) {
        onError(error)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
    }

    return ws
  }

  // Subscribe to real-time updates
  subscribeToUpdates(symbols: string[], ws: WebSocket) {
    ws.send(JSON.stringify({
      type: 'subscribe',
      symbols: symbols,
    }))
  }

  // Unsubscribe from updates
  unsubscribeFromUpdates(symbols: string[], ws: WebSocket) {
    ws.send(JSON.stringify({
      type: 'unsubscribe',
      symbols: symbols,
    }))
  }
}

export const apiClient = new ApiClient()
export default apiClient 