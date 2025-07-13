import React, { useState, useEffect } from 'react'
import { apiClient } from '../lib/api-client'

interface Alert {
  id: string
  user_id: string
  symbol: string
  type: string
  condition: number
  is_active: boolean
  is_triggered: boolean
  message: string
  created_at: string
  updated_at: string
  triggered_at?: string
}

export const AlertList: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.getAlerts()
      
      if (response.success) {
        setAlerts(response.data || [])
      } else {
        setError(response.error || 'Failed to fetch alerts')
      }
    } catch (err) {
      setError('Failed to fetch alerts')
      console.error('Error fetching alerts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAlert = async (alertData: Omit<Alert, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'triggered_at'>) => {
    try {
      const response = await apiClient.createAlert(alertData)
      
      if (response.success) {
        // Refresh the list
        fetchAlerts()
      } else {
        setError(response.error || 'Failed to create alert')
      }
    } catch (err) {
      setError('Failed to create alert')
      console.error('Error creating alert:', err)
    }
  }

  const handleUpdateAlert = async (id: string, updates: Partial<Alert>) => {
    try {
      const response = await apiClient.updateAlert(id, updates)
      
      if (response.success) {
        // Refresh the list
        fetchAlerts()
      } else {
        setError(response.error || 'Failed to update alert')
      }
    } catch (err) {
      setError('Failed to update alert')
      console.error('Error updating alert:', err)
    }
  }

  const handleDeleteAlert = async (id: string) => {
    try {
      const response = await apiClient.deleteAlert(id)
      
      if (response.success) {
        // Refresh the list
        fetchAlerts()
      } else {
        setError(response.error || 'Failed to delete alert')
      }
    } catch (err) {
      setError('Failed to delete alert')
      console.error('Error deleting alert:', err)
    }
  }

  const handleToggleAlert = async (id: string, isActive: boolean) => {
    await handleUpdateAlert(id, { is_active: isActive })
  }

  if (loading) {
    return <div className="text-center py-4">Loading alerts...</div>
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        <p>Error: {error}</p>
        <button 
          onClick={fetchAlerts}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Price Alerts</h2>
      
      {alerts.length === 0 ? (
        <p className="text-gray-500">No alerts found.</p>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{alert.symbol}</h3>
                  <p className="text-gray-600">{alert.message}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Type: {alert.type}</p>
                    <p>Condition: {alert.condition}</p>
                    <p>Status: {alert.is_triggered ? 'Triggered' : alert.is_active ? 'Active' : 'Inactive'}</p>
                    {alert.triggered_at && (
                      <p>Triggered at: {new Date(alert.triggered_at).toLocaleString()}</p>
                    )}
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleToggleAlert(alert.id, !alert.is_active)}
                    className={`px-3 py-1 rounded text-sm ${
                      alert.is_active 
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {alert.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={() => handleCreateAlert({
          symbol: 'AAPL',
          type: 'price_above',
          condition: 200.00,
          is_active: true,
          is_triggered: false,
          message: 'AAPL price alert: above $200'
        })}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Create Sample Alert
      </button>
    </div>
  )
}

export default AlertList 