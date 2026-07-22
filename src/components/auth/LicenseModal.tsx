import { useState } from 'react'
import { ShieldCheck, Key, Calendar, Building, User as UserIcon, X, CheckCircle, AlertTriangle } from 'lucide-react'
import { User } from '../../types/auth'
import { getLicenses, setCurrentUser } from '../../services/authService'

interface LicenseModalProps {
  user: User
  onClose: () => void
  onUserUpdated: (user: User) => void
}

export default function LicenseModal({ user, onClose, onUserUpdated }: LicenseModalProps) {
  const [inputKey, setInputKey] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleActivateKey = () => {
    if (!inputKey.trim()) return
    const licenses = getLicenses()
    const targetLic = licenses.find(l => l.key.trim().toUpperCase() === inputKey.trim().toUpperCase())

    if (!targetLic) {
      setMessage({ type: 'error', text: 'Lisensi Key tidak ditemukan atau tidak valid.' })
      return
    }

    if (targetLic.status !== 'active') {
      setMessage({ type: 'error', text: `Lisensi Key ini dalam status ${targetLic.status.toUpperCase()}.` })
      return
    }

    const updatedUser: User = {
      ...user,
      licenseKey: targetLic.key,
      licenseType: targetLic.plan,
      licenseExpiry: targetLic.expiryDate,
      licenseStatus: targetLic.status,
    }

    setCurrentUser(updatedUser)
    onUserUpdated(updatedUser)
    setMessage({ type: 'success', text: 'Lisensi Key berhasil diperbarui!' })
    setInputKey('')
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg border border-slate-200 shadow-2xl animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Informasi Pengguna & Lisensi</h3>
              <p className="text-xs font-medium text-slate-500">Detail Lisensi Enterprise ShipyardOS</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            user.licenseStatus === 'active'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-red-50/70 border-red-200 text-red-900'
          }`}>
            <div className="flex items-center gap-2.5">
              {user.licenseStatus === 'active' ? (
                <CheckCircle size={20} className="text-emerald-600" />
              ) : (
                <AlertTriangle size={20} className="text-red-600" />
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">Status Lisensi: {user.licenseStatus}</p>
                <p className="text-xs font-medium mt-0.5 opacity-90">Paket: {user.licenseType}</p>
              </div>
            </div>
            <span className={`badge ${user.licenseStatus === 'active' ? 'badge-success' : 'badge-danger'} text-xs font-bold`}>
              {user.licenseStatus === 'active' ? 'AKTIF' : 'EXPIRED'}
            </span>
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 text-xs">
            <UserIcon size={15} className="text-slate-400" />
            <span className="text-slate-500 font-medium w-24">Pengguna:</span>
            <span className="text-slate-900 font-bold">{user.name} ({user.role})</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Building size={15} className="text-slate-400" />
            <span className="text-slate-500 font-medium w-24">Perusahaan:</span>
            <span className="text-slate-900 font-bold">{user.company}</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Key size={15} className="text-slate-400" />
            <span className="text-slate-500 font-medium w-24">License Key:</span>
            <span className="font-mono text-blue-700 font-bold">{user.licenseKey}</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Calendar size={15} className="text-slate-400" />
            <span className="text-slate-500 font-medium w-24">Masa Berlaku:</span>
            <span className="text-slate-900 font-bold">{user.licenseExpiry}</span>
          </div>
        </div>

        {/* Key Activation Form */}
        <div className="pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-800 mb-2">Aktivasi / Ganti License Key</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Masukkan License Key (cth: SHIPOS-ENT-2026-X9872)"
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 uppercase font-semibold"
            />
            <button
              onClick={handleActivateKey}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              Aktivasi
            </button>
          </div>
          {message && (
            <p className={`text-xs font-bold mt-2 ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
