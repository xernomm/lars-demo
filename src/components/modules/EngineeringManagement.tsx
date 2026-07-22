import { useState } from 'react'
import { Search, CheckCircle, XCircle, Clock, Eye, Sparkles, Loader2 } from 'lucide-react'
import { generateContent } from '../../services/geminiService'
import MarkdownRenderer from '../MarkdownRenderer'

const drawings = [
  { id: 'DWG-001', code: 'GA-001', name: 'General Arrangement', version: 'v2.1', status: 'approved' as const, author: 'Ir. Budi S.', date: '2026-02-15', type: 'General' },
  { id: 'DWG-002', code: 'HL-010', name: 'Hull Lines Plan', version: 'v1.3', status: 'approved' as const, author: 'Ir. Andi R.', date: '2026-02-20', type: 'Hull' },
  { id: 'DWG-003', code: 'ST-021', name: 'Midship Section', version: 'v1.0', status: 'approved' as const, author: 'Ir. Budi S.', date: '2026-03-01', type: 'Structure' },
  { id: 'DWG-004', code: 'ST-022', name: 'Frame Spacing Detail', version: 'v1.2', status: 'revision' as const, author: 'Ir. Andi R.', date: '2026-03-10', type: 'Structure' },
  { id: 'DWG-005', code: 'PL-005', name: 'Piping Layout Engine Room', version: 'v1.0', status: 'pending' as const, author: 'Ir. Dewi K.', date: '2026-03-15', type: 'Piping' },
  { id: 'DWG-006', code: 'EL-003', name: 'Electrical Single Line Diagram', version: 'v1.1', status: 'approved' as const, author: 'Ir. Rudi H.', date: '2026-03-20', type: 'Electrical' },
  { id: 'DWG-007', code: 'ST-030', name: 'Deck Structure Plan', version: 'v1.0', status: 'rejected' as const, author: 'Ir. Andi R.', date: '2026-04-01', type: 'Structure' },
  { id: 'DWG-008', code: 'OT-001', name: 'Outfitting Plan', version: 'v1.0', status: 'pending' as const, author: 'Ir. Dewi K.', date: '2026-04-05', type: 'Outfitting' },
]

export default function EngineeringManagement() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedDrawing, setSelectedDrawing] = useState<string | null>(null)

  const filtered = drawings.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.code.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || d.status === filter
    return matchSearch && matchFilter
  })

  const handleAIScan = async (drawingName: string) => {
    setIsAnalyzing(true)
    setSelectedDrawing(drawingName)
    try {
      const result = await generateContent(
        `Analisis gambar teknik kapal "${drawingName}" dan berikan review meliputi:
1. Kelengkapan informasi yang biasanya harus ada
2. Potensi masalah atau kekurangan
3. Kesesuaian dengan standar BKI
4. Rekomendasi perbaikan
Berikan dalam format terstruktur dan jika memungkinkan tampilkan poin-poin atau tabel ringkasan.`,
        'engineering-management'
      )
      setAiResult(result)
    } catch {
      setAiResult('⚠️ Gagal menganalisis gambar. Silakan coba lagi.')
    }
    setIsAnalyzing(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <span className="badge badge-success"><CheckCircle size={10} className="mr-1" /> Disetujui</span>
      case 'revision': return <span className="badge badge-warning"><Clock size={10} className="mr-1" /> Revisi</span>
      case 'rejected': return <span className="badge badge-danger"><XCircle size={10} className="mr-1" /> Ditolak</span>
      default: return <span className="badge badge-neutral"><Clock size={10} className="mr-1" /> Menunggu</span>
    }
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Engineering Management</h1>
        <p className="text-sm text-slate-500 font-medium">Repositori Gambar Teknik & CAD — Barge 300 FT</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Gambar', value: '48', color: 'text-blue-600' },
          { label: 'Disetujui', value: '32', color: 'text-emerald-600' },
          { label: 'Revisi', value: '8', color: 'text-amber-600' },
          { label: 'Menunggu', value: '8', color: 'text-slate-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari gambar teknik..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>
        <div className="flex gap-1">
          {['all', 'approved', 'revision', 'pending', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === f ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? 'Semua' : f === 'approved' ? 'Disetujui' : f === 'revision' ? 'Revisi' : f === 'pending' ? 'Menunggu' : 'Ditolak'}
            </button>
          ))}
        </div>
      </div>

      {/* Drawings Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xs">
        <table className="w-full table-dark">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama Gambar</th>
              <th>Versi</th>
              <th>Jenis</th>
              <th>Status</th>
              <th>Penyusun</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id}>
                <td className="font-mono text-blue-700 font-bold text-xs">{d.code}</td>
                <td className="font-semibold text-slate-800">{d.name}</td>
                <td>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200">{d.version}</span>
                </td>
                <td>{d.type}</td>
                <td>{getStatusBadge(d.status)}</td>
                <td>{d.author}</td>
                <td className="text-xs font-medium text-slate-500">{d.date}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors" title="Lihat">
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => handleAIScan(d.name)}
                      className="p-1.5 hover:bg-emerald-50 rounded text-emerald-600 hover:text-emerald-700 transition-colors group"
                      title="Pindai Gambar dengan AI"
                    >
                      <Sparkles size={15} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Analysis Result */}
      {(isAnalyzing || aiResult) && (
        <div className="glass-card rounded-xl p-5 border border-emerald-200 bg-emerald-50/30 slide-in">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Analisis AI — {selectedDrawing}</h3>
            {isAnalyzing && <Loader2 size={14} className="text-emerald-600 animate-spin" />}
          </div>
          {isAnalyzing ? (
            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span>Gemini AI sedang menganalisis gambar...</span>
            </div>
          ) : (
            <MarkdownRenderer content={aiResult || ''} />
          )}
          {aiResult && (
            <button onClick={() => { setAiResult(null); setSelectedDrawing(null) }} className="mt-3 text-xs text-slate-500 hover:text-slate-700 transition-colors font-medium">
              Tutup hasil analisis
            </button>
          )}
        </div>
      )}
    </div>
  )
}
