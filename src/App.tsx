import { useState, useCallback, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import HeaderBar from './components/HeaderBar'
import MainContent from './components/MainContent'
import ChatPanel from './components/ChatPanel'
import NotificationPopup from './components/NotificationPopup'
import AdminApp from './components/admin/AdminApp'
import type { ProductionStep } from './types'
import { User } from './types/auth'
import { getCurrentUser } from './services/authService'
import './styles/index.css'

// Initial 27 production steps
const initialSteps: ProductionStep[] = [
  { id: 1, name: 'Project Planning', nameId: 'Perencanaan Proyek', status: 'done', progress: 100, workers: ['Ir. Budi S.', 'Ir. Andi R.', 'PM Team'], inspectionLogs: [{ date: '2026-01-10', inspector: 'Ir. Hadi', result: 'pass', notes: 'Dokumen perencanaan lengkap' }] },
  { id: 2, name: 'Design & Engineering', nameId: 'Desain & Rekayasa', status: 'done', progress: 100, workers: ['Ir. Budi S.', 'CAD Team'], inspectionLogs: [{ date: '2026-02-15', inspector: 'Ir. Hadi', result: 'pass', notes: 'Gambar disetujui BKI' }] },
  { id: 3, name: 'Material Procurement', nameId: 'Pengadaan Material', status: 'done', progress: 100, workers: ['Tim Procurement', 'Ir. Dewi K.'], inspectionLogs: [{ date: '2026-03-01', inspector: 'QC Team', result: 'pass', notes: 'Material sesuai spesifikasi' }] },
  { id: 4, name: 'Material Inspection', nameId: 'Inspeksi Material', status: 'done', progress: 100, workers: ['QC Inspector', 'Ir. Sari'], inspectionLogs: [{ date: '2026-03-10', inspector: 'Ir. Sari', result: 'pass', notes: 'Sertifikat material valid' }] },
  { id: 5, name: 'Steel Cutting', nameId: 'Pemotongan Baja', status: 'done', progress: 100, workers: ['Tim Cutting', 'Operator CNC'], inspectionLogs: [{ date: '2026-03-20', inspector: 'QC Team', result: 'pass', notes: 'Dimensi sesuai gambar' }] },
  { id: 6, name: 'Plate Preparation', nameId: 'Persiapan Pelat', status: 'in-progress', progress: 75, workers: ['Tim Fabrikasi A', 'Welder Senior'], inspectionLogs: [{ date: '2026-04-15', inspector: 'Ir. Hadi', result: 'pass', notes: 'Bending sesuai mal' }] },
  { id: 7, name: 'Sub-Assembly', nameId: 'Sub-Assembly', status: 'in-progress', progress: 60, workers: ['Tim Assembly B', 'Fitter Team'], inspectionLogs: [] },
  { id: 8, name: 'Welding - Hull', nameId: 'Pengelasan Hull', status: 'in-progress', progress: 45, workers: ['Ahmad S. (WS-001)', 'Budi S. (WS-002)', 'Tim Welding'], inspectionLogs: [{ date: '2026-05-10', inspector: 'Ir. Sari', result: 'conditional', notes: 'Minor porosity ditemukan pada joint B3-07' }] },
  { id: 9, name: 'Block Assembly', nameId: 'Perakitan Blok', status: 'pending', progress: 0, workers: ['Tim Erection'], inspectionLogs: [] },
  { id: 10, name: 'Block Erection', nameId: 'Ereksi Blok', status: 'pending', progress: 0, workers: ['Crane Team', 'Tim Erection'], inspectionLogs: [] },
  { id: 11, name: 'Hull Erection', nameId: 'Ereksi Hull', status: 'pending', progress: 0, workers: ['Tim Erection Senior'], inspectionLogs: [] },
  { id: 12, name: 'Structural Inspection', nameId: 'Inspeksi Struktural', status: 'pending', progress: 0, workers: ['BKI Surveyor', 'QC Team'], inspectionLogs: [] },
  { id: 13, name: 'Blasting & Cleaning', nameId: 'Blasting & Pembersihan', status: 'pending', progress: 0, workers: ['Tim Blasting'], inspectionLogs: [] },
  { id: 14, name: 'Prime Painting', nameId: 'Pengecatan Primer', status: 'pending', progress: 0, workers: ['Tim Painting A'], inspectionLogs: [] },
  { id: 15, name: 'Final Painting', nameId: 'Pengecatan Akhir', status: 'pending', progress: 0, workers: ['Tim Painting B'], inspectionLogs: [] },
  { id: 16, name: 'Outfitting - Mechanical', nameId: 'Outfitting Mekanik', status: 'pending', progress: 0, workers: ['Tim Mekanik'], inspectionLogs: [] },
  { id: 17, name: 'Outfitting - Electrical', nameId: 'Outfitting Elektrikal', status: 'pending', progress: 0, workers: ['Tim Elektrikal'], inspectionLogs: [] },
  { id: 18, name: 'Outfitting - Piping', nameId: 'Outfitting Pipa', status: 'pending', progress: 0, workers: ['Tim Piping'], inspectionLogs: [] },
  { id: 19, name: 'HVAC Installation', nameId: 'Instalasi HVAC', status: 'pending', progress: 0, workers: ['Tim HVAC'], inspectionLogs: [] },
  { id: 20, name: 'System Testing', nameId: 'Pengujian Sistem', status: 'pending', progress: 0, workers: ['Tim Commissioning'], inspectionLogs: [] },
  { id: 21, name: 'Final Inspection', nameId: 'Inspeksi Akhir', status: 'qa-hold', progress: 30, workers: ['BKI Surveyor', 'Owner Surveyor', 'QC Team'], inspectionLogs: [{ date: '2026-05-20', inspector: 'BKI Surveyor', result: 'fail', notes: 'Menunggu hasil NDT tambahan pada joint kritis' }] },
  { id: 22, name: 'Quality Assurance', nameId: 'Penjaminan Mutu', status: 'pending', progress: 0, workers: ['QA Manager'], inspectionLogs: [] },
  { id: 23, name: 'Tank Testing', nameId: 'Uji Tangki', status: 'pending', progress: 0, workers: ['Tim Testing', 'BKI Surveyor'], inspectionLogs: [] },
  { id: 24, name: 'Documentation Review', nameId: 'Review Dokumentasi', status: 'pending', progress: 0, workers: ['Document Control'], inspectionLogs: [] },
  { id: 25, name: 'Sea Trial Prep', nameId: 'Persiapan Sea Trial', status: 'pending', progress: 0, workers: ['Tim Sea Trial'], inspectionLogs: [] },
  { id: 26, name: 'Sea Trial Execution', nameId: 'Pelaksanaan Sea Trial', status: 'pending', progress: 0, workers: ['Kapten Uji', 'BKI Surveyor', 'Crew'], inspectionLogs: [] },
  { id: 27, name: 'Delivery & Handover', nameId: 'Serah Terima', status: 'pending', progress: 0, workers: ['PM Team', 'Owner Team'], inspectionLogs: [] },
]

interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(getCurrentUser())
  const [isAdminView, setIsAdminView] = useState<boolean>(window.location.pathname.startsWith('/admin'))
  const [activeModule, setActiveModule] = useState('ceo-dashboard')
  const [rightPanelWidth, setRightPanelWidth] = useState(340)
  const [isDraggingDivider, setIsDraggingDivider] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [productionSteps, setProductionSteps] = useState<ProductionStep[]>(initialSteps)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [toastNotifications, setToastNotifications] = useState<Notification[]>([])

  // Refresh current user from storage in case updated from admin panel
  useEffect(() => {
    const handleStorage = () => {
      setCurrentUser(getCurrentUser())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const handleMouseDown = () => {
    setIsDraggingDivider(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const handleMouseUp = () => {
    setIsDraggingDivider(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingDivider) return
    const container = e.currentTarget as HTMLElement
    const containerRect = container.getBoundingClientRect()
    const newWidth = containerRect.right - e.clientX
    if (newWidth >= 280 && newWidth <= 550) {
      setRightPanelWidth(newWidth)
    }
  }

  const handleSimulateScenario = useCallback(() => {
    setProductionSteps((prev) =>
      prev.map((step) =>
        step.id === 12
          ? {
              ...step,
              status: 'qa-hold' as const,
              progress: 60,
              inspectionLogs: [
                ...step.inspectionLogs,
                {
                  date: new Date().toISOString().split('T')[0],
                  inspector: 'AI Surveyor Engine',
                  result: 'fail' as const,
                  notes: 'Simulasi AI: Ditemukan potensi defect pada inspeksi struktural. Memerlukan NDT tambahan sebelum dapat melanjutkan.',
                },
              ],
            }
          : step
      )
    )

    const newNotification: Notification = {
      id: Date.now().toString(),
      type: 'error',
      title: '⚠️ QA Hold — Tahap #12',
      message: 'AI Surveyor Engine mendeteksi potensi defect pada Inspeksi Struktural (Tahap #12). Status diubah ke QA Hold. Diperlukan NDT tambahan.',
      timestamp: new Date(),
      read: false,
    }

    const infoNotification: Notification = {
      id: (Date.now() + 1).toString(),
      type: 'info',
      title: '🤖 Simulasi AI Selesai',
      message: 'Skenario AI berhasil dijalankan. Analisis inspeksi otomatis telah memperbarui status Production Control.',
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, infoNotification, ...prev])
    setToastNotifications([newNotification, infoNotification])

    setTimeout(() => {
      setActiveModule('production-control')
    }, 1500)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToastNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const isFullWidthModule = activeModule === 'ai-maritime'

  // If Admin View is active, render Admin Portal
  if (isAdminView) {
    return <AdminApp />
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderBar
          currentUser={currentUser}
          onUserUpdated={setCurrentUser}
          onSimulateScenario={handleSimulateScenario}
          notifications={notifications}
          onOpenAdmin={() => setIsAdminView(true)}
        />

        <div
          className="flex-1 flex overflow-hidden bg-slate-50"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <MainContent
              activeModule={activeModule}
              productionSteps={productionSteps}
            />
          </div>

          {/* Resizable Divider */}
          {!isFullWidthModule && (
            <div
              className="drag-divider flex-shrink-0"
              onMouseDown={handleMouseDown}
            />
          )}

          {/* Right Chat Panel */}
          {!isFullWidthModule && (
            <div
              className="bg-white border-l border-slate-200 overflow-hidden flex-shrink-0 shadow-xs"
              style={{ width: `${rightPanelWidth}px` }}
            >
              <ChatPanel activeModule={activeModule} />
            </div>
          )}
        </div>
      </div>

      <NotificationPopup
        notifications={toastNotifications}
        onDismiss={dismissToast}
      />
    </div>
  )
}
