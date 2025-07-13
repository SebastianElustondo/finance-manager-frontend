import React, { useState, useEffect } from 'react'
import { apiClient } from '../lib/api-client'
import useWebSocket from '../hooks/useWebSocket'

interface PriceData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: Date
  source: string
}

interface RealTimePriceTrackerProps {
  symbols: string[]
}

export const RealTimePriceTracker: React.FC<RealTimePriceTrackerProps> = ({ symbols }) => {
  const [prices, setPrices] = useState<Map<string, PriceData>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // WebSocket connection for real-time updates
  const { isConnected, connectionError, subscribeToSymbols, unsubscribeFromSymbols } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'price_update' && message.data) {
        const priceUpdate = message.data as PriceData
        setPrices(prev => new Map(prev.set(priceUpdate.symbol, priceUpdate)))
      }
    },
    onConnect: () => {
      console.log('WebSocket connected for price updates')
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected')
    },
    onError: (error) => {
      console.error('WebSocket error:', error)
    },
  })

  // Fetch initial prices
  useEffect(() => {
    const fetchInitialPrices = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await apiClient.getBatchPrices(symbols)
        
        if (response.success) {
          const pricesMap = new Map<string, PriceData>()
          response.data?.forEach((price: PriceData) => {
            pricesMap.set(price.symbol, price)
          })
          setPrices(pricesMap)
        } else {
          setError(response.error || 'Failed to fetch prices')
        }
      } catch (err) {
        setError('Failed to fetch prices')
        console.error('Error fetching prices:', err)
      } finally {
        setLoading(false)
      }
    }

    if (symbols.length > 0) {
      fetchInitialPrices()
    }
  }, [symbols])

  // Subscribe to WebSocket updates when connected
  useEffect(() => {
    if (isConnected && symbols.length > 0) {
      subscribeToSymbols(symbols)
    }

    return () => {
      if (isConnected && symbols.length > 0) {
        unsubscribeFromSymbols(symbols)
      }
    }
  }, [isConnected, symbols, subscribeToSymbols, unsubscribeFromSymbols])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const formatChange = (change: number, changePercent: number) => {
    const changeColor = change >= 0 ? 'text-green-600' : 'text-red-600'
    const changePrefix = change >= 0 ? '+' : ''
    
    return (
      <span className={changeColor}>
        {changePrefix}{formatPrice(change)} ({changePrefix}{changePercent.toFixed(2)}%)
      </span>
    )
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`
    }
    return volume.toString()
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading prices...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Real-Time Price Tracker</h2>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}></div>
            <span className="text-sm">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          {connectionError && (
            <span className="text-sm text-red-600">
              Error: {connectionError}
            </span>
          )}
        </div>
      </div>

      {prices.size === 0 ? (
        <p className="text-gray-500">No price data available.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from(prices.entries()).map(([symbol, price]) => (
            <div key={symbol} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{symbol}</h3>
                <span className="text-xs text-gray-500">
                  {price.source}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {formatPrice(price.price)}
                </div>
                
                <div className="text-sm">
                  {formatChange(price.change, price.changePercent)}
                </div>
                
                <div className="text-sm text-gray-600">
                  Volume: {formatVolume(price.volume)}
                </div>
                
                <div className="text-xs text-gray-500">
                  Updated: {new Date(price.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Prices
        </button>
      </div>
    </div>
  )
}

export default RealTimePriceTracker 