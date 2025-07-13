import React, { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../lib/api-client'
import { Asset, AssetType } from '../types'

interface AssetListProps {
  portfolioId: string
}

export const AssetList: React.FC<AssetListProps> = ({ portfolioId }) => {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.getAssets(portfolioId)

      if (response.success) {
        setAssets(response.data || [])
      } else {
        setError(response.error || 'Failed to fetch assets')
      }
    } catch (err) {
      setError('Failed to fetch assets')
      console.error('Error fetching assets:', err)
    } finally {
      setLoading(false)
    }
  }, [portfolioId, setLoading, setError, setAssets])

  useEffect(() => {
    if (portfolioId) {
      fetchAssets()
    }
  }, [portfolioId, fetchAssets])

  const handleCreateAsset = async (
    assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const response = await apiClient.createAsset(assetData)

      if (response.success) {
        // Refresh the list
        fetchAssets()
      } else {
        setError(response.error || 'Failed to create asset')
      }
    } catch (err) {
      setError('Failed to create asset')
      console.error('Error creating asset:', err)
    }
  }

  const handleUpdateAsset = async (id: string, updates: Partial<Asset>) => {
    try {
      const response = await apiClient.updateAsset(id, updates)

      if (response.success) {
        // Refresh the list
        fetchAssets()
      } else {
        setError(response.error || 'Failed to update asset')
      }
    } catch (err) {
      setError('Failed to update asset')
      console.error('Error updating asset:', err)
    }
  }

  const handleDeleteAsset = async (id: string) => {
    try {
      const response = await apiClient.deleteAsset(id)

      if (response.success) {
        // Refresh the list
        fetchAssets()
      } else {
        setError(response.error || 'Failed to delete asset')
      }
    } catch (err) {
      setError('Failed to delete asset')
      console.error('Error deleting asset:', err)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading assets...</div>
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        <p>Error: {error}</p>
        <button
          onClick={fetchAssets}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Portfolio Assets</h2>

      {assets.length === 0 ? (
        <p className="text-gray-500">No assets found in this portfolio.</p>
      ) : (
        <div className="grid gap-4">
          {assets.map(asset => (
            <div key={asset.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{asset.symbol}</h3>
                  <p className="text-gray-600">{asset.name}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Type: {asset.type}</p>
                    <p>Quantity: {asset.quantity}</p>
                    <p>
                      Purchase Price: {asset.currency}{' '}
                      {asset.purchasePrice.toFixed(2)}
                    </p>
                    <p>
                      Current Price: {asset.currency}{' '}
                      {asset.currentPrice.toFixed(2)}
                    </p>
                    <p>
                      P&L: {asset.currency}{' '}
                      {(
                        (asset.currentPrice - asset.purchasePrice) *
                        asset.quantity
                      ).toFixed(2)}
                    </p>
                    {asset.exchange && <p>Exchange: {asset.exchange}</p>}
                    {asset.notes && <p>Notes: {asset.notes}</p>}
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() =>
                      handleUpdateAsset(asset.id, {
                        currentPrice: asset.currentPrice * 1.1, // Simulate price update
                      })
                    }
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Update Price
                  </button>
                  <button
                    onClick={() => handleDeleteAsset(asset.id)}
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
          handleCreateAsset({
            portfolioId: portfolioId,
            symbol: 'AAPL',
            name: 'Apple Inc.',
            type: AssetType.STOCK,
            quantity: 10,
            purchasePrice: 150.0,
            currentPrice: 155.0,
            purchaseDate: new Date().toISOString().split('T')[0],
            exchange: 'NASDAQ',
            currency: 'USD',
            notes: 'Sample asset',
          })
        }
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add Sample Asset
      </button>
    </div>
  )
}

export default AssetList
