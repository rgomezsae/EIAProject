const VARIANTS = {
  positive: 'bg-positive/15 text-positive',
  negative: 'bg-negative/15 text-negative',
  warning: 'bg-warning/15 text-warning',
  info: 'bg-nex-blue/15 text-nex-blue',
  neutral: 'bg-surface-600/50 text-text-secondary',
}

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        text-xs font-medium rounded-md
        ${VARIANTS[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
