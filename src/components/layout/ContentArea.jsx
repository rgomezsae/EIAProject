export default function ContentArea({ children }) {
  return (
    <main
      className="overflow-y-auto p-6"
      style={{ background: 'var(--surface-900)' }}
    >
      <div className="grid grid-cols-12 gap-6">
        {children}
      </div>
    </main>
  )
}
