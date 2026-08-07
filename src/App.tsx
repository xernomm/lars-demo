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
  { id: 1, name: 'Project Planning', nameId: 'Project Planning', status: 'done', progress: 100, workers: ['Ir. Budi S.', 'Ir. Andi R.', 'PM Team'], inspectionLogs: [{ date: '2026-01-10', inspector: 'Ir. Hadi', result: 'pass', notes: 'Planning documentation completed' }] },
  { id: 2, name: 'Design & Engineering', nameId: 'Design & Engineering', status: 'done', progress: 100, workers: ['Ir. Budi S.', 'CAD Team'], inspectionLogs: [{ date: '2026-02-15', inspector: 'Ir. Hadi', result: 'pass', notes: 'Drawings approved by BKI' }] },
  { id: 3, name: 'Material Procurement', nameId: 'Material Procurement', status: 'done', progress: 100, workers: ['Procurement Team', 'Ir. Dewi K.'], inspectionLogs: [{ date: '2026-03-01', inspector: 'QC Team', result: 'pass', notes: 'Material meets specs' }] },
  { id: 4, name: 'Material Inspection', nameId: 'Material Inspection', status: 'done', progress: 100, workers: ['QC Inspector', 'Ir. Sari'], inspectionLogs: [{ date: '2026-03-10', inspector: 'Ir. Sari', result: 'pass', notes: 'Material certificates valid' }] },
  { id: 5, name: 'Steel Cutting', nameId: 'Steel Cutting', status: 'done', progress: 100, workers: ['Cutting Team', 'CNC Operator'], inspectionLogs: [{ date: '2026-03-20', inspector: 'QC Team', result: 'pass', notes: 'Dimensions match drawing' }] },
  { id: 6, name: 'Plate Preparation', nameId: 'Plate Preparation', status: 'in-progress', progress: 75, workers: ['Fabrication Team A', 'Senior Welder'], inspectionLogs: [{ date: '2026-04-15', inspector: 'Ir. Hadi', result: 'pass', notes: 'Plate bending verified' }] },
  { id: 7, name: 'Sub-Assembly', nameId: 'Sub-Assembly', status: 'in-progress', progress: 60, workers: ['Assembly Team B', 'Fitter Team'], inspectionLogs: [] },
  { id: 8, name: 'Welding - Hull', nameId: 'Hull Welding', status: 'in-progress', progress: 45, workers: ['Ahmad S. (WS-001)', 'Budi S. (WS-002)', 'Welding Team'], inspectionLogs: [{ date: '2026-05-10', inspector: 'Ir. Sari', result: 'conditional', notes: 'Minor porosity found on B3-07 joint' }] },
  { id: 9, name: 'Block Assembly', nameId: 'Block Assembly', status: 'pending', progress: 0, workers: ['Erection Team'], inspectionLogs: [] },
  { id: 10, name: 'Block Erection', nameId: 'Block Erection', status: 'pending', progress: 0, workers: ['Crane Team', 'Erection Team'], inspectionLogs: [] },
  { id: 11, name: 'Hull Erection', nameId: 'Hull Erection', status: 'pending', progress: 0, workers: ['Senior Erection Team'], inspectionLogs: [] },
  { id: 12, name: 'Structural Inspection', nameId: 'Structural Inspection', status: 'pending', progress: 0, workers: ['BKI Surveyor', 'QC Team'], inspectionLogs: [] },
  { id: 13, name: 'Blasting & Cleaning', nameId: 'Blasting & Cleaning', status: 'pending', progress: 0, workers: ['Blasting Team'], inspectionLogs: [] },
  { id: 14, name: 'Prime Painting', nameId: 'Primer Painting', status: 'pending', progress: 0, workers: ['Painting Team A'], inspectionLogs: [] },
  { id: 15, name: 'Final Painting', nameId: 'Final Painting', status: 'pending', progress: 0, workers: ['Painting Team B'], inspectionLogs: [] },
  { id: 16, name: 'Outfitting - Mechanical', nameId: 'Mechanical Outfitting', status: 'pending', progress: 0, workers: ['Mechanical Team'], inspectionLogs: [] },
  { id: 17, name: 'Outfitting - Electrical', nameId: 'Electrical Outfitting', status: 'pending', progress: 0, workers: ['Electrical Team'], inspectionLogs: [] },
  { id: 18, name: 'Outfitting - Piping', nameId: 'Piping Outfitting', status: 'pending', progress: 0, workers: ['Piping Team'], inspectionLogs: [] },
  { id: 19, name: 'HVAC Installation', nameId: 'HVAC Installation', status: 'pending', progress: 0, workers: ['HVAC Team'], inspectionLogs: [] },
  { id: 20, name: 'System Testing', nameId: 'System Testing', status: 'pending', progress: 0, workers: ['Commissioning Team'], inspectionLogs: [] },
  { id: 21, name: 'Final Inspection', nameId: 'Final Inspection', status: 'qa-hold', progress: 30, workers: ['BKI Surveyor', 'Owner Surveyor', 'QC Team'], inspectionLogs: [{ date: '2026-05-20', inspector: 'BKI Surveyor', result: 'fail', notes: 'Awaiting additional NDT results on critical joint' }] },
  { id: 22, name: 'Quality Assurance', nameId: 'Quality Assurance', status: 'pending', progress: 0, workers: ['QA Manager'], inspectionLogs: [] },
  { id: 23, name: 'Tank Testing', nameId: 'Tank Testing', status: 'pending', progress: 0, workers: ['Testing Team', 'BKI Surveyor'], inspectionLogs: [] },
  { id: 24, name: 'Documentation Review', nameId: 'Documentation Review', status: 'pending', progress: 0, workers: ['Document Control'], inspectionLogs: [] },
  { id: 25, name: 'Sea Trial Prep', nameId: 'Sea Trial Preparation', status: 'pending', progress: 0, workers: ['Sea Trial Team'], inspectionLogs: [] },
  { id: 26, name: 'Sea Trial Execution', nameId: 'Sea Trial Execution', status: 'pending', progress: 0, workers: ['Test Captain', 'BKI Surveyor', 'Crew'], inspectionLogs: [] },
  { id: 27, name: 'Delivery & Handover', nameId: 'Delivery & Handover', status: 'pending', progress: 0, workers: ['PM Team', 'Owner Team'], inspectionLogs: [] },
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
                  notes: 'AI Simulation: Potential defect identified during structural inspection. Additional NDT required before proceeding.',
                },
              ],
            }
          : step
      )
    )

    const newNotification: Notification = {
      id: Date.now().toString(),
      type: 'error',
      title: '⚠️ QA Hold — Step #12',
      message: 'AI Surveyor Engine detected structural inspection defect (Step #12). Status set to QA Hold. Additional NDT required.',
      timestamp: new Date(),
      read: false,
    }

    const infoNotification: Notification = {
      id: (Date.now() + 1).toString(),
      type: 'info',
      title: '🤖 AI Simulation Completed',
      message: 'AI Scenario executed successfully. Automatic inspection analysis updated Production Control status.',
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

  const isFullWidthModule = activeModule === 'ai-maritime' || activeModule === 'marine-traffic'

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
