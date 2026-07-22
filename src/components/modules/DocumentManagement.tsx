import { useState } from 'react'
import { FileText, Search, FolderOpen, ChevronRight, ChevronDown, Download, Eye } from 'lucide-react'

interface FolderNode {
  name: string
  type: 'folder' | 'file'
  children?: FolderNode[]
  status?: 'valid' | 'expired' | 'pending'
  date?: string | null
  size?: string | null
}

const folderTree: FolderNode[] = [
  {
    name: 'BKI (Biro Klasifikasi Indonesia)', type: 'folder', children: [
      { name: 'Class Certificate', type: 'file', status: 'valid', date: '2026-01-15', size: '2.4 MB' },
      { name: 'Statutory Certificate', type: 'file', status: 'valid', date: '2026-01-15', size: '1.8 MB' },
      { name: 'Hull Construction Certificate', type: 'file', status: 'valid', date: '2026-03-20', size: '3.1 MB' },
      { name: 'Machinery Installation Certificate', type: 'file', status: 'pending', date: null, size: null },
      {
        name: 'Survey Reports', type: 'folder', children: [
          { name: 'Keel Laying Survey Report', type: 'file', status: 'valid', date: '2026-01-15', size: '5.2 MB' },
          { name: 'Block Assembly Survey Report', type: 'file', status: 'valid', date: '2026-03-20', size: '4.8 MB' },
          { name: 'Launching Survey Report', type: 'file', status: 'pending', date: null, size: null },
        ]
      },
    ]
  },
  {
    name: 'IACS (International Association)', type: 'folder', children: [
      { name: 'IACS UR S11 - Longitudinal Strength', type: 'file', status: 'valid', date: '2026-02-10', size: '1.2 MB' },
      { name: 'IACS UR W7 - Hull Survey', type: 'file', status: 'valid', date: '2026-02-10', size: '0.9 MB' },
      { name: 'IACS UR Z10 - Hull Surveys', type: 'file', status: 'valid', date: '2026-02-10', size: '1.5 MB' },
    ]
  },
  {
    name: 'ABS (American Bureau of Shipping)', type: 'folder', children: [
      { name: 'ABS Rules for Building & Classing', type: 'file', status: 'valid', date: '2026-01-05', size: '8.4 MB' },
      { name: 'ABS Guide for Fatigue Assessment', type: 'file', status: 'valid', date: '2026-01-05', size: '3.2 MB' },
    ]
  },
  {
    name: 'Gambar Teknik (Drawings)', type: 'folder', children: [
      { name: 'General Arrangement v2.1', type: 'file', status: 'valid', date: '2026-02-15', size: '15.4 MB' },
      { name: 'Hull Lines Plan v1.3', type: 'file', status: 'valid', date: '2026-02-20', size: '8.7 MB' },
      { name: 'Midship Section v1.0', type: 'file', status: 'valid', date: '2026-03-01', size: '6.2 MB' },
    ]
  },
  {
    name: 'Prosedur & Manual', type: 'folder', children: [
      { name: 'Welding Procedure Specification', type: 'file', status: 'valid', date: '2026-01-20', size: '2.1 MB' },
      { name: 'Painting Procedure', type: 'file', status: 'valid', date: '2026-01-20', size: '1.8 MB' },
      { name: 'Quality Control Plan', type: 'file', status: 'valid', date: '2026-01-15', size: '3.4 MB' },
    ]
  },
]

function FolderItem({ node, depth = 0, searchTerm }: { node: FolderNode; depth?: number; searchTerm: string }) {
  const [isOpen, setIsOpen] = useState(depth === 0)

  const matchesSearch = searchTerm && node.name.toLowerCase().includes(searchTerm.toLowerCase())

  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 transition-colors rounded-lg text-left ${matchesSearch ? 'bg-blue-50' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
        >
          {isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
          <FolderOpen size={16} className="text-amber-500" />
          <span className="text-xs font-bold text-slate-800">{node.name}</span>
          {node.children && <span className="text-[10px] font-semibold text-slate-400 ml-auto">{node.children.length} item</span>}
        </button>
        {isOpen && node.children?.map((child, i) => (
          <FolderItem key={i} node={child} depth={depth + 1} searchTerm={searchTerm} />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors rounded-lg ${matchesSearch ? 'bg-blue-50' : ''}`}
      style={{ paddingLeft: `${depth * 16 + 12}px` }}
    >
      <FileText size={15} className="text-blue-600 flex-shrink-0" />
      <span className="text-xs font-semibold text-slate-800 flex-1 truncate">{node.name}</span>
      {node.status && (
        <span className={`badge text-[9px] ${node.status === 'valid' ? 'badge-success' : node.status === 'expired' ? 'badge-danger' : 'badge-warning'}`}>
          {node.status === 'valid' ? 'Valid' : node.status === 'expired' ? 'Expired' : 'Pending'}
        </span>
      )}
      {node.size && <span className="text-[10px] font-medium text-slate-400">{node.size}</span>}
      <button className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors"><Eye size={13} /></button>
      <button className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors"><Download size={13} /></button>
    </div>
  )
}

export default function DocumentManagement() {
  const [search, setSearch] = useState('')

  const countFiles = (nodes: FolderNode[]): number => {
    return nodes.reduce((sum, n) => sum + (n.type === 'file' ? 1 : 0) + (n.children ? countFiles(n.children) : 0), 0)
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Document Management</h1>
        <p className="text-sm text-slate-500 font-medium">Repositori Sertifikat & Dokumen Kelas</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Dokumen', value: countFiles(folderTree).toString(), color: 'text-blue-600' },
          { label: 'Kategori', value: folderTree.length.toString(), color: 'text-purple-600' },
          { label: 'Valid', value: '15', color: 'text-emerald-600' },
          { label: 'Pending', value: '3', color: 'text-amber-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari dokumen, sertifikat, gambar..."
          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium shadow-xs"
        />
      </div>

      <div className="glass-card rounded-xl p-4 shadow-xs">
        <div className="space-y-0.5">
          {folderTree.map((node, i) => (
            <FolderItem key={i} node={node} searchTerm={search} />
          ))}
        </div>
      </div>
    </div>
  )
}
