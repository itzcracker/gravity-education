'use client'

import { useMemo, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Bot, ChevronDown, Send, Sparkles, User } from 'lucide-react'

const models = [
  { label: 'Gravity Atlas', id: 'inclusionai/ling-3.0-flash-fin:free', note: 'Fast and thoughtful' },
  { label: 'Gravity Zeno', id: 'stealth/space-bunny-alpha', note: 'Creative and exploratory' },
]

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
    <header className="flex items-center justify-between border-b border-[#e7e2da] bg-[#fbfaf8] px-5 py-3">
      <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-[#d97757] text-white shadow-sm"><Sparkles size={18} /></div><div><h2 className="text-sm font-semibold">GravityAI</h2><p className="text-[11px] text-[#8c837a]">A calm space to think together</p></div></div>
      <label className="relative flex items-center gap-2 rounded-lg border border-[#ded7ce] bg-white px-2.5 py-1.5 text-[11px] font-medium"><span className="text-[#8c837a]">Model</span><select value={model} onChange={(event) => setModel(event.target.value)} className="appearance-none bg-transparent pr-4 outline-none"><option value={models[0].id}>Gravity Atlas</option><option value={models[1].id}>Gravity Zeno</option></select><ChevronDown size={12} className="pointer-events-none absolute right-2" /></label>
    </header>
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
      {messages.length === 0 ? <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center text-center"><div className="mb-4 grid size-14 place-items-center rounded-2xl bg-[#f2dfd6] text-[#bd6043]"><Bot size={28} /></div><h3 className="text-xl font-semibold tracking-tight">What&apos;s on your mind?</h3><p className="mt-2 text-sm leading-6 text-[#8c837a]">Ask GravityAI to brainstorm, explain, write, or simply help you explore an idea.</p><div className="mt-5 flex flex-wrap justify-center gap-2">{['Help me brainstorm', 'Explain something simply', 'Write a short plan'].map(prompt => <button key={prompt} onClick={() => setInput(prompt)} className="rounded-full border border-[#e3dcd3] bg-white px-3 py-1.5 text-xs text-[#6f665d] transition hover:border-[#c9785b] hover:text-[#bd6043]">{prompt}</button>)}</div></div> : <div className="mx-auto flex max-w-2xl flex-col gap-5">{messages.map(message => <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}><div className={`grid size-7 shrink-0 place-items-center rounded-lg ${message.role === 'user' ? 'order-2 bg-[#3e3934] text-white' : 'bg-[#f2dfd6] text-[#bd6043]'}`}>{message.role === 'user' ? <User size={14} /> : <Bot size={15} />}</div><div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-[#3e3934] text-white' : 'bg-white text-[#49423b] shadow-sm ring-1 ring-[#eee8e1]'}`}>{message.parts?.map((part, index) => part.type === 'text' ? <span key={index}>{part.text}</span> : null)}</div></div>)}</div>}
    </div>
    <form onSubmit={submit} className="border-t border-[#e7e2da] bg-[#fbfaf8] p-4"><div className="mx-auto flex max-w-2xl items-end gap-2 rounded-2xl border border-[#dcd4ca] bg-white p-2 shadow-sm focus-within:border-[#c9785b] focus-within:ring-2 focus-within:ring-[#f2dfd6]"><textarea value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} placeholder="Message GravityAI..." rows={1} className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-[#a59c92]" /><button type="submit" disabled={!input.trim() || busy} aria-label="Send message" className="grid size-9 place-items-center rounded-xl bg-[#3e3934] text-white transition hover:bg-[#bd6043] disabled:cursor-not-allowed disabled:opacity-40"><Send size={15} /></button></div><p className="mt-2 text-center text-[10px] text-[#aaa198]">GravityAI can make mistakes. Check important information.</p></form>
  </div>
}
