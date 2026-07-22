import { Send, Maximize2, Minimize2, X, Bot, Sparkles, Trash2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { generateContent, GeminiMessage } from '../services/geminiService'
import MarkdownRenderer from './MarkdownRenderer'

interface ChatPanelProps {
  activeModule: string
}

const contextualPrompts: Record<string, string[]> = {
  'project-management': [
    'Show project status summary table for 300 FT Barge',
    'Analyze budget variance & cost efficiency',
    'Evaluate schedule delay risks',
  ],
  'engineering-management': [
    'Display engineering drawings status table',
    'Review BKI rules for hull structure',
    'Check drawing approval checklist',
  ],
  'procurement': [
    'Show material procurement status table',
    'Compare steel plate vendors',
    'Estimate outstanding material costs',
  ],
  'material-tracking': [
    'Display current material inventory report',
    'List materials requiring reorder',
    'Verify heat number traceability',
  ],
  'production-control': [
    'Show 27 production steps progress table',
    'Analyze production bottlenecks',
    'Predict potential delay factors',
  ],
  'welding': [
    'Display welding defect rate analysis table',
    'List welders with expiring certificates',
    'Recommend welding quality improvements',
  ],
  'painting': [
    'Show recent DFT measurement log report',
    'Verify surface preparation standards',
    'Analyze coating consumption efficiency',
  ],
  'outfitting': [
    'Display equipment installation status',
    'Review pre-commissioning checklist',
    'Track piping installation progress',
  ],
  'qa-qc': [
    'Show weekly inspection summary table',
    'List open Non-Conformance Reports (NCR)',
    'Track Hold Point inspection status',
  ],
  'surveyor-ai': [
    'Guide to AI Surveyor Engine features',
    'BKI visual inspection standards overview',
    'Defect severity classification criteria',
  ],
  'ndt': [
    'Display latest NDT test results table',
    'Review RT/UT acceptance criteria',
    'Map defect locations on hull structure',
  ],
  'document-mgmt': [
    'List certificates expiring within 60 days',
    'Check BKI classification document status',
    'Delivery documentation checklist',
  ],
  'launching': [
    'Compare vessel launching methods',
    'Safety risk launching checklist',
    'Buoyancy and stability calculations',
  ],
  'sea-trial': [
    'Show sea trial test results table',
    'Inclining experiment & GM parameters',
    'Towing trial checklist',
  ],
  'ceo-dashboard': [
    'Generate AI Executive Summary report',
    'Analyze operational KPIs & cost variance',
    'Project completion forecast',
  ],
  'ai-maritime': [
    'Display BKI Tank Testing rules table',
    'Hull Welding specification requirements',
    'Marine vessel coating standards',
    'Airbag ship launching procedures',
    'IACS UR Z10 hull survey regulations',
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
      content: '🚢 Hello! I am **ShipyardOS AI Assistant**. I am ready to assist you with shipyard operations, production tracking, QA/QC inspections, and classification rules with full Markdown & GFM Table support.',
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
        content: '⚠️ Connection error contacting Gemini AI. Please try again.',
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
      content: '🚢 Conversation reset. Ready to assist!',
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
                <span className="text-[10px] text-slate-500 ml-1 font-medium">Analyzing...</span>
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
            <Sparkles size={10} className="text-emerald-600" /> Suggested Prompts:
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
            placeholder="Ask a question..."
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
            <button onClick={clearChat} className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-500" title="Clear Chat">
              <Trash2 size={13} />
            </button>
            <button onClick={() => setIsFloating(false)} className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-500" title="Dock">
              <Minimize2 size={13} />
            </button>
            <button onClick={() => setIsFloating(false)} className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-500" title="Close">
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
          <button onClick={clearChat} className="p-1.5 hover:bg-slate-200/60 rounded-lg transition-colors text-slate-500" title="Clear Chat">
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
