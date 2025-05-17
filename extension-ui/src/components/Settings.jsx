import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSun, FiMoon, FiCheck, FiBell, FiBellOff } from 'react-icons/fi'
import { useTheme } from '../contexts/ThemeContext'

const Settings = () => {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(() => {
    // Try to get notification setting from local storage
    const savedSetting = localStorage.getItem('phishing-guard-notifications')
    return savedSetting !== null ? savedSetting === 'true' : true
  })
  
  // Save notification preferences
  useEffect(() => {
    localStorage.setItem('phishing-guard-notifications', notifications)
  }, [notifications])
  
  const themes = [
    { id: 'light', name: 'Light', icon: FiSun, className: 'bg-white' },
    { id: 'dark', name: 'Dark', icon: FiMoon, className: 'bg-gray-900' },
    { id: 'light-purple', name: 'Purple Light', icon: FiSun, className: 'bg-purple-50' },
    { id: 'dark-purple', name: 'Purple Dark', icon: FiMoon, className: 'bg-purple-900' }
  ]
  
  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 p-6 flex flex-col flex-grow overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Customize your phishing detection extension
        </p>
      </motion.div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Theme</h2>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((themeOption) => (
            <motion.button
              key={themeOption.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setTheme(themeOption.id)}
              className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200
                        relative ${
                          theme === themeOption.id
                            ? 'border-primary-500 dark:border-primary-400'
                            : 'border-gray-300 dark:border-gray-700'
                        }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${themeOption.className}`}>
                <themeOption.icon className={`w-5 h-5 ${
                  themeOption.id.includes('dark') ? 'text-white' : 'text-gray-900'
                }`} />
              </div>
              <span className="text-gray-800 dark:text-white font-medium">
                {themeOption.name}
              </span>
              
              {theme === themeOption.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 dark:bg-primary-400 rounded-full flex items-center justify-center">
                  <FiCheck className="w-3 h-3 text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Notifications</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {notifications ? (
                <FiBell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              ) : (
                <FiBellOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
              <span className="text-gray-800 dark:text-white">
                Phishing Alerts
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
              />
              <div className={`w-11 h-6 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800
                           ${notifications 
                            ? 'bg-primary-600 dark:bg-primary-500 after:translate-x-5' 
                            : 'bg-gray-300 dark:bg-gray-600 after:translate-x-0'}
                           after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white 
                           after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {notifications
              ? "You'll receive alerts when visiting potentially dangerous websites."
              : "You won't receive alerts when visiting potentially dangerous websites."}
          </p>
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">About</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Phishing Guard uses AI to protect you from fraudulent websites
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
            <span>Version 1.0.0</span>
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings