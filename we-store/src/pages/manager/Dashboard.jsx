import { Link } from 'react-router-dom'
import { Warehouse, Users, DollarSign, AlertTriangle, PackageSearch } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import StatCard from '../../components/StatCard'
import Badge from '../../components/Badge'

export default function ManagerDashboard() {
  const { currentUser, users } = useAuth()
  const { units, inventory, invoices } = useData()

  const occupied = units.filter((u) => u.status === 'occupied')
  const occupancyRate = units.length ? Math.round((occupied.length / units.length) * 100) : 0
  const monthlyRevenue = occupied.reduce((s, u) => s + u.pricePerMonth, 0)
  const overdue = invoices.filter((i) => i.status === 'overdue')
  const customers = users.filter((u) => u.role === 'customer')

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Welcome back, {currentUser.name.split(' ')[0]}</h1>
      <p className="mt-1 text-slate-500">Here's how We Store is performing today.</p>

      {overdue.length > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">
              {overdue.length} overdue invoice{overdue.length > 1 ? 's' : ''} need attention.
            </p>
            <p className="text-sm text-red-700">Total overdue: ${overdue.reduce((s, i) => s + i.amount, 0)}</p>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Warehouse} label="Occupancy" value={`${occupancyRate}%`} sub={`${occupied.length} of ${units.length} units`} accent="indigo" />
        <StatCard icon={DollarSign} label="Monthly Revenue" value={`$${monthlyRevenue}`} accent="emerald" />
        <StatCard icon={Users} label="Customers" value={customers.length} accent="slate" />
        <StatCard icon={PackageSearch} label="Items Stored" value={inventory.length} accent="amber" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Units Overview</h2>
            <Link to="/manager/units" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Manage units
            </Link>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {units.slice(0, 6).map((u) => {
              const owner = users.find((c) => c.id === u.customerId)
              return (
                <div key={u.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-900">{u.code}</p>
                    <p className="text-xs text-slate-500">
                      {u.size} ft {owner ? `· ${owner.name}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">${u.pricePerMonth}/mo</p>
                    <Badge status={u.status} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Outstanding Invoices</h2>
            <Link to="/manager/customers" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View customers
            </Link>
          </div>
          {invoices.filter((i) => i.status !== 'paid').length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">Everyone is paid up.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {invoices
                .filter((i) => i.status !== 'paid')
                .map((inv) => {
                  const customer = users.find((c) => c.id === inv.customerId)
                  return (
                    <li key={inv.id} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">{customer?.name}</span>
                      <span className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">${inv.amount}</span>
                        <Badge status={inv.status} />
                      </span>
                    </li>
                  )
                })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
