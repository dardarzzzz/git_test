import { useMemo, useState } from 'react'
import { Snowflake } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { SIZES } from '../../data/seed'
import Modal from '../../components/Modal'

export default function BrowseUnits() {
  const { currentUser } = useAuth()
  const { units, reserveUnit } = useData()
  const { showToast } = useToast()
  const [sizeFilter, setSizeFilter] = useState('All')
  const [climateOnly, setClimateOnly] = useState(false)
  const [selected, setSelected] = useState(null)

  const available = useMemo(() => {
    return units.filter((u) => u.status === 'available')
      .filter((u) => sizeFilter === 'All' || u.size === sizeFilter)
      .filter((u) => !climateOnly || u.climateControlled)
      .sort((a, b) => a.pricePerMonth - b.pricePerMonth)
  }, [units, sizeFilter, climateOnly])

  function handleReserve() {
    reserveUnit(selected.id, currentUser.id)
    showToast(`Unit ${selected.code} reserved! It's now yours.`)
    setSelected(null)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Browse & Reserve Units</h1>
      <p className="mt-1 text-slate-500">{available.length} units available right now.</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="All">All sizes</option>
          {SIZES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={climateOnly}
            onChange={(e) => setClimateOnly(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Climate controlled only
        </label>
      </div>

      {available.length === 0 ? (
        <p className="mt-16 text-center text-sm text-slate-500">No units match your filters right now.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((u) => (
            <div key={u.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-slate-900">{u.code}</h3>
                {u.climateControlled && (
                  <span className="flex items-center gap-1 text-xs font-medium text-sky-600">
                    <Snowflake className="h-3.5 w-3.5" /> Climate
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {u.size} ft · Floor {u.floor}
              </p>
              <p className="mt-4 text-2xl font-bold text-slate-900">
                ${u.pricePerMonth}
                <span className="text-sm font-medium text-slate-400">/mo</span>
              </p>
              <button
                onClick={() => setSelected(u)}
                className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Reserve This Unit
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Confirm Reservation" maxWidth="max-w-sm">
        {selected && (
          <div>
            <p className="text-sm text-slate-600">
              You're about to reserve unit <span className="font-semibold text-slate-900">{selected.code}</span> (
              {selected.size} ft) for <span className="font-semibold text-slate-900">${selected.pricePerMonth}/mo</span>.
              This unit will move to your account immediately.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReserve}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
