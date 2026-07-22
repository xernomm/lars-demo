import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  FolderKanban, Cog, Wrench, Paintbrush,
  Shield, Camera, Microscope, FileText,
  Rocket, Navigation, BarChart3, Bot,
  Package, QrCode, Settings, LogOut,
  Anchor, ClipboardCheck, Ship
} from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  activeModule: string
  setActiveModule: (module: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

interface ModuleItem {
  id: string
  label: string
  icon: any
}

interface ModuleCategory {
  name: string
  icon: any
  items: ModuleItem[]
}

const categories: ModuleCategory[] = [
  {
    name: 'Planning & Engineering',
    icon: FolderKanban,
    items: [
      { id: 'project-management', label: 'Project Management', icon: FolderKanban },
      { id: 'engineering-management', label: 'Engineering Management', icon: Cog },
    ],
  },
  {
    name: 'Supply Chain & Material',
    icon: Package,
    items: [
      { id: 'procurement', label: 'Procurement & MRP', icon: Package },
      { id: 'material-tracking', label: 'Material Tracking', icon: QrCode },
    ],
  },
  {
    name: 'Production & Operations',
    icon: Wrench,
    items: [
      { id: 'production-control', label: 'Production Control', icon: ClipboardCheck },
      { id: 'welding', label: 'Welding Management', icon: Wrench },
      { id: 'painting', label: 'Painting Management', icon: Paintbrush },
      { id: 'outfitting', label: 'Outfitting Management', icon: Settings },
    ],
  },
  {
    name: 'Quality & Inspection',
    icon: Shield,
    items: [
      { id: 'qa-qc', label: 'QA/QC Management', icon: Shield },
      { id: 'surveyor-ai', label: 'Surveyor AI Engine', icon: Camera },
      { id: 'ndt', label: 'NDT Management', icon: Microscope },
      { id: 'document-mgmt', label: 'Document Management', icon: FileText },
    ],
  },
  {
    name: 'Completion & Executive',
    icon: Ship,
    items: [
      { id: 'launching', label: 'Launching Management', icon: Rocket },
      { id: 'sea-trial', label: 'Sea Trial Management', icon: Navigation },
      { id: 'ceo-dashboard', label: 'CEO Dashboard', icon: BarChart3 },
      { id: 'ai-maritime', label: 'AI Maritime Expert', icon: Bot },
    ],
  },
]

export default function Sidebar({ activeModule, setActiveModule, sidebarOpen, setSidebarOpen }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Planning & Engineering', 'Production & Operations'])
  )

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  return (
    <div
      className={`bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col overflow-hidden shadow-xs ${
        sidebarOpen ? 'w-64' : 'w-[60px]'
      }`}
    >
      {/* Toggle Header */}
      <div className="p-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
        {sidebarOpen && (
          <div className="flex items-center gap-2 fade-in">
            <Anchor size={18} className="text-blue-600" />
            <div>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider leading-none">Module Navigation</h2>
              <p className="text-[10px] text-slate-500 font-medium">16 Integrated Modules</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 hover:bg-slate-200/60 text-slate-500 rounded-lg transition-colors"
        >
          {sidebarOpen ? (
            <ChevronLeft size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {categories.map((category) => {
          const CategoryIcon = category.icon
          const isExpanded = expandedCategories.has(category.name)
          const hasActiveChild = category.items.some((item) => item.id === activeModule)

          return (
            <div key={category.name} className="mb-1">
              {/* Category Header */}
              <button
                onClick={() => {
                  if (sidebarOpen) toggleCategory(category.name)
                  else {
                    setSidebarOpen(true)
                    setExpandedCategories(prev => new Set(prev).add(category.name))
                  }
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-all hover:bg-slate-100 ${
                  hasActiveChild ? 'text-blue-600 font-semibold' : 'text-slate-600'
                }`}
              >
                <CategoryIcon size={16} className={`flex-shrink-0 ${hasActiveChild ? 'text-blue-600' : 'text-slate-400'}`} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-[11px] font-bold uppercase tracking-wider truncate text-slate-600">
                      {category.name}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={14} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={14} className="text-slate-400" />
                    )}
                  </>
                )}
              </button>

              {/* Module Items */}
              {sidebarOpen && isExpanded && (
                <div className="ml-3 border-l-2 border-slate-100 fade-in space-y-0.5 my-1">
                  {category.items.map((item) => {
                    const ItemIcon = item.icon
                    const isActive = activeModule === item.id

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveModule(item.id)}
                        className={`w-full flex items-center gap-2.5 pl-3 pr-3 py-2 text-xs font-medium rounded-r-lg transition-all group ${
                          isActive
                            ? 'text-blue-700 bg-blue-50/80 font-semibold border-l-2 border-blue-600 -ml-[2px]'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                        }`}
                      >
                        <ItemIcon
                          size={15}
                          className={`flex-shrink-0 transition-colors ${
                            isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span className="truncate text-[13px]">{item.label}</span>
                        {item.id === 'surveyor-ai' && (
                          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">
                            AI
                          </span>
                        )}
                        {item.id === 'ai-maritime' && (
                          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                            AI
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      {sidebarOpen && (
        <div className="border-t border-slate-100 p-3 space-y-1 bg-slate-50/50 fade-in">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors font-medium">
            <Settings size={14} className="text-slate-400" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium">
            <LogOut size={14} className="text-red-400" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}
