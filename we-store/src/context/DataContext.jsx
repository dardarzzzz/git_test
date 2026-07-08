import { createContext, useContext, useEffect, useState } from 'react'
import { loadState, saveState, nextId } from '../lib/storage'
import { seedUnits, seedInventory, seedInvoices } from '../data/seed'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [units, setUnits] = useState(() => loadState('units', seedUnits))
  const [inventory, setInventory] = useState(() => loadState('inventory', seedInventory))
  const [invoices, setInvoices] = useState(() => loadState('invoices', seedInvoices))

  useEffect(() => saveState('units', units), [units])
  useEffect(() => saveState('inventory', inventory), [inventory])
  useEffect(() => saveState('invoices', invoices), [invoices])

  // --- Units ---
  function addUnit(unit) {
    setUnits((prev) => [...prev, { ...unit, id: nextId(prev), customerId: null, status: unit.status || 'available' }])
  }
  function updateUnit(id, updates) {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)))
  }
  function deleteUnit(id) {
    setUnits((prev) => prev.filter((u) => u.id !== id))
    setInventory((prev) => prev.filter((i) => i.unitId !== id))
  }
  function reserveUnit(unitId, customerId) {
    setUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, status: 'occupied', customerId } : u))
    )
  }
  function releaseUnit(unitId) {
    setUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, status: 'available', customerId: null } : u))
    )
  }

  // --- Inventory ---
  function addItem(item) {
    setInventory((prev) => [
      ...prev,
      { ...item, id: nextId(prev), dateAdded: new Date().toISOString().slice(0, 10) },
    ])
  }
  function updateItem(id, updates) {
    setInventory((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)))
  }
  function deleteItem(id) {
    setInventory((prev) => prev.filter((i) => i.id !== id))
  }

  // --- Invoices ---
  function markInvoicePaid(id) {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: 'paid' } : inv)))
  }
  function addInvoice(invoice) {
    setInvoices((prev) => [...prev, { ...invoice, id: nextId(prev) }])
  }

  const value = {
    units,
    inventory,
    invoices,
    addUnit,
    updateUnit,
    deleteUnit,
    reserveUnit,
    releaseUnit,
    addItem,
    updateItem,
    deleteItem,
    markInvoicePaid,
    addInvoice,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
