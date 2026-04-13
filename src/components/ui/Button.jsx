const VARIANTS = {
  primary: 'bg-nex-green hover:bg-nex-green-dim text-white',
  secondary: 'bg-transparent border border-surface-600 hover:bg-surface-700 text-text-primary',
  ghost: 'bg-transparent hover:bg-surface-700 text-text-secondary hover:text-text-primary',
}

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 px-4 py-2
        text-sm font-medium rounded-lg
        transition-colors duration-[var(--transition-fast)] cursor-pointer
        ${VARIANTS[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
