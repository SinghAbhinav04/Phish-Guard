import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShield, FiAlertTriangle, FiClock, FiSearch } from 'react-icons/fi'
import { getHistory } from '../utils/api'

const History = () => {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'safe', 'phishing'

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      const data = await getHistory()
      setHistory(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      setError('Failed to load history. Please try again.')
      console.error('Error fetching history:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true
    return item.prediction === filter
  })

  // Function to truncate URL for display
  const truncateUrl = (url, maxLength = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 p-6 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Browsing History</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Review previously scanned URLs and their safety status
        </p>
      </motion.div>

      <div className="flex mb-4 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
        {['all', 'safe', 'phishing'].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`flex-1 py-2 px-3 rounded-md transition-colors duration-200 text-sm font-medium
                      ${filter === option
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
        </div>
      ) : error ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-danger-600 dark:text-danger-400 text-center">
            <p>{error}</p>
            <button
              onClick={fetchHistory}
              className="mt-2 px-4 py-2 bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center">
          <FiClock className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">No history found</h3>
          {filter !== 'all' ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
              No {filter} URLs in your browsing history
            </p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
              Start scanning URLs to build your history
            </p>
          )}
          <button
            onClick={() => setFilter('all')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
          >
            <FiSearch className="w-4 h-4" />
            <span>Scan a URL now</span>
          </button>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto pr-1">
          <AnimatePresence>
            {filteredHistory.map((item, index) => (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mb-3 border-l-4 
                         border-l-solid transition-colors duration-200 cursor-default
                          hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800/80
                         flex items-start
                         border-l-solid ${
                          item.prediction === 'phishing'
                            ? 'border-l-danger-500'
                            : 'border-l-success-500'
                         }"
              >
                <div className="mr-3">
                  {item.prediction === 'phishing' ? (
                    <div className="bg-danger-100 dark:bg-danger-900/30 p-2 rounded-full">
                      <FiAlertTriangle className="w-5 h-5 text-danger-600 dark:text-danger-400" />
                    </div>
                  ) : (
                    <div className="bg-success-100 dark:bg-success-900/30 p-2 rounded-full">
                      <FiShield className="w-5 h-5 text-success-600 dark:text-success-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white mb-1 truncate" title={item.url}>
                    {truncateUrl(item.url)}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.prediction === 'phishing'
                        ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-200'
                        : 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-200'
                    }`}>
                      {item.prediction.charAt(0).toUpperCase() + item.prediction.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default History