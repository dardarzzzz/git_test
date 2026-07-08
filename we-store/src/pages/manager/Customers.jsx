import { useState } from 'react'
import { Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import Modal from '../../components/Modal'
import Badge from '../../components/Badge'

export default function ManagerCustomers() {
  const { users } = useAuth()
  const { units, inventory, invoices, markInvoicePaid } = useData()
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const customers = users
    .filter((u) => u.role === 'customer')
    .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  function statsFor(customerId) {
    const myUnits = units.filter((u) => u.customerId === customerId)
    const myItems = inventory.filter((i) => i.customerId === customerId)
    const myInvoices = invoices.filter((i) => i.customerId === customerId)
    const balance = myInvoices.filter((i) => i.status !== 'paid').reduce((s, i) => s + i.amount, 0)
    return { myUnits, myItems, myInvoices, balance }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
      <p className="mt-1 text-slate-500">All registered customer accounts.</p>

      <div className="relative mt-6 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Customer</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Units</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Items</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Balance</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => {
              const { myUnits, myItems, balance } = statsFor(c.id)
              return (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.email}</td>
                  <td className="px-4 py-3 text-slate-600">{myUnits.length}</td>
                  <td className="px-4 py-3 text-slate-600">{myItems.length}</td>
                  <td className="px-4 py-3">
                    <span className={balance > 0 ? 'font-semibold text-red-600' : 'text-emerald-600'}>${balance}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(c)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              )
            })}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name} maxWidth="max-w-2xl">
        {selected &&
          (() => {
            const { myUnits, myItems, myInvoices } = statsFor(selected.id)
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-slate-400">Email</p>
                    <p className="font-medium text-slate-900">{selected.email}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Phone</p>
                    <p className="font-medium text-slate-900">{selected.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Customer since</p>
                    <p className="font-medium text-slate-900">{selected.createdAt}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Units ({myUnits.length})</h4>
                  {myUnits.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-400">No units leased.</p>
                  ) : (
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      {myUnits.map((u) => (
                        <li key={u.id} className="flex justify-between">
                          <span>
                            {u.code} · {u.size} ft
                          </span>
                          <span>${u.pricePerMonth}/mo</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Inventory items ({myItems.length})</h4>
                  {myItems.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-400">No items logged.</p>
                  ) : (
                    <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto text-sm text-slate-600">
                      {myItems.map((i) => (
                        <li key={i.id} className="flex justify-between">
                          <span>{i.name}</span>
                          <span>×{i.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Invoices</h4>
                  {myInvoices.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-400">No invoices.</p>
                  ) : (
                    <ul className="mt-2 space-y-2 text-sm">
                      {myInvoices.map((inv) => (
                        <li key={inv.id} className="flex items-center justify-between">
                          <span className="text-slate-600">
                            {inv.period} · ${inv.amount}
                          </span>
                          <span className="flex items-center gap-2">
                            <Badge status={inv.status} />
                            {inv.status !== 'paid' && (
                              <button
                                onClick={() => {
                                  markInvoicePaid(inv.id)
                                  showToast('Marked as paid.')
                                }}
                                className="rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
                              >
                                Mark Paid
                              </button>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )
          })()}
      </Modal>
    </div>
  )
}
