'use client'

import { useMemo, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Check, ChevronDown, Copy, Lightbulb, ListChecks, Menu, PanelLeftClose, PenLine, Plus, Send, User } from 'lucide-react'

const GRAVITY_LOGO = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%20%281%29-Photoroom-s6WyDcuVhEKPFqngW4lEDUZQTeNbuD.png'

const models = [
  { label: 'Gravity Light', id: 'apodex/apodex-1.1-mini:free', note: 'Fast and thoughtful' },
  { label: 'Gravity Zenon', id: 'inclusionai/ling-3.1-flash', note: 'Creative and exploratory' },
]

function renderInline(text: string) {
  const pieces = text.split(/(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__)/g)
  return pieces.map((piece, index) => {
    if (piece.startsWith('**') || piece.startsWith('__')) return <strong key={index}>{piece.slice(2, -2)}</strong>
    if (piece.startsWith('`')) return <code key={index} className="rounded bg-[#f1ece6] px-1.5 py-0.5 font-mono text-[0.9em] text-[#a34f35]">{piece.slice(1, -1)}</code>
    return <span key={index}>{piece}</span>
  })
}

function MarkdownMessage({ text }: { text: string }) {
  const blocks = text.split(/```(?:[\w+-]+)?\n?([\s\S]*?)```/g)
  return <div className="flex flex-col gap-3">
    {blocks.map((block, index) => index % 2 === 1 ? <CodeBlock key={index} code={block.trim()} /> : <div key={index} className="flex flex-col gap-2">{block.split('\n').map((line, lineIndex) => {
      if (!line.trim()) return null
      if (line.startsWith('|')) {
        const cells = line.split('|').slice(1, -1).map(cell => cell.trim())
        if (cells.every(cell => /^:?-{3,}:?$/.test(cell))) return null
        return <div key={lineIndex} className="grid grid-cols-2 gap-2 border-b border-[#eee8e1] py-1.5 text-xs">{cells.map((cell, cellIndex) => <span key={cellIndex} className={cellIndex === 0 ? 'font-medium text-[#3e3934]' : 'text-[#6f665d]'}>{renderInline(cell)}</span>)}</div>
      }
      return <p key={lineIndex}>{renderInline(line.replace(/^[-*] /, '• '))}</p>
    })}</div>)}
  </div>
}

function MessageCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function copyMessage() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }
  return <button type="button" onClick={copyMessage} aria-label="Copy message" className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-[#9a9087] transition hover:bg-[#f1ece6] hover:text-[#4e4740]">{copied ? <Check size={12} /> : <Copy size={12} />}{copied ? 'Copied' : 'Copy'}</button>
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  async function copyCode() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }
  return <div className="min-w-0 max-w-full overflow-hidden rounded-xl bg-[#211f1d] text-[#f7f1ea] shadow-sm"><div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-[10px] text-white/55"><span>Code</span><button type="button" onClick={copyCode} className="flex items-center gap-1.5 rounded-md px-2 py-1 transition hover:bg-white/10 hover:text-white">{copied ? <Check size={12} /> : <Copy size={12} />}{copied ? 'Copied' : 'Copy'}</button></div><pre className="max-w-full overflow-x-auto whitespace-pre p-4 font-mono text-xs leading-5"><code>{code}</code></pre></div>
}

