'use client'

import { useEffect, useState, useCallback, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { auth } from '@/lib/supabase'
import { apiClient } from '@/lib/api-client'
import { User, Portfolio, PortfolioCreateResponse } from '@/types'
import { AssetList } from '@/components/AssetList'
import { AlertList } from '@/components/AlertList'

function DashboardContent() {
  const [user, setUser] = useState<User | null>(null)
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [initialLoad, setInitialLoad] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('portfolio')
  const [creatingPortfolio, setCreatingPortfolio] = useState(false)
  const [message, setMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [portfolioCheckComplete, setPortfolioCheckComplete] = useState(false)
  const mountedRef = useRef(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const urlMessage = searchParams.get('message')
    const portfolioError = searchParams.get('portfolioError')

    if (urlMessage) {
      setMessage(urlMessage)
      setShowAlert(true)
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)

      setTimeout(() => {
        setShowAlert(false)
      }, 10000)
    }

    if (portfolioError) {
      setError(portfolioError)
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [searchParams])

  const createDefaultPortfolio = useCallback(async () => {
    if (!user || !mountedRef.current) return false

    setCreatingPortfolio(true)
    try {
      const portfolioName = `${user.username || user.email.split('@')[0]}'s Portfolio`

      const response = await apiClient.createPortfolio({
        name: portfolioName,
        description: 'Your main investment portfolio',
        currency: 'USD',
        isDefault: true,
      })

      if (!mountedRef.current) return false

      if (response.success && response.data) {
        if (
          typeof response.data === 'object' &&
          response.data !== null &&
          'created' in response.data
        ) {
          const responseData =
            response.data as unknown as PortfolioCreateResponse
          setPortfolio(responseData.created)
        } else {
          setPortfolio(response.data as Portfolio)
        }
        setMessage('Welcome! Your portfolio has been created successfully.')
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 5000)
        return true
      } else {
        console.error('Failed to create portfolio:', response.error)
        setError(response.error || 'Failed to create portfolio')
        return false
      }
    } catch (err) {
      if (!mountedRef.current) return false
      console.error('Portfolio creation error:', err)
      setError('Failed to create portfolio. Please try again.')
      return false
    } finally {
      if (mountedRef.current) {
        setCreatingPortfolio(false)
      }
    }
  }, [user])

  const loadPortfolioAndAutoCreate = useCallback(async () => {
    if (!user || !mountedRef.current) return

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Portfolio loading timeout')), 10000)
      )

      const response = await Promise.race([
        apiClient.getPortfolios(),
        timeoutPromise,
      ])

      if (!mountedRef.current) return

      if (response && 'success' in response && response.success) {
        const portfolios = response.data || []

        if (portfolios.length > 0) {
          setPortfolio(portfolios[0])
          setPortfolioCheckComplete(true)
        } else {
          setPortfolioCheckComplete(true)

          setMessage('Setting up your portfolio...')
          setShowAlert(true)

          const success = await createDefaultPortfolio()
          if (!success && mountedRef.current) {
            setError(
              'Failed to create your default portfolio. Please try the button below.'
            )
          }
        }
      } else {
        console.error('Failed to load portfolios:', response?.error)
        setError('Failed to load portfolios')
        setPortfolioCheckComplete(true)
      }
    } catch (err) {
      if (!mountedRef.current) return
      console.error('Failed to load portfolio:', err)
      setError('Failed to load your portfolio data')
      setPortfolioCheckComplete(true)
    }
  }, [user, createDefaultPortfolio])

  const checkUser = useCallback(async () => {
    if (!mountedRef.current) return

    try {
      const {
        data: { user },
      } = await auth.getUser()

      if (!mountedRef.current) return

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser({
        id: user.id,
        email: user.email || '',
        username:
          user.user_metadata?.username || user.email?.split('@')[0] || '',
        firstName: user.user_metadata?.first_name,
        lastName: user.user_metadata?.last_name,
        avatarUrl: user.user_metadata?.avatar_url,
        createdAt: user.created_at,
        updatedAt: user.updated_at || user.created_at,
      })

      setInitialLoad(false)
    } catch {
      if (!mountedRef.current) return
      setError('Failed to load user data')
      router.push('/auth/login')
    }
  }, [router])

  useEffect(() => {
    if (user && !portfolioCheckComplete) {
      loadPortfolioAndAutoCreate()
    }
  }, [user, portfolioCheckComplete, loadPortfolioAndAutoCreate])

  useEffect(() => {
    mountedRef.current = true
    checkUser()

    return () => {
      mountedRef.current = false
    }
  }, [checkUser])

  const handleSignOut = async () => {
    await auth.signOut()
    router.push('/')
  }

  const handleManualPortfolioCreation = async () => {
    const success = await createDefaultPortfolio()
    if (success) {
      setError('')
    }
  }

  if (initialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error && !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            Portfolio Setup Issue
          </h3>
          <p className="text-red-400 mb-4">{error}</p>
          <div className="space-y-3">
            <button
              onClick={handleManualPortfolioCreation}
              disabled={creatingPortfolio}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingPortfolio ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Portfolio...
                </span>
              ) : (
                'Create Portfolio'
              )}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!portfolioCheckComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">
            {creatingPortfolio
              ? 'Creating your portfolio...'
              : 'Loading your dashboard...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Finance Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                Welcome, {user?.firstName || user?.username}!
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Success/Info Message */}
      {showAlert && message && (
        <div className="bg-green-900 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-300">{message}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setShowAlert(false)}
                  className="inline-flex bg-green-900 rounded-md p-1.5 text-green-400 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-900 focus:ring-green-500"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'portfolio', label: 'Portfolio' },
              { id: 'alerts', label: 'Alerts' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-400 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
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
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-medium text-white">
                  Portfolio Value
                </h3>
                <p className="text-3xl font-bold text-indigo-400">
                  ${portfolio?.totalValue?.toFixed(2) || '0.00'}
                </p>
                <p className="text-sm text-gray-400">
                  {portfolio?.currency || 'USD'}
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-medium text-white">
                  Active Alerts
                </h3>
                <p className="text-3xl font-bold text-blue-400">0</p>
                <p className="text-sm text-gray-400">Price and volume alerts</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-medium text-white">Assets</h3>
                <p className="text-3xl font-bold text-green-400">0</p>
                <p className="text-sm text-gray-400">
                  Total assets in portfolio
                </p>
              </div>
            </div>

            {/* Portfolio Details */}
            {!portfolio ? (
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  No Portfolio Found
                </h3>
                <p className="text-gray-400 mb-4">
                  It looks like your portfolio wasn&apos;t created
                  automatically. Click the button below to create one manually.
                </p>
                <button
                  onClick={handleManualPortfolioCreation}
                  disabled={creatingPortfolio}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingPortfolio ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    'Create Portfolio'
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Portfolio Info */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {portfolio.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {portfolio.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Total Value</p>
                      <p className="text-2xl font-bold text-indigo-400">
                        ${portfolio.totalValue?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {portfolio.currency}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Assets Section */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">Assets</h3>
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
              <h2 className="text-2xl font-bold text-white">Alerts</h2>
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

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
