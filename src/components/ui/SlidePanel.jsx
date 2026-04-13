import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function SlidePanel({ isOpen, onClose, title, children }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-[var(--transition-base)] ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] max-w-[90vw] bg-surface-800 border-l border-surface-600 z-50 flex flex-col shadow-2xl transition-transform duration-[var(--transition-base)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-600 shrink-0">
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:bg-surface-700 hover:text-text-primary transition-colors duration-[var(--transition-fast)] cursor-pointer"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </>
  )
}
