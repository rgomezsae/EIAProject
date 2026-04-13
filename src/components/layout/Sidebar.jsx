import { useState } from 'react'
import { Settings, User, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { NAV_ITEMS } from '../../constants/navigation'
import { useNavigation } from '../../hooks/useNavigation'
import SidebarNavItem from './SidebarNavItem'

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { currentPage, navigateTo } = useNavigation()

  return (
    <aside
      className="flex flex-col h-full border-r border-surface-600 bg-surface-800 overflow-hidden"
      style={{
        width: isExpanded ? 'var(--sidebar-expanded)' : 'var(--sidebar-collapsed)',
        transition: 'width var(--transition-base)',
      }}
    >
      {/* Logo area */}
      <div className="flex items-center h-16 px-5 gap-3 border-b border-surface-600">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-nex-green-muted shrink-0">
          <Zap size={18} strokeWidth={1.5} className="text-nex-green" />
        </div>
        <span
          className={`
            text-xl font-bold text-text-primary whitespace-nowrap overflow-hidden
            transition-[opacity] duration-[var(--transition-base)]
            ${isExpanded ? 'opacity-100' : 'opacity-0'}
          `}
        >
          EIA
        </span>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 flex flex-col gap-1 py-3">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={currentPage === item.id}
            isExpanded={isExpanded}
            onClick={() => navigateTo(item.id)}
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-surface-600 py-3 flex flex-col gap-1">
        <button className="flex items-center w-full h-11 gap-3 px-5 text-text-secondary hover:bg-surface-700 hover:text-text-primary transition-colors duration-[var(--transition-fast)] cursor-pointer">
          <Settings size={20} strokeWidth={1.5} className="shrink-0" />
          <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-opacity duration-[var(--transition-base)] ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            Settings
          </span>
        </button>

        <button className="flex items-center w-full h-11 gap-3 px-5 text-text-secondary hover:bg-surface-700 hover:text-text-primary transition-colors duration-[var(--transition-fast)] cursor-pointer">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-surface-600 shrink-0">
            <User size={14} strokeWidth={1.5} />
          </div>
          <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-opacity duration-[var(--transition-base)] ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            Profile
          </span>
        </button>

        {/* Expand/collapse toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center w-full h-9 text-text-muted hover:text-text-secondary transition-colors duration-[var(--transition-fast)] cursor-pointer"
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </aside>
  )
}
