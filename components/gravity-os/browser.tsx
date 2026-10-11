'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Globe2, Home, LockKeyhole, Plus, RefreshCw, Search, X } from 'lucide-react'

type Tab = { id: number; title: string; url: string; history: string[]; historyIndex: number; loading: boolean }
const START_URL = 'gravity://'
const PROXY_ORIGIN = 'https://gravity-nmq7.onrender.com/?goto='

// Keep the real destination in tab state and address chrome. Only the iframe
// source is rewritten through the proxy so in-page navigation stays proxied.
function proxyUrl(url: string) {
  return `${PROXY_ORIGIN}${encodeURIComponent(url)}`
}

function resolveInput(value: string) {
  const input = value.trim()
  if (!input) return START_URL
  if (/^(https?:\/\/|gravity:\/\/)/i.test(input)) return input
  if (/^[^\s]+\.[^\s]+$/.test(input)) return `https://${input}`
  return `${encodeURIComponent(input)}`
}

export default function Browser() {
  const nextId = useRef(2)
  const addressRef = useRef<HTMLInputElement>(null)
  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, title: 'Gravity Start', url: START_URL, history: [START_URL], historyIndex: 0, loading: false }])
  const [activeId, setActiveId] = useState(1)
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const active = tabs.find(tab => tab.id === activeId) ?? tabs[0]

  const navigate = (value: string, tabId = active.id) => {
    const url = resolveInput(value)
    setTabs(current => current.map(tab => tab.id !== tabId ? tab : { ...tab, url, title: url === START_URL ? 'Gravity' : url.replace(/^https?:\/\//, '').split('/')[0], history: [...tab.history.slice(0, tab.historyIndex + 1), url], historyIndex: tab.historyIndex + 1, loading: true }))
    window.setTimeout(() => setTabs(current => current.map(tab => tab.id === tabId ? { ...tab, loading: false } : tab)), 500)
  }

  const addTab = () => { const id = nextId.current++; setTabs(current => [...current, { id, title: 'New Tab', url: START_URL, history: [START_URL], historyIndex: 0, loading: false }]); setActiveId(id) }
  const closeTab = (id: number) => { if (tabs.length === 1) return; const index = tabs.findIndex(tab => tab.id === id); setTabs(current => current.filter(tab => tab.id !== id)); if (activeId === id) setActiveId(tabs[Math.max(0, index - 1)].id) }
  const moveHistory = (direction: -1 | 1) => { const index = active.historyIndex + direction; if (index < 0 || index >= active.history.length) return; setTabs(current => current.map(tab => tab.id === active.id ? { ...tab, url: tab.history[index], historyIndex: index, loading: true } : tab)); window.setTimeout(() => setTabs(current => current.map(tab => tab.id === active.id ? { ...tab, loading: false } : tab)), 350) }
  const reload = () => { setTabs(current => current.map(tab => tab.id === active.id ? { ...tab, loading: true } : tab)); window.setTimeout(() => setTabs(current => current.map(tab => tab.id === active.id ? { ...tab, loading: false } : tab)), 450) }
  const canBack = active.historyIndex > 0
  const canForward = active.historyIndex < active.history.length - 1
  const isSecure = /^https:\/\//i.test(active.url)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const modifier = event.metaKey || event.ctrlKey
      if (!modifier) return
      if (event.key.toLowerCase() === 't') { event.preventDefault(); addTab() }
      if (event.key.toLowerCase() === 'w') { event.preventDefault(); closeTab(active.id) }
      if (event.key.toLowerCase() === 'l') { event.preventDefault(); addressRef.current?.focus(); addressRef.current?.select() }
      if (event.key.toLowerCase() === 'r') { event.preventDefault(); reload() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const startCards = useMemo(() => [], [])
  return <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#101216] text-white">
    <div className="border-b border-white/10 bg-[#17191f]/90 px-2 pt-2 backdrop-blur-xl">
      <div className="flex min-w-0 items-end gap-1">
        {tabs.map(tab => <button key={tab.id} type="button" draggable onDragStart={() => setDraggedId(tab.id)} onDragOver={event => event.preventDefault()} onDrop={() => { if (draggedId === null || draggedId === tab.id) return; setTabs(current => { const from = current.findIndex(item => item.id === draggedId); const to = current.findIndex(item => item.id === tab.id); const next = [...current]; const [item] = next.splice(from, 1); next.splice(to, 0, item); return next }); setDraggedId(null) }} onClick={() => setActiveId(tab.id)} className={`group flex min-w-0 max-w-48 flex-1 items-center gap-2 rounded-t-xl border px-3 py-2 text-left text-xs transition-all duration-200 ${active.id === tab.id ? 'border-white/10 bg-[#292d35] text-white shadow-[0_-2px_14px_rgba(0,0,0,.2)]' : 'border-transparent text-white/50 hover:bg-white/5'}`}><span className="grid size-4 shrink-0 place-items-center rounded bg-white/10"><Globe2 size={10} /></span><span className="min-w-0 flex-1 truncate">{tab.loading ? 'Loading…' : tab.title}</span><span onClick={event => { event.stopPropagation(); closeTab(tab.id) }} aria-label={`Close ${tab.title}`} className="grid size-5 shrink-0 place-items-center rounded-md opacity-50 hover:bg-white/10 hover:opacity-100"><X size={13} /></span></button>)}
        <button type="button" onClick={addTab} aria-label="New tab" className="mb-1 grid size-7 shrink-0 place-items-center rounded-lg text-white/55 transition hover:bg-white/10 hover:text-white"><Plus size={15} /></button>
      </div>
    </div>
    <div className="relative flex items-center gap-1.5 border-b border-white/10 bg-[#20232a]/90 px-3 py-2 backdrop-blur-xl">
      {active.loading && <span className="absolute inset-x-0 bottom-0 h-0.5 animate-pulse bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400" />}
      <button type="button" onClick={() => moveHistory(-1)} disabled={!canBack} aria-label="Back" className="grid size-8 place-items-center rounded-lg text-white/55 transition hover:bg-white/10 hover:text-white disabled:opacity-25"><ArrowLeft size={16} /></button><button type="button" onClick={() => moveHistory(1)} disabled={!canForward} aria-label="Forward" className="grid size-8 place-items-center rounded-lg text-white/55 transition hover:bg-white/10 hover:text-white disabled:opacity-25"><ArrowRight size={16} /></button><button type="button" onClick={reload} aria-label="Reload" className="grid size-8 place-items-center rounded-lg text-white/55 transition hover:bg-white/10 hover:text-white"><RefreshCw size={15} className={active.loading ? 'animate-spin' : ''} /></button><button type="button" onClick={() => navigate(START_URL)} aria-label="Home" className="grid size-8 place-items-center rounded-lg text-white/55 transition hover:bg-white/10 hover:text-white"><Home size={15} /></button>
      <form onSubmit={event => { event.preventDefault(); navigate(addressRef.current?.value ?? '') }} className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-[#101216]/70 px-3 py-2 shadow-inner focus-within:border-violet-400/50 focus-within:ring-2 focus-within:ring-violet-400/10"><span className="text-white/45">{isSecure ? <LockKeyhole size={13} className="text-emerald-400" /> : <Search size={13} />}</span><input ref={addressRef} key={active.id} defaultValue={active.url} aria-label="Address" onFocus={event => event.currentTarget.select()} className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/30" /></form>
    </div>
    <div className="min-h-0 flex-1 overflow-hidden bg-[#111318]">{active.url === START_URL ? <div className="flex h-full flex-col items-center justify-center px-6 text-center"><img src="https://i.ibb.co/W4vRmZVn/Spongebob-Dancing.gif" alt="" className="mb-5 size-28 rounded-2xl bg-white object-contain" /><h2 className="text-2xl font-semibold tracking-tight">Welcome to Gravity Browser</h2><p className="mt-2 max-w-md text-sm text-white/45">A focused, fast place for your next idea.</p><div className="mt-8 grid w-full max-w-lg gap-2 sm:grid-cols-3">{startCards.map(card => <button key={card} type="button" onClick={() => navigate(card === 'Search the web' ? 'gravity://' : card === 'Open a new tab' ? START_URL : START_URL)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-white/65 transition hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-white/10">{card}</button>)}</div></div> : <iframe key={`${active.id}-${active.url}`} title={active.title} src={proxyUrl(active.url)} className="size-full border-0 bg-white" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" />}</div>
  </div>
}
