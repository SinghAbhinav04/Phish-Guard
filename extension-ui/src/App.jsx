import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Scan from './components/Scan'
import History from './components/History'
import Feedback from './components/Feedback'
import Settings from './components/Settings'
import Navigation from './components/Navigation'
import { useTheme } from './contexts/ThemeContext'

function App() {
  const [activeTab, setActiveTab] = useState('scan')
  const { theme } = useTheme()
  
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'scan':
        return <Scan />
      case 'history':
        return <History />
      case 'feedback':
        return <Feedback />
      case 'settings':
        return <Settings />
      default:
        return <Scan />
    }
  }
  
  return (
    <div className={`h-screen w-full flex flex-col ${theme}`}>
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderActiveComponent()}
          </motion.div>
        </AnimatePresence>
      </div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

export default App