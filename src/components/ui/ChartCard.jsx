import { Download, Maximize2 } from 'lucide-react'
import { exportToCSV } from './ExportButton'

export default function ChartCard({ title, children, span = 6, exportData, exportColumns, exportFilename, onDrillDown, className = '' }) {
  return (
    <div
      className={`bg-surface-800 border border-surface-600 rounded-xl p-6 flex flex-col ${className}`}
      style={{ gridColumn: `span ${span}` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <div className="flex items-center gap-1">
          {onDrillDown && (
            <button
              onClick={onDrillDown}
              className="flex items-center justify-center w-7 h-7 rounded-md text-text-muted hover:bg-surface-700 hover:text-text-secondary transition-colors duration-[var(--transition-fast)] cursor-pointer"
              title="View details"
            >
              <Maximize2 size={13} strokeWidth={1.5} />
            </button>
          )}
          {exportData && (
            <button
              onClick={() => exportToCSV(exportData, exportColumns, exportFilename)}
              className="flex items-center justify-center w-7 h-7 rounded-md text-text-muted hover:bg-surface-700 hover:text-text-secondary transition-colors duration-[var(--transition-fast)] cursor-pointer"
              title="Export CSV"
            >
              <Download size={14} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  )
}
