import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMessageSquare, FiAlertTriangle, FiShield, FiCheck } from 'react-icons/fi'
import { submitFeedback } from '../utils/api'
import { useChromeTab } from '../hooks/useChromeTab'

const Feedback = () => {
  const { currentUrl } = useChromeTab()
  const [url, setUrl] = useState('')
  const [feedbackType, setFeedbackType] = useState('')
  const [feedbackText, setFeedbackText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  // Set the URL input value when currentUrl changes
  useState(() => {
    if (currentUrl) {
      setUrl(currentUrl)
    }
  }, [currentUrl])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!url) {
      setError('Please enter a URL')
      return
    }
    
    if (!feedbackType) {
      setError('Please select a feedback type')
      return
    }
    
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    
    try {
      await submitFeedback(url, feedbackText, feedbackType)
      setSuccess(true)
      // Reset form
      setFeedbackText('')
      setFeedbackType('')
    } catch (err) {
      setError('Failed to submit feedback. Please try again.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }
  
  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 p-6 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Submit Feedback</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Help us improve our detection by reporting incorrect predictions
        </p>
      </motion.div>
      
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-success-100 dark:bg-success-900/30 rounded-lg"
          >
            <div className="bg-success-200 dark:bg-success-800 p-3 rounded-full mb-4">
              <FiCheck className="w-8 h-8 text-success-700 dark:text-success-300" />
            </div>
            <h2 className="text-xl font-bold text-success-800 dark:text-success-200 mb-2">Feedback Submitted</h2>
            <p className="text-success-700 dark:text-success-300 mb-6">
              Thank you for helping us improve our phishing detection!
            </p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="px-6 py-2 bg-success-600 dark:bg-success-700 hover:bg-success-700 dark:hover:bg-success-600 text-white rounded-lg transition-colors duration-200"
            >
              Submit Another Feedback
            </button>
          </motion.div>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL
              </label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter the URL"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                         bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition-all duration-200"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                This URL is actually:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setFeedbackType('safe')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border
                            transition-all duration-200 ${
                              feedbackType === 'safe'
                                ? 'bg-success-100 dark:bg-success-900/30 border-success-500 dark:border-success-700 text-success-800 dark:text-success-200'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                            }`}
                >
                  <FiShield className={`w-5 h-5 ${
                    feedbackType === 'safe'
                      ? 'text-success-700 dark:text-success-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  <span>Safe</span>
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setFeedbackType('phishing')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border
                            transition-all duration-200 ${
                              feedbackType === 'phishing'
                                ? 'bg-danger-100 dark:bg-danger-900/30 border-danger-500 dark:border-danger-700 text-danger-800 dark:text-danger-200'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                            }`}
                >
                  <FiAlertTriangle className={`w-5 h-5 ${
                    feedbackType === 'phishing'
                      ? 'text-danger-700 dark:text-danger-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  <span>Phishing</span>
                </motion.button>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Additional Comments (Optional)
              </label>
              <textarea
                id="feedback"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Please tell us why you think this classification is incorrect..."
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                         bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition-all duration-200 resize-none"
              />
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-200 p-4 rounded-lg mb-4"
              >
                {error}
              </motion.div>
            )}
            
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={submitting || !url || !feedbackType}
              className={`flex justify-center gap-2 py-3 rounded-lg font-medium text-white
                        transition-all duration-200 mt-auto ${
                          submitting || !url || !feedbackType
                            ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
                            : 'bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 shadow-md hover:shadow-lg'
                        }`}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FiMessageSquare className="w-5 h-5" />
                  <span>Submit Feedback</span>
                </>
              )}
            </motion.button>
          </>
        )}
      </form>
    </div>
  )
}

export default Feedback