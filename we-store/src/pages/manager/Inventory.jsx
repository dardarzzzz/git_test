import { useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, PackageSearch } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { CATEGORIES } from '../../data/seed'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'

const emptyForm = { name: '', category: CATEGORIES[0], quantity: 1, estValue: '', notes: '', unitId: '' }

export default function ManagerInventory() {
  const { users } = useAuth()
  const { units, inventory, addItem, updateItem, deleteItem } = useData()
  const { showToast } = useToast()
  const customers = users.filter((u) => u.role === 'customer')
  const occupiedUnits = units.filter((u) => u.customerId)

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [customerFilter, setCustomerFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter
      const matchesCustomer = customerFilter === 'All' || item.customerId === Number(customerFilter)
      return matchesSearch && matchesCategory && matchesCustomer
    })
  }, [inventory, search, categoryFilter, customerFilter])

  function openAddModal() {
    if (occupiedUnits.length === 0) {
      showToast('No occupied units to assign inventory to yet.', 'error')
      return
    }
    setForm({ ...emptyForm, unitId: occupiedUnits[0].id })
    setEditingId(null)
    setModalOpen(true)
  }

  function openEditModal(item) {
    setForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      estValue: item.estValue,
      notes: item.notes || '',
      unitId: item.unitId,
    })
    setEditingId(item.id)
    setModalOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const unit = units.find((u) => u.id === Number(form.unitId))
    const payload = {
      name: form.name.trim(),
      category: form.category,
      quantity: Number(form.quantity) || 1,
      estValue: Number(form.estValue) || 0,
      notes: form.notes.trim(),
      unitId: Number(form.unitId),
      customerId: unit?.customerId,
    }
    if (editingId) {
      updateItem(editingId, payload)
      showToast('Item updated.')
    } else {
      addItem(payload)
      showToast('Item added.')
    }
    setModalOpen(false)
  }

  function confirmDelete() {
    deleteItem(deleteTarget.id)
    showToast('Item removed.', 'info')
    setDeleteTarget(null)
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
          <p className="mt-1 text-slate-500">Every item stored across the facility, by every customer.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option>All</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={customerFilter}
          onChange={(e) => setCustomerFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="All">All customers</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <PackageSearch className="h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No items found</p>
          <p className="text-sm text-slate-400">Try adjusting your filters, or add a new item.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Item</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Unit</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Qty</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Est. Value</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Added</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const unit = units.find((u) => u.id === item.unitId)
                const owner = users.find((u) => u.id === item.customerId)
                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{item.name}</p>
                      {item.notes && <p className="text-xs text-slate-400">{item.notes}</p>}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{owner?.name || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{unit?.code || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{item.category}</td>
                    <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                    <td className="px-4 py-3 text-slate-600">${item.estValue}</td>
                    <td className="px-4 py-3 text-slate-500">{item.dateAdded}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
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
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Item' : 'Add Item'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Item name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Leather Sofa"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Unit (owner)</label>
              <select
                value={form.unitId}
                onChange={(e) => setForm((f) => ({ ...f, unitId: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {occupiedUnits.map((u) => {
                  const owner = users.find((c) => c.id === u.customerId)
                  return (
                    <option key={u.id} value={u.id}>
                      {u.code} — {owner?.name}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Est. value ($)</label>
              <input
                type="number"
                min="0"
                value={form.estValue}
                onChange={(e) => setForm((f) => ({ ...f, estValue: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Optional details, condition, box label..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              {editingId ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete item"
        message={`Remove "${deleteTarget?.name}" from inventory? This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
