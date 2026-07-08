import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Badge from '../components/Badge'

export default function Account() {
  const { currentUser, updateProfile } = useAuth()
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: currentUser.name, phone: currentUser.phone || '' })
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwError, setPwError] = useState('')

  function saveProfile(e) {
    e.preventDefault()
    updateProfile(currentUser.id, { name: form.name.trim(), phone: form.phone.trim() })
    showToast('Profile updated.')
  }

  function changePassword(e) {
    e.preventDefault()
    setPwError('')
    if (pwForm.current !== currentUser.password) {
      setPwError('Current password is incorrect.')
      return
    }
    if (pwForm.next.length < 6) {
      setPwError('New password must be at least 6 characters.')
      return
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('New passwords do not match.')
      return
    }
    updateProfile(currentUser.id, { password: pwForm.next })
    setPwForm({ current: '', next: '', confirm: '' })
    showToast('Password changed.')
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
      <p className="mt-1 text-slate-500">Manage your profile and security.</p>

      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-semibold text-indigo-700">
          {currentUser.name.charAt(0)}
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">{currentUser.name}</p>
          <p className="text-sm text-slate-500">{currentUser.email}</p>
          <div className="mt-1">
            <Badge status={currentUser.role} />
          </div>
        </div>
      </div>

      <form onSubmit={saveProfile} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900">Profile</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700">Full name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            disabled
            value={currentUser.email}
            className="mt-1 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
          Save Profile
        </button>
      </form>

      <form onSubmit={changePassword} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900">Change Password</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700">Current password</label>
          <input
            type="password"
            value={pwForm.current}
            onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">New password</label>
            <input
              type="password"
              value={pwForm.next}
              onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Confirm</label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
        {pwError && <p className="text-sm text-red-600">{pwError}</p>}
        <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          Update Password
        </button>
      </form>
    </div>
  )
}
