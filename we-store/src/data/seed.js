export const SIZES = ['5x5', '5x10', '10x10', '10x15', '10x20', '10x30']

export const CATEGORIES = [
  'Furniture',
  'Electronics',
  'Appliances',
  'Boxes',
  'Documents',
  'Seasonal',
  'Vehicles/Parts',
  'Tools',
  'Clothing',
  'Other',
]

export const seedUsers = [
  {
    id: 1,
    role: 'manager',
    name: 'Priya Shah',
    email: 'manager@westore.com',
    password: 'manager123',
    phone: '(555) 010-2000',
    createdAt: '2024-01-05',
  },
  {
    id: 2,
    role: 'customer',
    name: 'Jane Cooper',
    email: 'jane@example.com',
    password: 'customer123',
    phone: '(555) 018-4471',
    createdAt: '2024-03-11',
  },
  {
    id: 3,
    role: 'customer',
    name: 'Marcus Lee',
    email: 'marcus@example.com',
    password: 'customer123',
    phone: '(555) 022-9981',
    createdAt: '2024-06-22',
  },
]

export const seedUnits = [
  { id: 1, code: 'A-101', size: '5x5', climateControlled: false, floor: 1, pricePerMonth: 59, status: 'occupied', customerId: 2 },
  { id: 2, code: 'A-102', size: '5x10', climateControlled: false, floor: 1, pricePerMonth: 89, status: 'available', customerId: null },
  { id: 3, code: 'A-103', size: '10x10', climateControlled: true, floor: 1, pricePerMonth: 139, status: 'occupied', customerId: 3 },
  { id: 4, code: 'B-201', size: '10x15', climateControlled: true, floor: 2, pricePerMonth: 179, status: 'available', customerId: null },
  { id: 5, code: 'B-202', size: '10x20', climateControlled: true, floor: 2, pricePerMonth: 219, status: 'maintenance', customerId: null },
  { id: 6, code: 'B-203', size: '5x5', climateControlled: false, floor: 2, pricePerMonth: 55, status: 'available', customerId: null },
  { id: 7, code: 'C-301', size: '10x30', climateControlled: true, floor: 3, pricePerMonth: 289, status: 'occupied', customerId: 2 },
  { id: 8, code: 'C-302', size: '5x10', climateControlled: false, floor: 3, pricePerMonth: 85, status: 'available', customerId: null },
]

export const seedInventory = [
  { id: 1, unitId: 1, customerId: 2, name: 'Leather Sofa', category: 'Furniture', quantity: 1, estValue: 800, notes: 'Wrapped in plastic cover', dateAdded: '2024-03-15' },
  { id: 2, unitId: 1, customerId: 2, name: 'Moving Boxes (Books)', category: 'Boxes', quantity: 6, estValue: 60, notes: 'Labeled B1-B6', dateAdded: '2024-03-15' },
  { id: 3, unitId: 7, customerId: 2, name: 'Winter Tires (Set of 4)', category: 'Seasonal', quantity: 4, estValue: 400, notes: '', dateAdded: '2024-04-02' },
  { id: 4, unitId: 7, customerId: 2, name: 'Patio Furniture Set', category: 'Furniture', quantity: 1, estValue: 350, notes: 'Table + 4 chairs', dateAdded: '2024-04-02' },
  { id: 5, unitId: 3, customerId: 3, name: '55" TV', category: 'Electronics', quantity: 1, estValue: 500, notes: 'Original box', dateAdded: '2024-06-25' },
  { id: 6, unitId: 3, customerId: 3, name: 'Filing Cabinet w/ Tax Records', category: 'Documents', quantity: 2, estValue: 100, notes: '', dateAdded: '2024-06-25' },
]

export const seedInvoices = [
  { id: 1, customerId: 2, unitId: 1, period: '2026-06', amount: 59, dueDate: '2026-06-01', status: 'paid' },
  { id: 2, customerId: 2, unitId: 7, period: '2026-06', amount: 289, dueDate: '2026-06-01', status: 'paid' },
  { id: 3, customerId: 2, unitId: 1, period: '2026-07', amount: 59, dueDate: '2026-07-01', status: 'overdue' },
  { id: 4, customerId: 2, unitId: 7, period: '2026-07', amount: 289, dueDate: '2026-07-01', status: 'unpaid' },
  { id: 5, customerId: 3, unitId: 3, period: '2026-07', amount: 139, dueDate: '2026-07-01', status: 'unpaid' },
]
