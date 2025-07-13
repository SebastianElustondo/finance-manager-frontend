/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a number as percentage
 */
export function formatPercentage(
  value: number,
  locale: string = 'en-US',
  decimals: number = 2
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

/**
 * Format a large number with abbreviations (K, M, B)
 */
export function formatLargeNumber(
  num: number,
  locale: string = 'en-US'
): string {
  const abs = Math.abs(num)
  const sign = num < 0 ? '-' : ''

  if (abs < 1000) {
    return num.toLocaleString(locale)
  }

  const units = ['', 'K', 'M', 'B', 'T']
  const unitIndex = Math.floor(Math.log10(abs) / 3)
  const unitValue = abs / Math.pow(1000, unitIndex)

  return `${sign}${unitValue.toFixed(1)}${units[unitIndex]}`
}

/**
 * Format a date string
 */
export function formatDate(
  date: string | Date,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date))
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: string | Date,
  locale: string = 'en-US'
): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const now = new Date()
  const target = new Date(date)
  const diffInMs = target.getTime() - now.getTime()

  const units: Array<[string, number]> = [
    ['year', 365 * 24 * 60 * 60 * 1000],
    ['month', 30 * 24 * 60 * 60 * 1000],
    ['day', 24 * 60 * 60 * 1000],
    ['hour', 60 * 60 * 1000],
    ['minute', 60 * 1000],
    ['second', 1000],
  ]

  for (const [unit, ms] of units) {
    const diff = Math.round(diffInMs / ms)
    if (Math.abs(diff) >= 1) {
      return rtf.format(diff, unit as Intl.RelativeTimeFormatUnit)
    }
  }

  return rtf.format(0, 'second')
}

/**
 * Get color based on value (positive/negative)
 */
export function getValueColor(value: number): string {
  if (value > 0) return 'text-green-600'
  if (value < 0) return 'text-red-600'
  return 'text-gray-600'
}

/**
 * Get background color based on value
 */
export function getValueBgColor(value: number): string {
  if (value > 0) return 'bg-green-50'
  if (value < 0) return 'bg-red-50'
  return 'bg-gray-50'
}
