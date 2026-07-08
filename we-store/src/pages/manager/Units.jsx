import { useState } from 'react'
import { Plus, Pencil, Trash2, Snowflake } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { SIZES } from '../../data/seed'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import Badge from '../../components/Badge'

const emptyForm = {
  code: '',
  size: SIZES[0],
  climateControlled: false,
  floor: 1,
  pricePerMonth: '',
  status: 'available',
  customerId: '',
}

export default function ManagerUnits() {
  const { users } = useAuth()
  const { units, addUnit, updateUnit, deleteUnit } = useData()
  const { showToast } = useToast()
  const customers = users.filter((u) => u.role === 'customer')

  const [statusFilter, setStatusFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = units.filter((u) => statusFilter === 'All' || u.status === statusFilter)

  function openAddModal() {
    setForm(emptyForm)
    setEditingId(null)
    setModalOpen(true)
  }

  function openEditModal(u) {
    setForm({
      code: u.code,
      size: u.size,
      climateControlled: u.climateControlled,
      floor: u.floor,
      pricePerMonth: u.pricePerMonth,
      status: u.status,
      customerId: u.customerId || '',
    })
    setEditingId(u.id)
    setModalOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const status = form.status
    const customerId = status === 'occupied' ? Number(form.customerId) || null : null
    const payload = {
      code: form.code.trim().toUpperCase(),
      size: form.size,
      climateControlled: form.climateControlled,
      floor: Number(form.floor) || 1,
      pricePerMonth: Number(form.pricePerMonth) || 0,
      status,
      customerId,
    }
    if (status === 'occupied' && !customerId) {
      showToast('Select a customer for an occupied unit.', 'error')
      return
    }
    if (editingId) {
      updateUnit(editingId, payload)
      showToast('Unit updated.')
    } else {
      addUnit(payload)
      showToast('Unit added.')
    }
    setModalOpen(false)
  }

  function confirmDelete() {
    deleteUnit(deleteTarget.id)
    showToast('Unit deleted.', 'info')
    setDeleteTarget(null)
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Unit Management</h1>
          <p className="mt-1 text-slate-500">Add units, set pricing, and assign customers.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> Add Unit
        </button>
      </div>

      <div className="mt-6 flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="All">All statuses</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Unit</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Size</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Climate</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Floor</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Price / mo</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Customer</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((u) => {
              const owner = users.find((c) => c.id === u.customerId)
              return (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{u.code}</td>
                  <td className="px-4 py-3 text-slate-600">{u.size} ft</td>
                  <td className="px-4 py-3 text-slate-600">
                    {u.climateControlled ? <Snowflake className="h-4 w-4 text-sky-500" /> : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.floor}</td>
                  <td className="px-4 py-3 text-slate-600">${u.pricePerMonth}</td>
                  <td className="px-4 py-3 text-slate-600">{owner?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge status={u.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditModal(u)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Unit' : 'Add Unit'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Unit code</label>
              <input
                required
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. D-401"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Floor</label>
              <input
                type="number"
                min="1"
                required
                value={form.floor}
                onChange={(e) => setForm((f) => ({ ...f, floor: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Size</label>
              <select
                value={form.size}
                onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {SIZES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Price / mo ($)</label>
              <input
                type="number"
                min="0"
                required
                value={form.pricePerMonth}
                onChange={(e) => setForm((f) => ({ ...f, pricePerMonth: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.climateControlled}
              onChange={(e) => setForm((f) => ({ ...f, climateControlled: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Climate controlled
          </label>
          <div>
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          {form.status === 'occupied' && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Assign to customer</label>
              <select
                value={form.customerId}
                onChange={(e) => setForm((f) => ({ ...f, customerId: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select a customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              {editingId ? 'Save Changes' : 'Add Unit'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete unit"
        message={`Delete unit ${deleteTarget?.code}? Any inventory logged in this unit will also be removed.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
