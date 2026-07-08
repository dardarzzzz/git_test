import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'

export default function Billing() {
  const { currentUser } = useAuth()
  const { units, invoices, markInvoicePaid } = useData()
  const { showToast } = useToast()
  const [payTarget, setPayTarget] = useState(null)

  const myInvoices = invoices
    .filter((i) => i.customerId === currentUser.id)
    .sort((a, b) => (a.dueDate < b.dueDate ? 1 : -1))

  const balanceDue = myInvoices.filter((i) => i.status !== 'paid').reduce((s, i) => s + i.amount, 0)

  function handlePay() {
    markInvoicePaid(payTarget.id)
    showToast(`Payment of $${payTarget.amount} received. Thank you!`)
    setPayTarget(null)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
      <p className="mt-1 text-slate-500">View invoices and pay your storage rent.</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Total balance due</p>
        <p className={`mt-1 text-3xl font-bold ${balanceDue > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
          ${balanceDue}
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Period</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Unit</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Due Date</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Amount</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {myInvoices.map((inv) => {
              const unit = units.find((u) => u.id === inv.unitId)
              return (
                <tr key={inv.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{inv.period}</td>
                  <td className="px-4 py-3 text-slate-600">{unit?.code || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{inv.dueDate}</td>
                  <td className="px-4 py-3 text-slate-600">${inv.amount}</td>
                  <td className="px-4 py-3">
                    <Badge status={inv.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {inv.status !== 'paid' && (
                      <button
                        onClick={() => setPayTarget(inv)}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
            {myInvoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No invoices yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={!!payTarget} onClose={() => setPayTarget(null)} title="Confirm Payment" maxWidth="max-w-sm">
        {payTarget && (
          <div>
            <p className="text-sm text-slate-600">
              Pay <span className="font-semibold text-slate-900">${payTarget.amount}</span> for period{' '}
              <span className="font-semibold text-slate-900">{payTarget.period}</span>? This is a demo — no real card
              will be charged.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setPayTarget(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handlePay}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Pay ${payTarget.amount}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
