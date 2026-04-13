export default function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="inline-flex items-center bg-surface-800 border border-surface-600 rounded-lg p-1 gap-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-[var(--transition-fast)] cursor-pointer
            ${value === option.value
              ? 'bg-surface-700 text-text-primary'
              : 'text-text-muted hover:text-text-secondary'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
