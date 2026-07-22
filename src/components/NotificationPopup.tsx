import { useEffect } from 'react'
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react'

interface NotificationPopupProps {
  notifications: Array<{
    id: string
    type: 'info' | 'warning' | 'error' | 'success'
    title: string
    message: string
    timestamp: Date
  }>
  onDismiss: (id: string) => void
}

export default function NotificationPopup({ notifications, onDismiss }: NotificationPopupProps) {
  // Auto-dismiss after 6 seconds
  useEffect(() => {
    const timers = notifications.map((n) =>
      setTimeout(() => onDismiss(n.id), 6000)
    )
    return () => timers.forEach(clearTimeout)
  }, [notifications, onDismiss])

  if (notifications.length === 0) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-emerald-400" />
      case 'warning': return <AlertTriangle size={16} className="text-amber-400" />
      case 'error': return <XCircle size={16} className="text-red-400" />
      default: return <Info size={16} className="text-blue-400" />
    }
  }

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-emerald-500'
      case 'warning': return 'border-l-amber-500'
      case 'error': return 'border-l-red-500'
      default: return 'border-l-blue-500'
    }
  }

  return (
    <div className="fixed top-16 right-4 z-50 space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`pointer-events-auto glass rounded-lg border-l-4 ${getBorderColor(notification.type)} p-4 min-w-[320px] max-w-[400px] shadow-2xl animate-notification`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{getIcon(notification.type)}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white">{notification.title}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notification.message}</p>
            </div>
            <button
              onClick={() => onDismiss(notification.id)}
              className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
            >
              <X size={14} className="text-slate-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
