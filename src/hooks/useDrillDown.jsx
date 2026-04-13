import { createContext, useContext, useState, useCallback } from 'react'
import SlidePanel from '../components/ui/SlidePanel'

const DrillDownContext = createContext(null)

export function DrillDownProvider({ children }) {
  const [panel, setPanel] = useState({ isOpen: false, title: '', content: null })

  const openDrillDown = useCallback((title, content) => {
    setPanel({ isOpen: true, title, content })
  }, [])

  const closeDrillDown = useCallback(() => {
    setPanel((prev) => ({ ...prev, isOpen: false }))
  }, [])

  return (
    <DrillDownContext.Provider value={{ openDrillDown, closeDrillDown }}>
      {children}
      <SlidePanel isOpen={panel.isOpen} onClose={closeDrillDown} title={panel.title}>
        {panel.content}
      </SlidePanel>
    </DrillDownContext.Provider>
  )
}

export function useDrillDown() {
  const context = useContext(DrillDownContext)
  if (!context) {
    throw new Error('useDrillDown must be used within a DrillDownProvider')
  }
  return context
}
