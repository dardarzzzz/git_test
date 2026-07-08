import { Link } from 'react-router-dom'
import { Box } from 'lucide-react'

export default function Logo({ to = '/', className = '' }) {
  return (
    <Link to={to} className={`flex items-center gap-2 font-bold text-slate-900 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
        <Box className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <span className="text-lg tracking-tight">We Store</span>
    </Link>
  )
}
