import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import Logo from './Logo'
import Badge from './Badge'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function PortalLayout({ navItems, roleLabel }) {
  const [open, setOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    showToast('Logged out.', 'info')
    navigate('/')
  }

  const SidebarContent = (
    <>
      <div className="px-4">
        <Logo to="/" />
      </div>
      <nav className="mt-8 flex flex-1 flex-col gap-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {currentUser?.name?.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{currentUser?.name}</p>
            <Badge status={currentUser?.role}>{roleLabel}</Badge>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white py-6 lg:flex">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-64 flex-col bg-white py-6 shadow-xl">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-4 top-0 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <Logo />
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="text-slate-700">
            <Menu className="h-6 w-6" />
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
