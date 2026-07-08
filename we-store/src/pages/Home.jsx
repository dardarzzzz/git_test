import { Link } from 'react-router-dom'
import { ShieldCheck, Clock, PackageSearch, CreditCard, Boxes, Camera } from 'lucide-react'
import { useData } from '../context/DataContext'

const FEATURES = [
  { icon: ShieldCheck, title: 'Secure Facility', desc: 'Gated access, fenced perimeter, and on-site staff keep your belongings safe.' },
  { icon: Camera, title: '24/7 Video Monitoring', desc: 'Every hallway and entrance is recorded around the clock.' },
  { icon: Clock, title: '24/7 Gate Access', desc: 'Come and go on your schedule with your personal access code.' },
  { icon: PackageSearch, title: 'Digital Inventory', desc: 'Log every item you store so you always know what and where it is.' },
  { icon: CreditCard, title: 'Online Billing', desc: 'View invoices and pay your rent online — no trips to the office.' },
  { icon: Boxes, title: 'Flexible Sizes', desc: 'From 5x5 lockers to 10x30 vehicle-friendly units, month to month.' },
]

export default function Home() {
  const { units } = useData()
  const available = units.filter((u) => u.status === 'available').length

  return (
    <div>
      <section className="bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              {available} units available right now
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Storage that's <span className="text-indigo-600">simple</span>, secure, and always in your pocket.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              We Store gives you an affordable unit and an easy way to manage everything inside it —
              reserve online, track your inventory, and pay rent without ever calling the office.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:w-auto"
              >
                Reserve a Unit
              </Link>
              <Link
                to="/units"
                className="w-full rounded-lg border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
              >
                View Unit Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Everything you need, built in</h2>
          <p className="mt-4 text-slate-600">
            We built the features every storage customer wishes their facility had.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
            <div>
              <p className="text-3xl font-bold text-white">{units.length}</p>
              <p className="mt-1 text-sm text-slate-400">Total Units</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="mt-1 text-sm text-slate-400">Gate Access</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">6</p>
              <p className="mt-1 text-sm text-slate-400">Unit Sizes</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">$0</p>
              <p className="mt-1 text-sm text-slate-400">Setup Fees</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Ready to declutter?</h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          Create your free account, reserve a unit, and start logging your inventory in minutes.
        </p>
        <Link
          to="/signup"
          className="mt-8 inline-block rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Get Started
        </Link>
      </section>
    </div>
  )
}
