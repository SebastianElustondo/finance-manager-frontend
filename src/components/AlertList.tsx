import React, { useState, useEffect } from 'react'
import { apiClient } from '../lib/api-client'
import { Alert, AlertType, AlertCreateResponse } from '../types'

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

  const handleCreateAlert = async (
    alertData: Omit<
      Alert,
      'id' | 'userId' | 'createdAt' | 'updatedAt' | 'triggeredAt'
    >
  ) => {
    try {
      const response = await apiClient.createAlert(alertData)

      if (response.success && response.data) {
        if (
          typeof response.data === 'object' &&
          response.data !== null &&
          'alerts' in response.data
        ) {
          const responseData = response.data as unknown as AlertCreateResponse
          setAlerts(responseData.alerts)
        } else {
          setAlerts([response.data as Alert])
        }
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
    await handleUpdateAlert(id, { isActive })
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
          {alerts.map(alert => (
            <div key={alert.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{alert.symbol}</h3>
                  <p className="text-gray-600">{alert.message}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Type: {alert.type}</p>
                    <p>Condition: {alert.condition}</p>
                    <p>
                      Status:{' '}
                      {alert.isTriggered
                        ? 'Triggered'
                        : alert.isActive
                          ? 'Active'
                          : 'Inactive'}
                    </p>
                    {alert.triggeredAt && (
                      <p>
                        Triggered at:{' '}
                        {new Date(alert.triggeredAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleToggleAlert(alert.id, !alert.isActive)}
                    className={`px-3 py-1 rounded text-sm ${
                      alert.isActive
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {alert.isActive ? 'Deactivate' : 'Activate'}
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
        onClick={() =>
          handleCreateAlert({
            symbol: 'AAPL',
            type: AlertType.PRICE_ABOVE,
            condition: 200.0,
            isActive: true,
            isTriggered: false,
            message: 'AAPL price alert: above $200',
          })
        }
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Create Sample Alert
      </button>
    </div>
  )
}

export default AlertList
