import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Sparkles, Anchor, BookOpen, ShieldCheck, Cpu, ArrowRight } from 'lucide-react'
import { generateContent, GeminiMessage } from '../../services/geminiService'
import MarkdownRenderer from '../MarkdownRenderer'

const promptChips = [
  'BKI Tank Hydrostatic Testing Pressure Rules & Standards',
  'Hull Butt Welding Joint Defect Acceptance Criteria (BKI/IACS)',
  'Marine Coating DFT & Surface Preparation Specifications (Sa 2.5)',
  'Airbag Launching Safety Calculation & Inclination Slope Formula',
  'Inclining Experiment GM Stability Calculation Requirements',
  'IACS UR Z10 Hull Survey Regulations for Cargo Barges',
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
      content: `### ⚓ Welcome to AI Maritime Expert Engine

I am your specialized AI Assistant with extensive domain knowledge in:
- **BKI (Biro Klasifikasi Indonesia)** rules and class requirements
- **IACS (International Association of Classification Societies)** Unified Requirements
- **ABS (American Bureau of Shipping)** standards and guidelines
- **Shipbuilding & Shipyard SOPs** from design engineering to vessel delivery
- **Marine Welding, NDT, Coating & Outfitting** quality standards
- **Tank Testing, Launching & Sea Trial** verification protocols

Select a topic prompt below or type your custom query to receive detailed technical advice:`,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<GeminiMessage[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input
    if (!text.trim() || isLoading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    const updatedHistory: GeminiMessage[] = [
      ...history,
      { role: 'user', parts: [{ text }] },
    ]

    try {
      const response = await generateContent(text, 'ai-maritime', history)
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      }
      setMessages((prev) => [...prev, assistantMsg])
      setHistory([
        ...updatedHistory,
        { role: 'model', parts: [{ text: response }] },
      ])
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Connection error reaching Gemini AI. Please try again.',
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col space-y-4 fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bot size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">AI Maritime Expert</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">BKI / IACS Classification Rules & Shipyard Operations Knowledge Engine</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="badge badge-info text-xs font-bold"><ShieldCheck size={12} className="mr-1" /> BKI Certified KB</span>
          <span className="badge badge-success text-xs font-bold"><Cpu size={12} className="mr-1" /> Gemini 3.5 Flash</span>
        </div>
      </div>

      {/* Suggested Topic Prompt Chips */}
      <div className="glass-card rounded-xl p-3.5 space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles size={13} className="text-blue-600" /> Maritime Technical Inquiry Prompts:
        </p>
        <div className="flex flex-wrap gap-2">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1"
            >
              {chip} <ArrowRight size={11} className="opacity-60" />
            </button>
          ))}
        </div>
      </div>

      {/* Full-width Chat Box */}
      <div className="flex-1 glass-card rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-xs min-h-[480px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} fade-in`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-white shadow-xs">
                  <Bot size={18} />
                </div>
              )}
              <div
                className={`max-w-[88%] p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
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
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-white shadow-xs">
                <Bot size={18} className="animate-pulse" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs p-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs text-slate-500 font-semibold ml-2">Consulting Maritime Knowledge Base...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ask any question regarding BKI, IACS rules, welding specs, or shipyard SOPs..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 disabled:opacity-50 font-medium"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors disabled:opacity-40 flex items-center gap-2 shadow-xs"
            >
              <Send size={15} /> Send Question
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
