import { useState } from 'react'
import { Key, Shield, Search, Plus, LogOut, ArrowLeft } from 'lucide-react'
import { License } from '../../types/auth'
import { getLicenses, updateLicenseExpiry, toggleLicenseStatus, generateNewLicense, isAdminLoggedIn, setAdminLoggedIn } from '../../services/authService'

export default function AdminApp() {
  const [isAdmin, setIsAdmin] = useState<boolean>(isAdminLoggedIn())
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')

  const [licenses, setLicenses] = useState<License[]>(getLicenses())
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Create license form modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newPlan, setNewPlan] = useState<'Enterprise AI' | 'Professional' | 'Starter'>('Enterprise AI')
  const [newValidDays, setNewValidDays] = useState(365)

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if ((adminEmail === 'admin@shipyardos.ai' && adminPassword === 'admin123') || !adminEmail) {
      setAdminLoggedIn(true)
      setIsAdmin(true)
      setAdminError('')
    } else {
      setAdminError('Invalid Admin Email or Password!')
    }
  }

  const handleAdminLogout = () => {
    setAdminLoggedIn(false)
    setIsAdmin(false)
  }

  const handleExtendDays = (key: string, daysToAdd: number) => {
    const target = licenses.find(l => l.key === key)
    if (!target) return
    const currentExpiry = new Date(target.expiryDate)
    currentExpiry.setDate(currentExpiry.getDate() + daysToAdd)
    const newDateStr = currentExpiry.toISOString().split('T')[0]
    const updated = updateLicenseExpiry(key, newDateStr, 'active')
    setLicenses(updated)
  }

  const handleManualDateChange = (key: string, newDateStr: string) => {
    if (!newDateStr) return
    const updated = updateLicenseExpiry(key, newDateStr)
    setLicenses(updated)
  }

  const handleStatusToggle = (key: string, newStatus: 'active' | 'expired' | 'suspended') => {
    const updated = toggleLicenseStatus(key, newStatus)
    setLicenses(updated)
  }

  const handleCreateLicense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserName || !newUserEmail || !newCompany) return
    generateNewLicense(newUserName, newUserEmail, newCompany, newPlan, newValidDays)
    setLicenses(getLicenses())
    setShowCreateModal(false)
    setNewUserName('')
    setNewUserEmail('')
    setNewCompany('')
  }

  const filteredLicenses = licenses.filter((l) => {
    const matchesSearch =
      l.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Render Admin Login
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md border border-slate-200 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md">
              <Shield size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">ShipyardOS Admin Portal</h1>
            <p className="text-xs font-medium text-slate-500 mt-1">Manage Users & License Expiration Dates</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@shipyardos.ai"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="admin123"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
            {adminError && <p className="text-xs font-bold text-red-600">{adminError}</p>}

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-xs"
            >
              Sign In to Admin Portal
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => { setAdminEmail('admin@shipyardos.ai'); setAdminPassword('admin123'); handleAdminLogin(); }}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              🚀 Quick Demo Admin Sign In
            </button>
          </div>
          <div className="mt-4 text-center">
            <a href="/" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium">
              <ArrowLeft size={12} /> Return to User Dashboard
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-none">ShipyardOS — Admin License Portal</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">User Expiration & License Key Manager</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <ArrowLeft size={14} /> To User Dashboard
          </a>
          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors"
          >
            <LogOut size={14} /> Admin Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* KPI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Registered Licenses', value: licenses.length, color: 'text-blue-600' },
            { label: 'Active Licenses', value: licenses.filter(l => l.status === 'active').length, color: 'text-emerald-600' },
            { label: 'Expired Licenses', value: licenses.filter(l => l.status === 'expired').length, color: 'text-red-600' },
            { label: 'Suspended Licenses', value: licenses.filter(l => l.status === 'suspended').length, color: 'text-amber-600' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter & Actions Bar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative min-w-[240px] flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search email, name, company, or license key..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-1">
              {['all', 'active', 'expired', 'suspended'].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    statusFilter === f ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            <Plus size={15} /> Create New License
          </button>
        </div>

        {/* License Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                <th className="p-3.5">License Key</th>
                <th className="p-3.5">User / Company</th>
                <th className="p-3.5">Plan</th>
                <th className="p-3.5">Expiration Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Expiration Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredLicenses.map((lic) => (
                <tr key={lic.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-mono text-blue-700 font-bold">{lic.key}</td>
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{lic.userName}</p>
                    <p className="text-[11px] text-slate-500">{lic.userEmail} • {lic.company}</p>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800">{lic.plan}</td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={lic.expiryDate}
                        onChange={(e) => handleManualDateChange(lic.key, e.target.value)}
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className={`badge ${lic.status === 'active' ? 'badge-success' : lic.status === 'expired' ? 'badge-danger' : 'badge-warning'} uppercase font-bold text-[10px]`}>
                      {lic.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-1">
                    <button
                      onClick={() => handleExtendDays(lic.key, 30)}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded font-bold hover:bg-blue-100 transition-colors text-[11px]"
                      title="Extend 30 Days"
                    >
                      +30 Days
                    </button>
                    <button
                      onClick={() => handleExtendDays(lic.key, 365)}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold hover:bg-emerald-100 transition-colors text-[11px]"
                      title="Extend 1 Year"
                    >
                      +1 Year
                    </button>
                    {lic.status === 'active' ? (
                      <button
                        onClick={() => handleStatusToggle(lic.key, 'suspended')}
                        className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded font-bold hover:bg-amber-100 transition-colors text-[11px]"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusToggle(lic.key, 'active')}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold hover:bg-emerald-100 transition-colors text-[11px]"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Create License Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Key size={18} className="text-emerald-600" /> Create New User License
            </h3>
            <form onSubmit={handleCreateLicense} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">User Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Ir. Bambang Wijaya"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">User Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="bambang@shipyard.co.id"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Shipyard</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="PT Dok & Perkapalan Surabaya"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">License Plan</label>
                  <select
                    value={newPlan}
                    onChange={(e: any) => setNewPlan(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                  >
                    <option value="Enterprise AI">Enterprise AI</option>
                    <option value="Professional">Professional</option>
                    <option value="Starter">Starter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Validity (Days)</label>
                  <select
                    value={newValidDays}
                    onChange={(e) => setNewValidDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                  >
                    <option value={30}>30 Days (1 Month)</option>
                    <option value={90}>90 Days (3 Months)</option>
                    <option value={365}>365 Days (1 Year)</option>
                    <option value={730}>730 Days (2 Years)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  Generate License
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
