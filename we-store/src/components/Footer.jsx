import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Logo />
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} We Store Self Storage. All rights reserved.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-500">
          <span>24/7 Gate Access</span>
          <span>Video Surveillance</span>
          <span>Climate-Controlled Units</span>
          <span>Month-to-Month Leases</span>
        </div>
      </div>
    </footer>
  )
}
