import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiShield, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'
import { scanUrl } from '../utils/api'
import { useChromeTab } from '../hooks/useChromeTab'

const Scan = () => {
  const { currentUrl, isLoading: urlLoading, refreshUrl } = useChromeTab()
  const [url, setUrl] = useState('')
  const [scanResult, setScanResult] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState(null)

  // Set the URL input value when currentUrl changes
  useState(() => {
    if (currentUrl) {
      setUrl(currentUrl)
    }
  }, [currentUrl])

  const handleScan = async () => {
    if (!url) {
      setError('Please enter a URL to scan')
      return
    }

    setIsScanning(true)
    setScanResult(null)
    setError(null)

    try {
      const result = await scanUrl(url)
      console.log(result.result)
      setScanResult(result.result)
    } catch (err) {
      setError('Failed to scan URL. Please try again.')
      console.error(err)
    } finally {
      setIsScanning(false)
    }
  }

  const handleRefresh = async () => {
    const newUrl = await refreshUrl()
    if (newUrl) {
      setUrl(newUrl)
      setScanResult(null)
      setError(null)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">URL Scanner</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Analyze any URL to detect potential phishing attempts
        </p>
      </motion.div>

      <div className="relative mb-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL or use current tab"
          className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     transition-all duration-200"
        />
        <button 
          onClick={handleRefresh}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
          aria-label="Refresh URL"
        >
          <FiRefreshCw className={`w-5 h-5 ${urlLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleScan}
        disabled={isScanning || !url}
        className={`flex items-center justify-center gap-2 mb-6 px-6 py-3 rounded-lg font-medium text-white
                   transition-all duration-200 ${
                     isScanning || !url
                       ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
                       : 'bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 shadow-md hover:shadow-lg'
                   }`}
      >
        {isScanning ? (
          <>
            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
            <span>Scanning...</span>
          </>
        ) : (
          <>
            <FiSearch className="w-5 h-5" />
            <span>Scan URL</span>
          </>
        )}
      </motion.button>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-200 p-4 rounded-lg mb-4"
        >
          {error}
        </motion.div>
      )}

      {scanResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`flex flex-col items-center p-6 rounded-lg ${
            scanResult == 'phishing'
              ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-200'
              : 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-200'
          }`}
        >
          {scanResult == 'phising' ? (
            <>
              <div className="bg-danger-200 dark:bg-danger-700 p-3 rounded-full mb-3">
                <FiAlertTriangle className="w-8 h-8 text-danger-700 dark:text-danger-200" />
              </div>
              <h2 className="text-xl font-bold mb-1">Potential Phishing Detected</h2>
              <p className="text-center mb-3">This URL may be trying to steal your information.</p>
              <div className="text-xs">
                {scanResult.fromCache ? 'Result from cache' : 'Fresh scan result'}
              </div>
            </>
          ) : (
            <>
              <div className="bg-success-200 dark:bg-success-700 p-3 rounded-full mb-3">
                <FiShield className="w-8 h-8 text-success-700 dark:text-success-200" />
              </div>
              <h2 className="text-xl font-bold mb-1">URL is Safe</h2>
              <p className="text-center mb-3">No phishing threats detected on this URL.</p>
              <div className="text-xs">
                {scanResult.fromCache ? 'Result from cache' : 'Fresh scan result'}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default Scan