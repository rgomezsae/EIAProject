import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

function SortIcon({ direction }) {
  if (direction === 'asc') return <ChevronUp size={14} />
  if (direction === 'desc') return <ChevronDown size={14} />
  return <ChevronsUpDown size={14} className="text-text-muted" />
}

export default function DataTable({ columns, data, span = 12, className = '' }) {
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  function handleSort(colKey) {
    if (sortCol === colKey) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(colKey)
      setSortDir('asc')
    }
  }

  const sortedData = [...data]
  if (sortCol) {
    sortedData.sort((a, b) => {
      const aVal = a[sortCol]
      const bVal = b[sortCol]
      if (aVal == null) return 1
      if (bVal == null) return -1
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      }
      const cmp = String(aVal).localeCompare(String(bVal))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }

  return (
    <div
      className={`bg-surface-800 border border-surface-600 rounded-xl overflow-hidden ${className}`}
      style={{ gridColumn: `span ${span}` }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-600">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`
                    px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider
                    sticky top-0 bg-surface-800
                    ${col.sortable !== false ? 'cursor-pointer hover:text-text-primary select-none' : ''}
                    ${col.align === 'right' ? 'text-right' : ''}
                  `}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable !== false && (
                      <SortIcon direction={sortCol === col.key ? sortDir : null} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, i) => (
              <tr
                key={row.id ?? i}
                className={`
                  border-b border-surface-600/50 last:border-0
                  hover:bg-surface-700/50 transition-colors duration-[var(--transition-fast)]
                  ${i % 2 === 0 ? 'bg-surface-800' : 'bg-surface-700/30'}
                `}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`
                      px-4 py-3 text-text-primary
                      ${col.align === 'right' ? 'text-right font-mono' : ''}
                      ${col.className || ''}
                    `}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
