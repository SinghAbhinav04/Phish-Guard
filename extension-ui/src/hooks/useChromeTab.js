import { useState, useEffect } from 'react'

export const useChromeTab = () => {
  const [currentUrl, setCurrentUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const getCurrentTabUrl = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Check if we're in a Chrome extension environment
      if (!chrome?.runtime?.sendMessage) {
        setError('Not in a Chrome extension environment')
        setIsLoading(false)
        return
      }
      
      return new Promise((resolve) => {
        chrome.runtime.sendMessage(
          { action: 'getCurrentTabUrl' },
          (response) => {
            if (response && response.url) {
              setCurrentUrl(response.url)
              resolve(response.url)
            } else {
              setError('Could not retrieve current tab URL')
              resolve(null)
            }
            setIsLoading(false)
          }
        )
      })
    } catch (err) {
      setError(err.message || 'Error getting current tab URL')
      setIsLoading(false)
      return null
    }
  }

  useEffect(() => {
    getCurrentTabUrl()
  }, [])

  return {
    currentUrl,
    setCurrentUrl,
    isLoading,
    error,
    refreshUrl: getCurrentTabUrl
  }
}