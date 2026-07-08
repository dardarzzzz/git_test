import { LayoutDashboard, Warehouse, PackageSearch, Users, UserCog } from 'lucide-react'
import PortalLayout from '../../components/PortalLayout'

const navItems = [
  { to: '/manager', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/manager/units', label: 'Units', icon: Warehouse },
  { to: '/manager/inventory', label: 'Inventory', icon: PackageSearch },
  { to: '/manager/customers', label: 'Customers', icon: Users },
  { to: '/manager/account', label: 'Account', icon: UserCog },
]

export default function ManagerLayout() {
  return <PortalLayout navItems={navItems} roleLabel="Manager" />
}
