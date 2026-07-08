import { Link } from 'react-router-dom'
import { Snowflake, CheckCircle2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { SIZES } from '../data/seed'
import Badge from '../components/Badge'

const SIZE_DESCRIPTIONS = {
  '5x5': 'Closet-sized. Boxes, small furniture, seasonal decor.',
  '5x10': 'Fits a studio apartment or a car\'s worth of boxes.',
  '10x10': 'Fits a 1-2 bedroom apartment.',
  '10x15': 'Fits a 3 bedroom home.',
  '10x20': 'Fits a large home or a vehicle.',
  '10x30': 'Our largest unit — vehicles, boats, full estates.',
}

export default function UnitPricing() {
  const { units } = useData()
  const { currentUser } = useAuth()

  const bySize = SIZES.map((size) => {
    const matches = units.filter((u) => u.size === size)
    const cheapest = matches.reduce((min, u) => (min == null || u.pricePerMonth < min.pricePerMonth ? u : min), null)
    const availableCount = matches.filter((u) => u.status === 'available').length
    return { size, cheapest, availableCount, total: matches.length }
  }).filter((s) => s.total > 0)

  const ctaTo = currentUser ? (currentUser.role === 'manager' ? '/manager/units' : '/units/browse') : '/signup'
  const ctaLabel = currentUser ? (currentUser.role === 'manager' ? 'Manage Units' : 'Browse & Reserve') : 'Sign Up to Reserve'

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Unit Sizes & Pricing</h1>
        <p className="mt-4 text-slate-600">
          Transparent, month-to-month pricing. No long-term contracts, no hidden fees.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bySize.map(({ size, cheapest, availableCount, total }) => (
          <div key={size} className="flex flex-col rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold text-slate-900">{size} ft</h3>
              {cheapest?.climateControlled && (
                <span className="flex items-center gap-1 text-xs font-medium text-sky-600">
                  <Snowflake className="h-3.5 w-3.5" /> Climate options
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-600">{SIZE_DESCRIPTIONS[size]}</p>
            <p className="mt-6 text-3xl font-bold text-slate-900">
              ${cheapest?.pricePerMonth}
              <span className="text-base font-medium text-slate-400">/mo</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">Starting price</p>

            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {availableCount} of {total} available
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Month-to-month lease
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 24/7 gate access
              </li>
            </ul>

            <Link
              to={ctaTo}
              className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
            >
              {ctaLabel}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Unit</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Size</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Climate</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Price / mo</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {units.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{u.code}</td>
                <td className="px-4 py-3 text-slate-600">{u.size} ft</td>
                <td className="px-4 py-3 text-slate-600">{u.climateControlled ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 text-slate-600">${u.pricePerMonth}</td>
                <td className="px-4 py-3">
                  <Badge status={u.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