export default function GravityAI() {
  const [model, setModel] = useState(models[0].id)
  const [input, setInput] = useState('')
  const [modelMenuOpen, setModelMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/gravity-ai', body: { model } }), [model])
  const { messages, setMessages, sendMessage, status } = useChat({ transport })
  const busy = status === 'submitted' || status === 'streaming'

  function handleNewChat() {
    setMessages([])
    setInput('')
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!input.trim() || busy) return
    const text = input.trim()
    setInput('')
    await sendMessage({ text })
  }

  const hasMessages = messages.length > 0

  return <div className="flex h-full min-h-0 bg-[#fbfaf8] text-[#2c2926]">
    <aside className={`${sidebarOpen ? 'w-60 border-r' : 'w-0'} shrink-0 overflow-hidden border-[#e8e0d7] bg-[#f3f0ec] transition-[width] duration-300`} aria-label="Chat history"><div className="flex h-full w-60 flex-col p-4"><button type="button" onClick={handleNewChat} className="flex items-center gap-2 rounded-xl border border-[#e1d8cf] bg-[#fbf9f6] px-3 py-2.5 text-left text-sm font-medium text-[#4d443d] transition hover:border-[#c99178] hover:bg-white"><Plus size={16} />New Chat</button><div className="mt-7"><p className="px-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[#9a8d83]">Recent chats</p><p className="px-2 py-4 text-xs text-[#a69a90]">Your recent conversations will appear here.</p></div></div></aside>
    <div className="relative flex min-w-0 min-h-0 flex-1 flex-col">
    <header className="flex items-center gap-3 border-b border-[#e8e0d7] bg-[#fbf9f6] px-5 py-4"><button type="button" onClick={() => setSidebarOpen(open => !open)} aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'} className="grid size-8 place-items-center rounded-lg text-[#8f8278] transition hover:bg-[#f1e7df] hover:text-[#a9674e]">{sidebarOpen ? <PanelLeftClose size={17} /> : <Menu size={18} />}</button><img src={GRAVITY_LOGO} alt="GravityAI" className="size-10 object-contain" /><div><h2 className="text-[15px] font-semibold tracking-[-.01em] text-[#352f2a]">GravityAI</h2><p className="mt-0.5 text-[11px] text-[#91877d]">A calm space to think together</p></div></header>
    <div className={`min-h-0 flex-1 overflow-y-auto px-5 py-6 transition-all duration-500 ${hasMessages ? 'pb-8' : 'pb-6'}`}>
      {messages.length === 0 ? <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-4 pb-8 text-center"><div className="mb-6 grid size-14 place-items-center rounded-2xl border border-[#eaded4] bg-[#f4e7df] shadow-[0_8px_24px_rgba(139,91,67,.08)]"><img src={GRAVITY_LOGO} alt="GravityAI mark" className="size-9 object-contain" /></div><h3 className="font-serif text-4xl font-semibold tracking-[-.035em] text-[#352f2a] sm:text-5xl">What&apos;s on your mind?</h3><div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">{[[Lightbulb, 'Help me brainstorm'], [PenLine, 'Explain something simply'], [ListChecks, 'Write a short plan']].map(([Icon, prompt]) => <button key={prompt as string} onClick={() => setInput(prompt as string)} className="group flex items-center gap-3 rounded-xl border border-[#e6ddd4] bg-[#fdfbf9] p-4 text-left text-[13px] font-medium text-[#5f554d] shadow-[0_2px_8px_rgba(71,53,42,.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c99178] hover:bg-[#fffdfa] hover:shadow-[0_10px_24px_rgba(71,53,42,.08)]"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#f4e7df] text-[#a9674e] transition-colors group-hover:bg-[#ead4c8]"><Icon size={15} strokeWidth={1.8} /></span><span>{prompt}</span></button>)}</div></div> : <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">{messages.map(message => <div key={message.id} className={`group flex w-full gap-3 ${message.role === 'user' ? 'justify-end' : 'items-start'}`}><div className={`min-w-0 max-w-[min(78%,42rem)] text-sm leading-6 ${message.role === 'user' ? 'order-1 rounded-[1.25rem] rounded-br-md bg-[#3e3934] px-4 py-3 text-white shadow-sm' : 'order-2 flex-1 pt-1 text-[#49423b]'}`}><div>{message.parts?.map((part, index) => part.type === 'text' ? <MarkdownMessage key={index} text={part.text} /> : null)}</div><div className={`mt-2 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><MessageCopyButton text={message.parts?.filter(part => part.type === 'text').map(part => part.text).join('\n') ?? ''} /></div></div><div className={`grid size-8 shrink-0 place-items-center rounded-full ${message.role === 'user' ? 'order-2 bg-[#e9e3dc] text-[#5c554e]' : 'order-1 bg-[#f2dfd6] p-1.5 text-[#bd6043]'}`}>{message.role === 'user' ? <User size={15} strokeWidth={1.8} /> : <img src={GRAVITY_LOGO} alt="GravityAI" className="size-full object-contain" />}</div></div>)}</div>}
    </div>
    <form onSubmit={submit} className={`shrink-0 px-4 pb-4 pt-5 transition-[background-color,border-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${hasMessages ? 'border-t border-[#e8e0d7] bg-[#fbf9f6]' : 'border-t border-transparent bg-transparent'}`}><div className="mx-auto flex max-w-3xl items-end gap-2 rounded-[1.35rem] border border-[#dcd4ca] bg-[#fffdfa] p-2 shadow-[0_8px_28px_rgba(71,53,42,.06)] transition-all duration-300 focus-within:border-[#bd856c] focus-within:ring-4 focus-within:ring-[#f1e3db]"><button type="button" aria-label="Add attachment" className="mb-1 grid size-9 shrink-0 place-items-center rounded-xl text-[#9a8d83] transition-all duration-300 hover:bg-[#f3e8e1] hover:text-[#a9674e]"><Plus size={18} strokeWidth={1.8} /></button><textarea ref={inputRef} value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} placeholder="Write a message..." rows={2} className="max-h-32 min-h-16 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-[#3e3731] outline-none placeholder:text-[#9a8e84]" /><button type="submit" disabled={!input.trim() || busy} aria-label="Send message" className="mb-1 grid size-10 place-items-center rounded-full bg-[#eee6df] text-[#9b8a7d] transition-all duration-300 hover:bg-[#b66f55] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"><Send size={16} /></button></div><div className="mx-auto mt-2 flex max-w-3xl items-center justify-between gap-4 px-4 text-[11px] text-[#978b81]"><p>GravityAI can make mistakes. Please double-check responses.</p><div className="relative shrink-0"><button type="button" aria-haspopup="listbox" aria-expanded={modelMenuOpen} onClick={() => setModelMenuOpen(open => !open)} className="flex items-center gap-2 rounded-full border border-[#ded5ca] bg-white px-3 py-1.5 text-xs font-medium text-[#49423b] shadow-sm transition hover:border-[#c9785b] focus:outline-none focus:ring-2 focus:ring-[#f2dfd6]"><span>{models.find(option => option.id === model)?.label}</span><ChevronDown size={12} aria-hidden="true" /></button>{modelMenuOpen && <div role="listbox" aria-label="Select model" className="absolute bottom-full right-0 z-20 mb-2 min-w-36 rounded-2xl border border-[#e2d9cf] bg-white p-1.5 shadow-lg"><button type="button" role="option" aria-selected={model === models[0].id} onClick={() => { setModel(models[0].id); setModelMenuOpen(false) }} className={`w-full rounded-xl px-3 py-2 text-left text-xs transition ${model === models[0].id ? 'bg-[#f4e5de] text-[#a34f35]' : 'text-[#5b544d] hover:bg-[#f7f3ef]'}`}>Gravity Light</button><button type="button" role="option" aria-selected={model === models[1].id} onClick={() => { setModel(models[1].id); setModelMenuOpen(false) }} className={`w-full rounded-xl px-3 py-2 text-left text-xs transition ${model === models[1].id ? 'bg-[#f4e5de] text-[#a34f35]' : 'text-[#5b544d] hover:bg-[#f7f3ef]'}`}>Gravity Zenon</button></div>}</div></div></form>
    </div>
  </div>
}
