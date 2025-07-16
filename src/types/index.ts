// User types Y FELIZ NAVIDAD aaaaaaaaaaaaaaaaaaaaa
export interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

// Portfolio types
export interface Portfolio {
  id: string
  userId: string
  name: string
  description?: string
  totalValue: number
  currency: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

// Asset types
export enum AssetType {
  STOCK = 'stock',
  CRYPTOCURRENCY = 'cryptocurrency',
  BOND = 'bond',
  ETF = 'etf',
  COMMODITY = 'commodity',
  REAL_ESTATE = 'real_estate',
  OTHER = 'other',
}

export interface Asset {
  id: string
  portfolioId: string
  symbol: string
  name: string
  type: AssetType
  quantity: number
  purchasePrice: number
  currentPrice: number
  purchaseDate: string
  exchange?: string
  currency: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Transaction types
export enum TransactionType {
  BUY = 'buy',
  SELL = 'sell',
  DIVIDEND = 'dividend',
  SPLIT = 'split',
  TRANSFER = 'transfer',
}

export interface Transaction {
  id: string
  portfolioId: string
  assetId: string
  type: TransactionType
  quantity: number
  price: number
  totalAmount: number
  fees: number
  date: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Alert types
export enum AlertType {
  PRICE_ABOVE = 'price_above',
  PRICE_BELOW = 'price_below',
  PERCENT_CHANGE = 'percent_change',
  VOLUME_SPIKE = 'volume_spike',
  NEWS = 'news',
}

export interface Alert {
  id: string
  userId: string
  symbol: string
  type: AlertType
  condition: number
  isActive: boolean
  isTriggered: boolean
  message: string
  createdAt: string
  updatedAt: string
  triggeredAt?: string
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T = unknown> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Chart data types
export interface ChartData {
  date: string
  value: number
  label?: string
}

export interface PieChartData {
  name: string
  value: number
  color: string
}

// Portfolio analytics
export interface PortfolioAnalytics {
  totalValue: number
  totalGainLoss: number
  totalGainLossPercent: number
  dayGainLoss: number
  dayGainLossPercent: number
  assetAllocation: PieChartData[]
  performanceHistory: ChartData[]
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  username: string
  firstName?: string
  lastName?: string
}

export interface PortfolioForm {
  name: string
  description?: string
  currency: string
  isDefault: boolean
}

export interface AssetForm {
  portfolioId: string
  symbol: string
  name: string
  type: AssetType
  quantity: number
  purchasePrice: number
  currentPrice?: number
  purchaseDate: string
  exchange?: string
  currency: string
  notes?: string
}

export interface AlertForm {
  symbol: string
  type: AlertType
  condition: number
  message: string
}

// UI State types
export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

export interface NotificationState {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

// Database row types (matching Supabase naming convention)
export interface DatabasePortfolio {
  id: string
  user_id: string
  name: string
  description?: string
  total_value: number
  currency: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface DatabaseAsset {
  id: string
  portfolio_id: string
  symbol: string
  name: string
  type: AssetType
  quantity: number
  purchase_price: number
  current_price: number
  purchase_date: string
  exchange?: string
  currency: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface DatabaseAlert {
  id: string
  user_id: string
  symbol: string
  type: AlertType
  condition: number
  is_active: boolean
  is_triggered: boolean
  message: string
  created_at: string
  updated_at: string
  triggered_at?: string
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps extends BaseComponentProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  error?: string
  required?: boolean
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
