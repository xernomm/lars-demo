import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Sparkles, Trash2 } from 'lucide-react'
import { generateContent, GeminiMessage } from '../../services/geminiService'
import MarkdownRenderer from '../MarkdownRenderer'

const promptChips = [
  'Tampilkan tabel aturan BKI untuk Uji Tangki',
  'Tabel persyaratan pengelasan lambung',
  'Tabel standar coating marine vessel',
  'Prosedur peluncuran kapal airbag',
  'Regulasi IACS untuk hull survey dalam tabel',
  'Standar NDT untuk butt weld',
  'Persyaratan stabilitas kapal barge',
  'SOP keselamatan kerja galangan',
  'Prosedur sea trial menurut BKI dalam tabel',
  'Acceptance criteria radiography test',
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function AIMaritimeExpert() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `# 🚢 AI Maritime Expert

Selamat datang di **ShipyardOS AI Maritime Expert** — asisten AI khusus bidang maritim yang dilengkapi pengetahuan mendalam dan dukungan format **tabel GFM Markdown**:

| Regulasi / Standar | Cakupan Utama | Lembaga Penerbit |
| :--- | :--- | :--- |
| **BKI Rules** | Konstruksi lambung, permesinan, & sistem las | Biro Klasifikasi Indonesia |
| **IACS Unified Requirements** | Standar internasional kekuatan & struktur | International Association of Classification Societies |
| **ABS Standards** | Fatigue assessment & marine safety | American Bureau of Shipping |
| **IMO Conventions** | SOLAS, MARPOL, PSPC coating standard | International Maritime Organization |

Silakan pilih topik di bawah atau ajukan pertanyaan Anda secara langsung.`,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<GeminiMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const response = await generateContent(text, 'ai-maritime', conversationHistory)
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      }
      setMessages(prev => [...prev, assistantMsg])
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text }] },
        { role: 'model', parts: [{ text: response }] },
      ])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Maaf, terjadi kesalahan. Silakan coba lagi.',
      }])
    }
    setIsLoading(false)
  }

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: '🚢 Chat telah direset. AI Maritime Expert siap membantu kembali!',
    }])
    setConversationHistory([])
  }

  return (
    <div className="h-full flex flex-col fade-in -m-6 bg-slate-50" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-xs">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">AI Maritime Expert</h1>
            <p className="text-xs text-slate-500 font-medium">Bertenaga Gemini 3.5 Flash — GFM Markdown & Table Support Enabled</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-success text-[10px] font-bold">● Online</span>
          <button onClick={clearChat} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500" title="Reset Chat">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} fade-in`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center mr-3 mt-1 flex-shrink-0 shadow-xs">
                <Bot size={16} className="text-blue-600" />
              </div>
            )}
            <div className={`max-w-3xl px-5 py-3.5 rounded-xl shadow-xs ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-xs font-medium'
                : 'bg-white border border-slate-200 rounded-bl-xs text-slate-800'
            }`}>
              {msg.role === 'assistant' ? (
                <MarkdownRenderer content={msg.content} />
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start fade-in">
            <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
              <Bot size={16} className="text-blue-600 animate-pulse" />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl rounded-bl-xs px-5 py-3 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                <span className="text-xs text-slate-500 font-medium ml-1">AI Maritime Expert sedang menyusun jawaban...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Chips */}
      {messages.length <= 1 && (
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex-shrink-0">
          <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
            <Sparkles size={12} className="text-emerald-600" /> Topik Populer:
          </p>
          <div className="flex flex-wrap gap-2">
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-xs font-semibold hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-slate-200 p-4 bg-white flex-shrink-0">
        <div className="max-w-4xl mx-auto flex gap-3">
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
            placeholder="Tanyakan tentang regulasi maritim, standar BKI, prosedur galangan..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-medium disabled:opacity-50"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-40 flex items-center gap-2 shadow-xs"
          >
            <Send size={16} />
            <span className="hidden sm:inline text-sm">Kirim</span>
          </button>
        </div>
      </div>
    </div>
  )
}
