import { useState, useEffect, useRef, useCallback } from 'react'
import { apiClient } from '../lib/api-client'

interface WebSocketMessage {
  type: string
  data?: any
  error?: string
  message?: string
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void
  onError?: (error: any) => void
  onConnect?: () => void
  onDisconnect?: () => void
  autoReconnect?: boolean
  reconnectInterval?: number
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const shouldReconnectRef = useRef(true)

  const {
    onMessage,
    onError,
    onConnect,
    onDisconnect,
    autoReconnect = true,
    reconnectInterval = 5000,
  } = options

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      setConnectionError(null)
      
      const ws = apiClient.connectWebSocket(
        (message: WebSocketMessage) => {
          setLastMessage(message)
          onMessage?.(message)
        },
        (error: any) => {
          setConnectionError(error.message || 'WebSocket error')
          onError?.(error)
        }
      )

      ws.onopen = () => {
        setIsConnected(true)
        setConnectionError(null)
        onConnect?.()
      }

      ws.onclose = () => {
        setIsConnected(false)
        wsRef.current = null
        onDisconnect?.()

        // Auto-reconnect if enabled and component is still mounted
        if (autoReconnect && shouldReconnectRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }

      wsRef.current = ws
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Failed to connect')
      onError?.(error)
    }
  }, [onMessage, onError, onConnect, onDisconnect, autoReconnect, reconnectInterval])

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    setIsConnected(false)
  }, [])

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }, [])

  // Subscribe to price updates for specific symbols
  const subscribeToSymbols = useCallback((symbols: string[]) => {
    if (wsRef.current) {
      apiClient.subscribeToUpdates(symbols, wsRef.current)
    }
  }, [])

  // Unsubscribe from price updates
  const unsubscribeFromSymbols = useCallback((symbols: string[]) => {
    if (wsRef.current) {
      apiClient.unsubscribeFromUpdates(symbols, wsRef.current)
    }
  }, [])

  // Connect on mount
  useEffect(() => {
    shouldReconnectRef.current = true
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldReconnectRef.current = false
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])

  return {
    isConnected,
    connectionError,
    lastMessage,
    connect,
    disconnect,
    sendMessage,
    subscribeToSymbols,
    unsubscribeFromSymbols,
  }
}

export default useWebSocket 