import React, { useState, useEffect } from 'react'
import { apiClient } from '../lib/api-client'

interface Portfolio {
  id: string
  name: string
  description: string
  total_value: number
  currency: string
  created_at: string
  updated_at: string
}

export const PortfolioList: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPortfolios()
  }, [])

  const fetchPortfolios = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.getPortfolios()
      
      if (response.success) {
        setPortfolios(response.data || [])
      } else {
        setError(response.error || 'Failed to fetch portfolios')
      }
    } catch (err) {
      setError('Failed to fetch portfolios')
      console.error('Error fetching portfolios:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePortfolio = async (portfolioData: Omit<Portfolio, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await apiClient.createPortfolio(portfolioData)
      
      if (response.success) {
        // Refresh the list
        fetchPortfolios()
      } else {
        setError(response.error || 'Failed to create portfolio')
      }
    } catch (err) {
      setError('Failed to create portfolio')
      console.error('Error creating portfolio:', err)
    }
  }

  const handleUpdatePortfolio = async (id: string, updates: Partial<Portfolio>) => {
    try {
      const response = await apiClient.updatePortfolio(id, updates)
      
      if (response.success) {
        // Refresh the list
        fetchPortfolios()
      } else {
        setError(response.error || 'Failed to update portfolio')
      }
    } catch (err) {
      setError('Failed to update portfolio')
      console.error('Error updating portfolio:', err)
    }
  }

  const handleDeletePortfolio = async (id: string) => {
    try {
      const response = await apiClient.deletePortfolio(id)
      
      if (response.success) {
        // Refresh the list
        fetchPortfolios()
      } else {
        setError(response.error || 'Failed to delete portfolio')
      }
    } catch (err) {
      setError('Failed to delete portfolio')
      console.error('Error deleting portfolio:', err)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading portfolios...</div>
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        <p>Error: {error}</p>
        <button 
          onClick={fetchPortfolios}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Portfolios</h2>
      
      {portfolios.length === 0 ? (
        <p className="text-gray-500">No portfolios found.</p>
      ) : (
        <div className="grid gap-4">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{portfolio.name}</h3>
                  <p className="text-gray-600">{portfolio.description}</p>
                  <p className="text-sm text-gray-500">
                    Value: {portfolio.currency} {portfolio.total_value.toFixed(2)}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleUpdatePortfolio(portfolio.id, { name: portfolio.name + ' (Updated)' })}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeletePortfolio(portfolio.id)}
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
        onClick={() => handleCreatePortfolio({
          name: 'New Portfolio',
          description: 'A new portfolio',
          total_value: 0,
          currency: 'USD'
        })}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Create New Portfolio
      </button>
    </div>
  )
}

export default PortfolioList 