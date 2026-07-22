import { useState } from 'react'
import { Settings, CheckSquare, Square, Package, Wrench } from 'lucide-react'

const equipment = [
  { id: 'EQ-001', name: 'Main Engine CAT C32', category: 'Mekanik', location: 'Engine Room', status: 'installed' as const, progress: 100 },
  { id: 'EQ-002', name: 'Generator Set 250kW', category: 'Elektrikal', location: 'Generator Room', status: 'installed' as const, progress: 100 },
  { id: 'EQ-003', name: 'Steering Gear System', category: 'Mekanik', location: 'Steering Room', status: 'in-progress' as const, progress: 65 },
  { id: 'EQ-004', name: 'Fire Fighting System', category: 'Safety', location: 'Throughout', status: 'in-progress' as const, progress: 40 },
  { id: 'EQ-005', name: 'Navigation Equipment', category: 'Elektrikal', location: 'Wheelhouse', status: 'pending' as const, progress: 0 },
  { id: 'EQ-006', name: 'HVAC System', category: 'Mekanik', location: 'Accommodation', status: 'pending' as const, progress: 0 },
  { id: 'EQ-007', name: 'Bilge/Ballast Pump', category: 'Mekanik', location: 'Engine Room', status: 'installed' as const, progress: 100 },
  { id: 'EQ-008', name: 'Anchor Windlass', category: 'Deck', location: 'Forecastle', status: 'in-progress' as const, progress: 80 },
]

const preCommChecklist = [
  { id: 1, system: 'Propulsion', item: 'Main Engine alignment check', checked: true },
  { id: 2, system: 'Propulsion', item: 'Shaft alignment verification', checked: true },
  { id: 3, system: 'Electrical', item: 'Insulation resistance test', checked: false },
  { id: 4, system: 'Electrical', item: 'Generator load test', checked: false },
  { id: 5, system: 'Piping', item: 'Pressure test bilge system', checked: true },
  { id: 6, system: 'Piping', item: 'Pressure test ballast system', checked: false },
  { id: 7, system: 'Safety', item: 'Fire alarm system test', checked: false },
  { id: 8, system: 'Safety', item: 'Emergency lighting test', checked: true },
]

const valveGrid = [
  { tag: 'V-001', type: 'Butterfly', size: 'DN150', pressure: '10 bar', location: 'Engine Room', status: 'installed' as const },
  { tag: 'V-002', type: 'Gate', size: 'DN100', pressure: '16 bar', location: 'Engine Room', status: 'installed' as const },
  { tag: 'V-003', type: 'Globe', size: 'DN50', pressure: '16 bar', location: 'Pump Room', status: 'pending' as const },
  { tag: 'V-004', type: 'Check', size: 'DN80', pressure: '10 bar', location: 'Bilge Line', status: 'installed' as const },
  { tag: 'V-005', type: 'Ball', size: 'DN25', pressure: '25 bar', location: 'Fuel Line', status: 'testing' as const },
  { tag: 'V-006', type: 'Butterfly', size: 'DN200', pressure: '10 bar', location: 'Ballast Line', status: 'pending' as const },
]

export default function OutfittingManagement() {
  const [checklist, setChecklist] = useState(preCommChecklist)
  const [activeTab, setActiveTab] = useState<'equipment' | 'checklist' | 'valve'>('equipment')

  const toggleCheck = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item))
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Outfitting Management</h1>
        <p className="text-sm text-slate-500 font-medium">Instalasi Peralatan & Pre-Commissioning</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Peralatan', value: equipment.length.toString(), color: 'text-blue-600' },
          { label: 'Terinstal', value: equipment.filter(e => e.status === 'installed').length.toString(), color: 'text-emerald-600' },
          { label: 'Sedang Dipasang', value: equipment.filter(e => e.status === 'in-progress').length.toString(), color: 'text-amber-600' },
          { label: 'Pre-Comm Progress', value: `${Math.round(checklist.filter(c => c.checked).length / checklist.length * 100)}%`, color: 'text-purple-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-slate-200/70 rounded-lg p-1 w-fit">
        {[
          { id: 'equipment' as const, label: 'Peralatan', icon: Package },
          { id: 'checklist' as const, label: 'Pre-Commissioning', icon: CheckSquare },
          { id: 'valve' as const, label: 'Valve & Piping', icon: Wrench },
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold transition-colors ${activeTab === tab.id ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
              <Icon size={14} />{tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'equipment' && (
        <div className="glass-card rounded-xl overflow-hidden shadow-xs">
          <table className="w-full table-dark">
            <thead><tr><th>ID</th><th>Peralatan</th><th>Kategori</th><th>Lokasi</th><th>Progress</th><th>Status</th></tr></thead>
            <tbody>
              {equipment.map((eq) => (
                <tr key={eq.id}>
                  <td className="font-mono text-blue-700 font-bold text-xs">{eq.id}</td>
                  <td className="text-slate-900 font-semibold">{eq.name}</td>
                  <td className="text-slate-700 font-medium">{eq.category}</td>
                  <td className="text-xs text-slate-500 font-medium">{eq.location}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${eq.progress === 100 ? 'bg-emerald-500' : eq.progress > 0 ? 'bg-blue-500' : 'bg-slate-300'}`} style={{ width: `${eq.progress}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{eq.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${eq.status === 'installed' ? 'badge-success' : eq.status === 'in-progress' ? 'badge-info' : 'badge-neutral'}`}>
                      {eq.status === 'installed' ? 'Terinstal' : eq.status === 'in-progress' ? 'Dipasang' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Checklist Pre-Commissioning</h3>
          <div className="space-y-2">
            {checklist.map((item) => (
              <button key={item.id} onClick={() => toggleCheck(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                  item.checked ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}>
                {item.checked ? <CheckSquare size={16} className="text-emerald-600" /> : <Square size={16} className="text-slate-400" />}
                <div className="flex-1">
                  <span className={`text-xs font-semibold ${item.checked ? 'text-slate-900' : 'text-slate-700'}`}>{item.item}</span>
                </div>
                <span className="badge badge-neutral text-[10px]">{item.system}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'valve' && (
        <div className="glass-card rounded-xl overflow-hidden shadow-xs">
          <table className="w-full table-dark">
            <thead><tr><th>Tag</th><th>Tipe</th><th>Ukuran</th><th>Tekanan</th><th>Lokasi</th><th>Status</th></tr></thead>
            <tbody>
              {valveGrid.map((v, i) => (
                <tr key={i}>
                  <td className="font-mono text-blue-700 font-bold text-xs">{v.tag}</td>
                  <td className="text-slate-900 font-semibold">{v.type}</td>
                  <td className="text-slate-700">{v.size}</td>
                  <td className="text-slate-700 font-medium">{v.pressure}</td>
                  <td className="text-xs text-slate-500 font-medium">{v.location}</td>
                  <td>
                    <span className={`badge ${v.status === 'installed' ? 'badge-success' : v.status === 'testing' ? 'badge-warning' : 'badge-neutral'}`}>
                      {v.status === 'installed' ? 'Terinstal' : v.status === 'testing' ? 'Testing' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
