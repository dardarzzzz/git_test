import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Logo from '../components/Logo'

export default function Login() {
  const [role, setRole] = useState('customer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const result = login(email, password, role)
    if (!result.ok) {
      setError(result.error)
      return
    }
    showToast(`Welcome back, ${result.user.name.split(' ')[0]}!`)
    const dest = location.state?.from || (role === 'manager' ? '/manager' : '/dashboard')
    navigate(dest, { replace: true })
  }

  function fillDemo() {
    if (role === 'manager') {
      setEmail('manager@westore.com')
      setPassword('manager123')
    } else {
      setEmail('jane@example.com')
      setPassword('customer123')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-center text-2xl font-bold text-slate-900">Log in to your account</h1>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
          {['customer', 'manager'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-md py-2 text-sm font-semibold capitalize transition ${
                role === r ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Log in as {role}
          </button>
        </form>

        <button
          onClick={fillDemo}
          type="button"
          className="mt-3 w-full rounded-lg border border-dashed border-slate-300 py-2 text-xs font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
        >
          Fill demo {role} credentials
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
