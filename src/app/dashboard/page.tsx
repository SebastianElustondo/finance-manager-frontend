'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/supabase'
import { apiClient } from '@/lib/api-client'
import { User, Portfolio } from '@/types'
import { AssetList } from '@/components/AssetList'
import { AlertList } from '@/components/AlertList'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('portfolio')
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser({
        id: user.id,
        email: user.email || '',
        username: user.user_metadata?.username || user.email?.split('@')[0] || '',
        firstName: user.user_metadata?.first_name,
        lastName: user.user_metadata?.last_name,
        avatarUrl: user.user_metadata?.avatar_url,
        createdAt: user.created_at,
        updatedAt: user.updated_at || user.created_at,
      })

      // Show dashboard immediately after user is loaded
      setInitialLoad(false)
      
      // Load portfolio data
      await loadPortfolio()
    } catch (err) {
      setError('Failed to load user data')
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const loadPortfolio = async () => {
    try {
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Portfolio loading timeout')), 10000)
      )
      
      const response = await Promise.race([
        apiClient.getPortfolios(),
        timeoutPromise
      ])
      
      if (response && 'success' in response && response.success) {
        const portfolios = response.data || []
        // Get the first (and should be only) portfolio
        setPortfolio(portfolios.length > 0 ? portfolios[0] : null)
      } else {
        setPortfolio(null)
      }
    } catch (err) {
      console.error('Failed to load portfolio:', err)
      setPortfolio(null)
    }
  }

  const handleSignOut = async () => {
    await auth.signOut()
    router.push('/')
  }

  if (initialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Finance Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.firstName || user?.username}!
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'portfolio', label: 'Portfolio' },
              { id: 'alerts', label: 'Alerts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            {/* Portfolio Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Portfolio Value</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  ${portfolio?.totalValue.toFixed(2) || '0.00'}
                </p>
                <p className="text-sm text-gray-500">{portfolio?.currency || 'USD'}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Active Alerts</h3>
                <p className="text-3xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-500">Price and volume alerts</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Assets</h3>
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-500">Total assets in portfolio</p>
              </div>
            </div>

            {/* Portfolio Details */}
            {loading && !portfolio ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-32 mx-auto"></div>
                </div>
                <p className="text-gray-500 mt-4">Loading portfolio...</p>
              </div>
            ) : !portfolio ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Portfolio not found</h3>
                <p className="text-gray-500 mb-4">Your portfolio should have been created automatically. Please try refreshing the page.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Refresh Page
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Portfolio Info */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{portfolio.name}</h3>
                      <p className="text-sm text-gray-600">{portfolio.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Value</p>
                      <p className="text-2xl font-bold text-indigo-600">${portfolio.totalValue.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{portfolio.currency}</p>
                    </div>
                  </div>
                </div>

                {/* Assets Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Assets</h3>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                      Add Asset
                    </button>
                  </div>
                  <AssetList portfolioId={portfolio.id} />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Alerts</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Create Alert
              </button>
            </div>
            <AlertList />
          </div>
        )}
      </main>
    </div>
  )
} 