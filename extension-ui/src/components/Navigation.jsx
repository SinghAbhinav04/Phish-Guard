import { motion } from 'framer-motion'
import { FiSearch, FiClock, FiMessageSquare, FiSettings } from 'react-icons/fi'

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'scan', icon: FiSearch, label: 'Scan' },
    { id: 'history', icon: FiClock, label: 'History' },
    { id: 'feedback', icon: FiMessageSquare, label: 'Feedback' },
    { id: 'settings', icon: FiSettings, label: 'Settings' }
  ]

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800">
      <div className="flex justify-around items-center h-16">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center w-full h-full transition-colors duration-200
              ${activeTab === tab.id 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-300'}`}
            aria-label={tab.label}
          >
            <tab.icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{tab.label}</span>
            
            {activeTab === tab.id && (
              <motion.div
                layoutId="navigation-underline"
                className="absolute bottom-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default Navigation