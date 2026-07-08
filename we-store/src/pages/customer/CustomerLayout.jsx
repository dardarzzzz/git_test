import { LayoutDashboard, Warehouse, PackageSearch, Search, CreditCard, UserCog } from 'lucide-react'
import PortalLayout from '../../components/PortalLayout'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/units/mine', label: 'My Units', icon: Warehouse },
  { to: '/inventory', label: 'My Inventory', icon: PackageSearch },
  { to: '/units/browse', label: 'Browse Units', icon: Search },
  { to: '/billing', label: 'Billing', icon: CreditCard },
  { to: '/account', label: 'Account', icon: UserCog },
]

export default function CustomerLayout() {
  return <PortalLayout navItems={navItems} roleLabel="Customer" />
}
