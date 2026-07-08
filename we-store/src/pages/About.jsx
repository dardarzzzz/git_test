import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">About We Store</h1>
      <p className="mt-6 max-w-3xl text-slate-600 leading-relaxed">
        We Store has been serving the community with clean, secure, and affordable self-storage since 2010.
        Our facility offers a range of unit sizes with optional climate control, 24/7 gated access, and
        round-the-clock video monitoring. We built our online portal so customers can manage their storage
        experience end-to-end — reserving units, tracking exactly what's inside them, and paying rent — without
        ever needing to visit the front office.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5">
          <MapPin className="mt-0.5 h-5 w-5 text-indigo-600" />
          <div>
            <p className="font-semibold text-slate-900">Address</p>
            <p className="text-sm text-slate-600">482 Harbor Point Rd, Riverside, CA 92501</p>
          </div>
        </div>
        <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5">
          <Phone className="mt-0.5 h-5 w-5 text-indigo-600" />
          <div>
            <p className="font-semibold text-slate-900">Phone</p>
            <p className="text-sm text-slate-600">(555) 010-2000</p>
          </div>
        </div>
        <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5">
          <Mail className="mt-0.5 h-5 w-5 text-indigo-600" />
          <div>
            <p className="font-semibold text-slate-900">Email</p>
            <p className="text-sm text-slate-600">support@westore.com</p>
          </div>
        </div>
        <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5">
          <Clock className="mt-0.5 h-5 w-5 text-indigo-600" />
          <div>
            <p className="font-semibold text-slate-900">Office Hours</p>
            <p className="text-sm text-slate-600">Mon–Sat 9am–6pm · Gate access 24/7</p>
          </div>
        </div>
      </div>
    </div>
  )
}
