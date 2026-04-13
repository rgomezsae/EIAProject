import { Bell, Download } from 'lucide-react'
import { NAV_ITEMS } from '../../constants/navigation'
import { useNavigation } from '../../hooks/useNavigation'
import DateRangeSelector from '../ui/DateRangeSelector'

export default function TopBar() {
  const { currentPage } = useNavigation()
  const pageTitle = NAV_ITEMS.find((item) => item.id === currentPage)?.label || 'Dashboard'

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-surface-600 bg-surface-800">
      {/* Left — Page title */}
      <h1 className="text-xl font-semibold text-text-primary">
        {pageTitle}
      </h1>

      {/* Center — Date range selector */}
      <DateRangeSelector />

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        <button className="flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:bg-surface-700 hover:text-text-primary transition-colors duration-[var(--transition-fast)] cursor-pointer">
          <Bell size={18} strokeWidth={1.5} />
        </button>
        <button className="flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:bg-surface-700 hover:text-text-primary transition-colors duration-[var(--transition-fast)] cursor-pointer">
          <Download size={18} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  )
}
