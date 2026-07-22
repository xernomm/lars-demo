import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-3 rounded-lg border border-slate-200 shadow-xs">
              <table className="w-full text-xs text-left border-collapse bg-white" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-slate-100" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-blue-50/40 transition-colors" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-3 py-2 font-bold text-slate-900 border border-slate-200 bg-slate-100/70" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3 py-2 text-slate-700 border border-slate-200 font-medium" {...props} />
          ),
          h1: ({ node, ...props }) => (
            <h1 className="text-base font-bold text-slate-900 mt-3 mb-2 pb-1 border-b border-slate-200" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-sm font-bold text-slate-900 mt-3 mb-1.5" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xs font-bold text-blue-700 mt-2 mb-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-xs text-slate-800 leading-relaxed mb-2 last:mb-0" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside text-xs text-slate-700 my-2 space-y-1 pl-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside text-xs text-slate-700 my-2 space-y-1 pl-1" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-xs text-slate-700 font-medium" {...props} />
          ),
          code: ({ node, inline, ...props }: any) => (
            inline ? (
              <code className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded text-[11px] font-mono border border-slate-200 font-semibold" {...props} />
            ) : (
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono overflow-x-auto my-2 border border-slate-800 shadow-xs" {...props} />
            )
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-blue-500 bg-blue-50/50 pl-3 py-1.5 pr-2 my-2 text-xs text-slate-700 font-medium italic rounded-r" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-slate-900" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-blue-600 hover:text-blue-800 underline font-semibold" target="_blank" rel="noreferrer" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
