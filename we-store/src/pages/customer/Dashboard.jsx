import { Link } from 'react-router-dom'
import { Warehouse, PackageSearch, DollarSign, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import StatCard from '../../components/StatCard'
import Badge from '../../components/Badge'

export default function CustomerDashboard() {
  const { currentUser } = useAuth()
  const { units, inventory, invoices } = useData()

  const myUnits = units.filter((u) => u.customerId === currentUser.id)
  const myItems = inventory.filter((i) => i.customerId === currentUser.id)
  const myInvoices = invoices.filter((i) => i.customerId === currentUser.id)
  const dueInvoices = myInvoices.filter((i) => i.status !== 'paid')
  const overdueInvoices = myInvoices.filter((i) => i.status === 'overdue')
  const monthlyCost = myUnits.reduce((sum, u) => sum + u.pricePerMonth, 0)

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Welcome back, {currentUser.name.split(' ')[0]}</h1>
      <p className="mt-1 text-slate-500">Here's what's happening with your storage account.</p>

      {overdueInvoices.length > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">
              You have {overdueInvoices.length} overdue invoice{overdueInvoices.length > 1 ? 's' : ''}.
            </p>
            <p className="text-sm text-red-700">Pay now to avoid a late fee or lock on your unit.</p>
          </div>
          <Link to="/billing" className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500">
            Pay Now
          </Link>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Warehouse} label="Units Rented" value={myUnits.length} accent="indigo" />
        <StatCard icon={PackageSearch} label="Items Stored" value={myItems.length} accent="emerald" />
        <StatCard icon={DollarSign} label="Monthly Cost" value={`$${monthlyCost}`} accent="slate" />
        <StatCard
          icon={AlertTriangle}
          label="Balance Due"
          value={`$${dueInvoices.reduce((s, i) => s + i.amount, 0)}`}
          accent={dueInvoices.length ? 'red' : 'emerald'}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">My Units</h2>
            <Link to="/units/browse" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Reserve another unit
            </Link>
          </div>
          {myUnits.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">You don't have any units yet.</p>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {myUnits.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-900">{u.code}</p>
                    <p className="text-xs text-slate-500">
                      {u.size} ft {u.climateControlled ? '· Climate controlled' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">${u.pricePerMonth}/mo</p>
                    <Badge status={u.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Items</h2>
            <Link to="/inventory" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all
            </Link>
          </div>
          {myItems.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">No items logged yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {myItems
                .slice()
                .sort((a, b) => (a.dateAdded < b.dateAdded ? 1 : -1))
                .slice(0, 5)
                .map((item) => (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <span className="truncate text-slate-700">{item.name}</span>
                    <span className="text-slate-400">×{item.quantity}</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
