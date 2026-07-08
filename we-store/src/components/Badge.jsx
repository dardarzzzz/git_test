const STYLES = {
  available: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  occupied: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  maintenance: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  unpaid: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  overdue: 'bg-red-50 text-red-700 ring-red-600/20',
  manager: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  customer: 'bg-sky-50 text-sky-700 ring-sky-600/20',
}

export default function Badge({ status, children }) {
  const style = STYLES[status] || 'bg-slate-100 text-slate-700 ring-slate-500/20'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${style}`}>
      {children || status}
    </span>
  )
}
