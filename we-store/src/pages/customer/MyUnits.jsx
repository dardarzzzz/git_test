import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Snowflake } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import Badge from '../../components/Badge'
import ConfirmDialog from '../../components/ConfirmDialog'

export default function MyUnits() {
  const { currentUser } = useAuth()
  const { units, inventory, releaseUnit } = useData()
  const { showToast } = useToast()
  const [releaseTarget, setReleaseTarget] = useState(null)

  const myUnits = units.filter((u) => u.customerId === currentUser.id)

  function confirmRelease() {
    releaseUnit(releaseTarget.id)
    showToast(`Lease ended for unit ${releaseTarget.code}.`, 'info')
    setReleaseTarget(null)
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Units</h1>
          <p className="mt-1 text-slate-500">Units currently leased under your account.</p>
        </div>
        <Link
          to="/units/browse"
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Reserve Another Unit
        </Link>
      </div>

      {myUnits.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-sm font-medium text-slate-600">You don't have any units yet.</p>
          <Link to="/units/browse" className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            Browse available units →
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {myUnits.map((u) => {
            const itemCount = inventory.filter((i) => i.unitId === u.id).length
            return (
              <div key={u.id} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{u.code}</h3>
                  <Badge status={u.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {u.size} ft · Floor {u.floor}
                </p>
                {u.climateControlled && (
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-sky-600">
                    <Snowflake className="h-3.5 w-3.5" /> Climate controlled
                  </span>
                )}
                <p className="mt-4 text-2xl font-bold text-slate-900">
                  ${u.pricePerMonth}
                  <span className="text-sm font-medium text-slate-400">/mo</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">{itemCount} item(s) logged</p>
                <div className="mt-5 flex gap-2">
                  <Link
                    to={`/inventory?unit=${u.id}`}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    View Inventory
                  </Link>
                  <button
                    onClick={() => setReleaseTarget(u)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    End Lease
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!releaseTarget}
        title="End lease"
        message={`Are you sure you want to end your lease on unit ${releaseTarget?.code}? Make sure it's empty before releasing it.`}
        confirmLabel="End Lease"
        onConfirm={confirmRelease}
        onCancel={() => setReleaseTarget(null)}
      />
    </div>
  )
}
