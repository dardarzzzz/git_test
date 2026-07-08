import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/units', label: 'Unit Pricing' },
  { to: '/about', label: 'About' },
]

export default function PublicNavbar() {
  const [open, setOpen] = useState(false)
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const homeLink = currentUser ? (currentUser.role === 'manager' ? '/manager' : '/dashboard') : null

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {currentUser ? (
            <button
              onClick={() => navigate(homeLink)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Reserve a Unit
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-slate-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700">
                {l.label}
              </Link>
            ))}
            <hr className="border-slate-100" />
            {currentUser ? (
              <button
                onClick={() => {
                  setOpen(false)
                  navigate(homeLink)
                }}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  Reserve a Unit
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
