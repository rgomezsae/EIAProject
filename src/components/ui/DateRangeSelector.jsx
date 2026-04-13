import { useState } from 'react'
import { Calendar } from 'lucide-react'

const PRESETS = [
  { id: 'mtd', label: 'MTD' },
  { id: 'qtd', label: 'QTD' },
  { id: 'ytd', label: 'YTD' },
  { id: 'last-12', label: 'Last 12 Months' },
]

export default function DateRangeSelector() {
  const [selected, setSelected] = useState('last-12')

  return (
    <div className="flex items-center gap-1 bg-surface-800 border border-surface-600 rounded-lg p-1">
      <Calendar size={16} strokeWidth={1.5} className="text-text-muted ml-2 mr-1" />
      {PRESETS.map((preset) => (
        <button
          key={preset.id}
          onClick={() => setSelected(preset.id)}
          className={`
            px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-[var(--transition-fast)] cursor-pointer
            ${selected === preset.id
              ? 'bg-surface-700 text-text-primary'
              : 'text-text-muted hover:text-text-secondary'
            }
          `}
        >
          {preset.label}
        </button>
      ))}
    </div>
  )
}
