'use client'

import { useMemo, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Check, ChevronDown, Copy, Send, User } from 'lucide-react'

const CLAUDE_LOGO = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Claude_AI_symbol.svg/1280px-Claude_AI_symbol.svg.png'

const models = [
  { label: 'Gravity Atlas', id: 'inclusionai/ling-3.0-flash-fin:free', note: 'Fast and thoughtful' },
  { label: 'Gravity Zeno', id: 'stealth/space-bunny-alpha', note: 'Creative and exploratory' },
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
  return <button type="button" onClick={copyMessage} aria-label="Copy message" className="ml-auto flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-[#9a9087] opacity-0 transition group-hover:opacity-100 hover:bg-[#f1ece6] hover:text-[#4e4740]">{copied ? <Check size={12} /> : <Copy size={12} />}{copied ? 'Copied' : 'Copy'}</button>
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  async function copyCode() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }
  return <div className="overflow-hidden rounded-xl bg-[#211f1d] text-[#f7f1ea] shadow-sm"><div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-[10px] text-white/55"><span>Code</span><button type="button" onClick={copyCode} className="flex items-center gap-1.5 rounded-md px-2 py-1 transition hover:bg-white/10 hover:text-white">{copied ? <Check size={12} /> : <Copy size={12} />}{copied ? 'Copied' : 'Copy'}</button></div><pre className="overflow-x-auto p-4 font-mono text-xs leading-5"><code>{code}</code></pre></div>
}

export default function GravityAI() {
  const [model, setModel] = useState(models[0].id)
  const [input, setInput] = useState('')
  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/gravity-ai', body: { model } }), [model])
  const { messages, sendMessage, status } = useChat({ transport })
  const busy = status === 'submitted' || status === 'streaming'

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!input.trim() || busy) return
    const text = input.trim()
    setInput('')
    await sendMessage({ text })
  }

  return <div className="flex h-full min-h-0 flex-col bg-[#fbfaf8] text-[#2c2926]">
    <header className="flex items-center gap-3 border-b border-[#e7e2da] bg-[#fbfaf8] px-5 py-3"><img src={CLAUDE_LOGO} alt="GravityAI" className="size-9 object-contain" /><div><h2 className="text-sm font-semibold">GravityAI</h2><p className="text-[11px] text-[#8c837a]">A calm space to think together</p></div></header>
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
      {messages.length === 0 ? <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center text-center"><img src={CLAUDE_LOGO} alt="GravityAI mark" className="mb-4 size-16 object-contain" /><h3 className="text-xl font-semibold tracking-tight">What&apos;s on your mind?</h3><p className="mt-2 text-sm leading-6 text-[#8c837a]">Ask GravityAI to brainstorm, explain, write, or simply help you explore an idea.</p><div className="mt-5 flex flex-wrap justify-center gap-2">{['Help me brainstorm', 'Explain something simply', 'Write a short plan'].map(prompt => <button key={prompt} onClick={() => setInput(prompt)} className="rounded-full border border-[#e3dcd3] bg-white px-3 py-1.5 text-xs text-[#6f665d] transition hover:border-[#c9785b] hover:text-[#bd6043]">{prompt}</button>)}</div></div> : <div className="mx-auto flex max-w-2xl flex-col gap-5">{messages.map(message => <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}><div className={`grid size-7 shrink-0 place-items-center rounded-lg ${message.role === 'user' ? 'order-2 bg-[#3e3934] text-white' : 'bg-[#f2dfd6] p-1 text-[#bd6043]'}`}>{message.role === 'user' ? <User size={14} /> : <img src={CLAUDE_LOGO} alt="GravityAI" className="size-full object-contain" />}</div><div className={`group max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-[#3e3934] text-white' : 'bg-white text-[#49423b] shadow-sm ring-1 ring-[#eee8e1]'}`}><div className="flex items-start gap-2"><div className="min-w-0 flex-1">{message.parts?.map((part, index) => part.type === 'text' ? <MarkdownMessage key={index} text={part.text} /> : null)}</div><MessageCopyButton text={message.parts?.filter(part => part.type === 'text').map(part => part.text).join('\n') ?? ''} /></div></div></div>)}</div>}
    </div>
    <form onSubmit={submit} className="border-t border-[#e7e2da] bg-[#fbfaf8] px-4 pb-3 pt-4"><div className="mx-auto flex max-w-2xl items-end gap-2 rounded-2xl border border-[#dcd4ca] bg-white p-2 shadow-sm focus-within:border-[#c9785b] focus-within:ring-2 focus-within:ring-[#f2dfd6]"><span className="grid size-8 shrink-0 place-items-center rounded-lg text-xl text-[#4d4741]">+</span><textarea value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} placeholder="write" rows={1} className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-[#4f4943]" /><button type="submit" disabled={!input.trim() || busy} aria-label="Send message" className="grid size-9 place-items-center rounded-xl text-[#4a443e] transition hover:bg-[#f1ece6] disabled:cursor-not-allowed disabled:opacity-40"><Send size={16} /></button></div><div className="mx-auto mt-2 flex max-w-2xl items-center justify-between gap-4 px-4 text-[11px] text-[#8c837a]"><p>GravityAI can make mistakes. Please double-check responses.</p><label className="flex shrink-0 items-center gap-1.5 font-medium text-[#49423b]"><select aria-label="Select model" value={model} onChange={event => setModel(event.target.value)} className="max-w-28 appearance-none bg-transparent pr-1 outline-none"><option value={models[0].id}>Gravity Atlas</option><option value={models[1].id}>Gravity Zeno</option></select><ChevronDown size={12} /></label></div></form>
  </div>
}
