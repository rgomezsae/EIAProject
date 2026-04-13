export default function FilterBar({ filters, active, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={`
            px-3 py-1.5 text-xs font-medium rounded-md border transition-colors duration-[var(--transition-fast)] cursor-pointer
            ${active === filter.value
              ? 'bg-nex-green/15 border-nex-green/30 text-nex-green'
              : 'bg-transparent border-surface-600 text-text-muted hover:text-text-secondary hover:border-surface-500'
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
