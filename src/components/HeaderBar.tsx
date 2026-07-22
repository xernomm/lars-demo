import { useState, useEffect } from 'react'
import {
  Anchor, Zap, Bell, Cpu, ChevronDown,
  Activity, Wifi, WifiOff, ShieldCheck, Shield
} from 'lucide-react'
import { checkApiConnection } from '../services/geminiService'
import { User } from '../types/auth'
import LicenseModal from './auth/LicenseModal'

interface HeaderBarProps {
  currentUser: User
  onUserUpdated: (user: User) => void
  onSimulateScenario: () => void
  notifications: Array<{ id: string; type: string; title: string; message: string }>
  onOpenAdmin: () => void
}

export default function HeaderBar({ currentUser, onUserUpdated, onSimulateScenario, notifications, onOpenAdmin }: HeaderBarProps) {
  const [apiConnected, setApiConnected] = useState<boolean | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showLicenseModal, setShowLicenseModal] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    checkApiConnection().then(setApiConnected)
  }, [])

  const handleSimulate = async () => {
    setIsSimulating(true)
    onSimulateScenario()
    setTimeout(() => setIsSimulating(false), 2000)
  }

  const unreadCount = notifications.filter((n: any) => !n.read).length

  return (
    <header className="bg-white border-b border-slate-200 h-14 flex items-center justify-between px-4 z-30 relative shadow-sm">
      {/* Left — Logo & Project */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-sm">
            <Anchor size={18} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-slate-900 leading-none">ShipyardOS AI</h1>
            <p className="text-[10px] text-slate-500 font-medium">Enterprise Platform</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 ml-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Activity size={12} className="text-blue-600" />
            Project: 300 FT Barge #001
          </span>
        </div>
      </div>

      {/* Center — Status & License Pills */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Active License Badge Pill */}
        <button
          onClick={() => setShowLicenseModal(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all hover:scale-105 ${
            currentUser.licenseStatus === 'active'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-red-50 text-red-800 border border-red-300'
          }`}
          title="Click to view or redeem license"
        >
          <ShieldCheck size={12} className={currentUser.licenseStatus === 'active' ? 'text-emerald-600' : 'text-red-600'} />
          License: {currentUser.licenseType} ({currentUser.licenseStatus === 'active' ? 'Active' : 'Expired'})
        </button>

        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          apiConnected === true
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : apiConnected === false
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}>
          {apiConnected === true ? <Wifi size={11} className="text-emerald-600" /> : apiConnected === false ? <WifiOff size={11} /> : <Activity size={11} />}
          LARS-AI API: {apiConnected === true ? 'Connected' : apiConnected === false ? 'Disconnected' : 'Checking...'}
        </span>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
          <Cpu size={11} className="text-sky-600" />
          AI Model: LARS-AI Engine
        </span>
      </div>

      {/* Right — Actions & User Profile */}
      <div className="flex items-center gap-2">
        {/* Simulate Scenario Button */}
        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
            isSimulating
              ? 'bg-amber-100 text-amber-800 cursor-wait border border-amber-300'
              : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-emerald-500 hover:to-teal-400 hover:shadow-md hover:shadow-emerald-500/20'
          }`}
        >
          <Zap size={14} className={isSimulating ? 'animate-spin' : ''} />
          {isSimulating ? 'Processing...' : 'Simulate AI Scenario'}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative text-slate-600"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 animate-slide-in-down">
              <div className="p-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-slate-500 text-center">No new notifications</p>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div key={n.id} className="p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          n.type === 'error' ? 'bg-red-500' : n.type === 'warning' ? 'bg-amber-500' : n.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 ml-1 pl-2 border-l border-slate-200 hover:opacity-90 transition-opacity"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shadow-xs font-bold text-xs text-white">
              {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 font-medium">{currentUser.role}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-2 space-y-1 animate-slide-in-down">
              <div className="p-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                <span className="badge badge-success text-[9px] mt-1">{currentUser.licenseType} License</span>
              </div>
              <button
                onClick={() => { setShowLicenseModal(true); setShowUserDropdown(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ShieldCheck size={14} className="text-emerald-600" /> License Details & Expiry
              </button>
              <button
                onClick={() => { onOpenAdmin(); setShowUserDropdown(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Shield size={14} className="text-blue-600" /> Admin Portal (/admin)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* License Modal */}
      {showLicenseModal && (
        <LicenseModal
          user={currentUser}
          onClose={() => setShowLicenseModal(false)}
          onUserUpdated={onUserUpdated}
        />
      )}
    </header>
  )
}
