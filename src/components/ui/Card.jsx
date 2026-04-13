export default function Card({ children, className = '', span = 12, title }) {
  return (
    <div
      className={`bg-surface-800 border border-surface-600 rounded-xl p-6 ${className}`}
      style={{ gridColumn: `span ${span}` }}
    >
      {title && (
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
