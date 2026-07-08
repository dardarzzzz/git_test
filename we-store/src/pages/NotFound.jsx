import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-indigo-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">Sorry, we couldn't find the page you're looking for.</p>
      <Link to="/" className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">
        Back home
      </Link>
    </div>
  )
}
