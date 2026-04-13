import { Download } from 'lucide-react'

export function exportToCSV(data, columns, filename = 'export.csv') {
  const header = columns.map((c) => c.label).join(',')
  const rows = data.map((row) =>
    columns.map((c) => {
      const val = row[c.key]
      if (val == null) return ''
      if (typeof val === 'string' && val.includes(',')) return `"${val}"`
      return val
    }).join(',')
  )
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function ExportButton({ data, columns, filename, label = 'Export CSV' }) {
  return (
    <button
      onClick={() => exportToCSV(data, columns, filename)}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-surface-600 text-text-secondary hover:bg-surface-700 hover:text-text-primary transition-colors duration-[var(--transition-fast)] cursor-pointer"
    >
      <Download size={14} strokeWidth={1.5} />
      {label}
    </button>
  )
}
