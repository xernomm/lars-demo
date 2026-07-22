import { Send, Maximize2, Minimize2, X, Bot, Sparkles, Trash2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { generateContent, GeminiMessage } from '../services/geminiService'
import MarkdownRenderer from './MarkdownRenderer'

interface ChatPanelProps {
  activeModule: string
}

const contextualPrompts: Record<string, string[]> = {
  'project-management': [
    'Tampilkan tabel status proyek Barge 300 FT',
    'Analisis varian budget proyek',
    'Risiko keterlambatan jadwal',
  ],
  'engineering-management': [
    'Tabel daftar gambar teknik terbaru',
    'Standar BKI untuk hull structure',
    'Checklist approval gambar',
  ],
  'procurement': [
    'Tabel status pengadaan material',
    'Perbandingan vendor steel plate',
    'Estimasi biaya material outstanding',
  ],
  'material-tracking': [
    'Laporan stok material terkini',
    'Material yang perlu reorder',
    'Traceability heat number',
  ],
  'production-control': [
    'Tabel progress 27 tahap produksi',
    'Analisis bottleneck produksi',
    'Prediksi delay potensial',
  ],
  'welding': [
    'Tabel analisis defect rate pengelasan',
    'Sertifikat welder yang akan expired',
    'Rekomendasi improvement welding',
  ],
  'painting': [
    'Laporan DFT measurement terkini',
    'Status surface preparation',
    'Analisis efisiensi cat',
  ],
  'outfitting': [
    'Status instalasi peralatan',
    'Checklist pre-commissioning',
    'Progress piping installation',
  ],
  'qa-qc': [
    'Ringkasan inspeksi minggu ini dalam tabel',
    'NCR yang masih terbuka',
    'Hold point status tracker',
  ],
  'surveyor-ai': [
    'Cara menggunakan inspeksi AI',
    'Standar inspeksi visual BKI',
    'Kategori severity defect',
  ],
  'ndt': [
    'Tabel hasil NDT terbaru',
    'Acceptance criteria RT/UT',
    'Mapping lokasi defect',
  ],
  'document-mgmt': [
    'Daftar sertifikat yang akan expired',
    'Status dokumen kelas BKI',
    'Checklist dokumen delivery',
  ],
  'launching': [
    'Perbandingan metode launching',
    'Safety checklist peluncuran',
    'Perhitungan buoyancy',
  ],
  'sea-trial': [
    'Tabel hasil uji sea trial BKI',
    'Parameter stability test',
    'Checklist towing trial',
  ],
  'ceo-dashboard': [
    'Ringkasan eksekutif proyek',
    'Analisis KPI operasional',
    'Forecast penyelesaian proyek',
  ],
  'ai-maritime': [
    'Tabel aturan BKI untuk Uji Tangki',
    'Persyaratan Pengelasan Lambung',
    'Standar coating marine vessel',
    'Prosedur peluncuran kapal airbag',
    'Regulasi IACS untuk hull survey',
  ],
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPanel({ activeModule }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '🚢 Halo! Saya **ShipyardOS AI Assistant**. Saya siap membantu Anda dengan informasi terkait galangan kapal, produksi, inspeksi, dan regulasi maritim dengan dukungan format markdown & tabel GFM.',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFloating, setIsFloating] = useState(false)
  const [floatingPos, setFloatingPos] = useState({ x: window.innerWidth - 440, y: 80 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [conversationHistory, setConversationHistory] = useState<GeminiMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const floatingRef = useRef<HTMLDivElement>(null)

  const prompts = contextualPrompts[activeModule] || contextualPrompts['production-control']

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!isDragging) return
    const handleMove = (e: MouseEvent) => {
      setFloatingPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y })
    }
    const handleUp = () => setIsDragging(false)
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [isDragging, dragOffset])

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    const newHistory: GeminiMessage[] = [
      ...conversationHistory,
      { role: 'user', parts: [{ text }] },
    ]

    try {
      const response = await generateContent(text, activeModule, conversationHistory)
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      }
      setMessages((prev) => [...prev, assistantMsg])
      setConversationHistory([
        ...newHistory,
        { role: 'model', parts: [{ text: response }] },
      ])
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi dalam beberapa saat.',
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: '🚢 Chat telah direset. Saya siap membantu kembali!',
    }])
    setConversationHistory([])
  }

  const chatContent = (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} fade-in`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-1 flex-shrink-0 shadow-xs border border-blue-200">
                <Bot size={13} className="text-blue-600" />
              </div>
            )}
            <div
              className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed shadow-xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs font-medium'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
              }`}
            >
              {msg.role === 'assistant' ? (
                <MarkdownRenderer content={msg.content} />
              ) : (
                <span>{msg.content}</span>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start fade-in">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-1 flex-shrink-0 border border-blue-200">
              <Bot size={13} className="text-blue-600 animate-pulse" />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl rounded-bl-xs px-3 py-2 shadow-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[10px] text-slate-500 ml-1 font-medium">Menganalisis...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-3 py-2 border-t border-slate-200 bg-white">
          <p className="text-[10px] text-slate-500 mb-1.5 flex items-center gap-1 font-semibold">
            <Sparkles size={10} className="text-emerald-600" /> Pertanyaan Cepat:
          </p>
          <div className="space-y-1">
            {prompts.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="w-full text-left text-[11px] p-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg transition-colors border border-slate-200 truncate font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-slate-200 p-3 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && !e.shiftKey) {
                e.preventDefault()
                handleSend(input)
              }
            }}
            placeholder="Ketik pertanyaan..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 disabled:opacity-50 font-medium"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-40 shadow-xs"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </>
  )

  if (isFloating) {
    return (
      <div
        ref={floatingRef}
        className="fixed bg-white rounded-xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden"
        style={{ width: '400px', height: '520px', left: `${floatingPos.x}px`, top: `${floatingPos.y}px` }}
      >
        <div
          className="p-3 border-b border-slate-200 flex items-center justify-between cursor-move bg-slate-50"
          onMouseDown={(e) => {
            if ((e.target as HTMLElement).closest('[data-no-drag]')) return
            setIsDragging(true)
            setDragOffset({ x: e.clientX - floatingPos.x, y: e.clientY - floatingPos.y })
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
              <Bot size={13} className="text-white" />
            </div>
            <h3 className="text-xs font-bold text-slate-800">AI Assistant</h3>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">Live</span>
          </div>
          <div className="flex items-center gap-1" data-no-drag>
            <button onClick={clearChat} className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-500" title="Bersihkan Chat">
              <Trash2 size={13} />
            </button>
            <button onClick={() => setIsFloating(false)} className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-500" title="Dock">
              <Minimize2 size={13} />
            </button>
            <button onClick={() => setIsFloating(false)} className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-500" title="Tutup">
              <X size={13} />
            </button>
          </div>
        </div>
        {chatContent}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
            <Bot size={13} className="text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 leading-none">AI Assistant</h3>
            <p className="text-[9px] text-slate-500 font-medium">Gemini 3.5 Flash + GFM Markdown</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={clearChat} className="p-1.5 hover:bg-slate-200/60 rounded-lg transition-colors text-slate-500" title="Bersihkan Chat">
            <Trash2 size={14} />
          </button>
          <button onClick={() => setIsFloating(true)} className="p-1.5 hover:bg-slate-200/60 rounded-lg transition-colors text-slate-500" title="Pop Out">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>
      {chatContent}
    </div>
  )
}
