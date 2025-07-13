import { auth } from './supabase'
import { 
  Portfolio, 
  Asset, 
  Alert, 
  PortfolioForm, 
  AssetForm, 
  AlertForm,
  ApiResponse 
} from '../types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const API_VERSION = 'v1'

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
    return this.request<Portfolio[]>('/portfolio')
  }

  async createPortfolio(portfolio: PortfolioForm) {
    return this.request<Portfolio>('/portfolio', {
      method: 'POST',
      body: JSON.stringify(portfolio),
    })
  }

  async updatePortfolio(id: string, updates: Partial<PortfolioForm>) {
    return this.request<Portfolio>(`/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deletePortfolio(id: string) {
    return this.request<void>(`/portfolio/${id}`, {
      method: 'DELETE',
    })
  }

  // Asset operations
  async getAssets(portfolioId: string) {
    return this.request<Asset[]>(`/assets?portfolioId=${portfolioId}`)
  }

  async createAsset(asset: AssetForm) {
    return this.request<Asset>('/assets', {
      method: 'POST',
      body: JSON.stringify(asset),
    })
  }

  async updateAsset(id: string, updates: Partial<AssetForm>) {
    return this.request<Asset>(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteAsset(id: string) {
    return this.request<void>(`/assets/${id}`, {
      method: 'DELETE',
    })
  }

  // Alert operations
  async getAlerts() {
    return this.request<Alert[]>('/alerts')
  }

  async createAlert(alert: AlertForm) {
    return this.request<Alert>('/alerts', {
      method: 'POST',
      body: JSON.stringify(alert),
    })
  }

  async updateAlert(id: string, updates: Partial<AlertForm>) {
    return this.request<Alert>(`/alerts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteAlert(id: string) {
    return this.request<void>(`/alerts/${id}`, {
      method: 'DELETE',
    })
  }

}

export const apiClient = new ApiClient()
export default apiClient 