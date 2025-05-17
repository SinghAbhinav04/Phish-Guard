import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Try to get the theme from local storage
    const savedTheme = localStorage.getItem('phishing-guard-theme')
    return savedTheme || 'light'
  })

  // Apply theme class to document when theme changes
  useEffect(() => {
    const root = document.documentElement
    const themeMode = theme.includes('dark') ? 'dark' : 'light'
    
    // First remove all possible theme classes
    root.classList.remove('light', 'dark', 'light-purple', 'dark-purple')
    
    // Add the new theme class
    root.classList.add(themeMode)
    
    // Store theme preference
    localStorage.setItem('phishing-guard-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => 
      prevTheme === 'light' ? 'dark' : 
      prevTheme === 'dark' ? 'light-purple' : 
      prevTheme === 'light-purple' ? 'dark-purple' : 'light'
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}