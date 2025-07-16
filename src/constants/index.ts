import { AssetType, AlertType } from '../types'

export const ASSET_TYPES = [
  { value: AssetType.STOCK, label: 'Stock' },
  { value: AssetType.CRYPTOCURRENCY, label: 'Cryptocurrency' },
  { value: AssetType.BOND, label: 'Bond' },
  { value: AssetType.ETF, label: 'ETF' },
  { value: AssetType.COMMODITY, label: 'Commodity' },
  { value: AssetType.REAL_ESTATE, label: 'Real Estate' },
  { value: AssetType.OTHER, label: 'Other' },
]

export const ALERT_TYPES = [
  { value: AlertType.PRICE_ABOVE, label: 'Price Above' },
  { value: AlertType.PRICE_BELOW, label: 'Price Below' },
  { value: AlertType.PERCENT_CHANGE, label: 'Percent Change' },
  { value: AlertType.VOLUME_SPIKE, label: 'Volume Spike' },
  { value: AlertType.NEWS, label: 'News' },
]

export const CURRENCIES = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { value: 'CAD', label: 'Canadian Dollar', symbol: 'C$' },
  { value: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
  { value: 'CHF', label: 'Swiss Franc', symbol: 'Fr' },
  { value: 'CNY', label: 'Chinese Yuan', symbol: '¥' },
]

export const CHART_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
]

export const PAGINATION_SIZES = [10, 25, 50, 100]

export const DATE_RANGES = [
  { value: '1D', label: '1 Day' },
  { value: '1W', label: '1 Week' },
  { value: '1M', label: '1 Month' },
  { value: '3M', label: '3 Months' },
  { value: '6M', label: '6 Months' },
  { value: '1Y', label: '1 Year' },
  { value: '5Y', label: '5 Years' },
  { value: 'ALL', label: 'All Time' },
]

export const PERFORMANCE_PERIODS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
]

export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'value', label: 'Value' },
  { value: 'change', label: 'Change' },
  { value: 'changePercent', label: 'Change %' },
  { value: 'quantity', label: 'Quantity' },
  { value: 'date', label: 'Date' },
]

export const API_ENDPOINTS = {
  PORTFOLIOS: '/api/v1/portfolios',
  ASSETS: '/api/v1/assets',
  ALERTS: '/api/v1/alerts',
  PRICES: '/api/v1/prices',
  AUTH: '/api/v1/auth',
} as const

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  PORTFOLIO: {
    LIST: '/portfolio',
    CREATE: '/portfolio/create',
    EDIT: '/portfolio/edit',
  },
  SETTINGS: '/settings',
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
} as const
