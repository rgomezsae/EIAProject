export default function SidebarNavItem({ icon: Icon, label, isActive, isExpanded, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center w-full h-11 gap-3 px-5
        transition-colors duration-[var(--transition-fast)] cursor-pointer
        ${isActive
          ? 'bg-surface-700 text-nex-green'
          : 'text-text-secondary hover:bg-surface-700 hover:text-text-primary'
        }
      `}
    >
      {isActive && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-nex-green" />
      )}
      <Icon size={20} strokeWidth={1.5} className="shrink-0" />
      <span
        className={`
          text-sm font-medium whitespace-nowrap overflow-hidden
          transition-[opacity,width] duration-[var(--transition-base)]
          ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
        `}
      >
        {label}
      </span>
    </button>
  )
}
