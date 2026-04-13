import { createContext, useContext, useState } from 'react'

const NavigationContext = createContext(null)

export function NavigationProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('executive-summary')

  function navigateTo(pageId) {
    setCurrentPage(pageId)
  }

  return (
    <NavigationContext.Provider value={{ currentPage, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
