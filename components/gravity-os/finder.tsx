'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, ChevronRight, Clock3, Download, FileText, Folder, Gamepad2, HardDrive, Image, LayoutGrid, Music, Search, Star, Trash2 } from 'lucide-react'

type FinderItem = { id: string; name: string; kind: 'folder' | 'app' | 'file'; icon?: string; appId?: string; detail?: string }
type FinderFolder = 'Recents' | 'Applications' | 'Desktop' | 'Downloads' | 'Games'

const folderItems: Record<Exclude<FinderFolder, 'Recents'>, FinderItem[]> = {
  Applications: [
    { id: 'spotify', name: 'Spotify', kind: 'app', appId: 'spotify', icon: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Spotify_App_Logo.svg/3840px-Spotify_App_Logo.svg.png' },
    { id: 'browser', name: 'Browser', kind: 'app', appId: 'browser', icon: 'https://i.ibb.co/1fbhH8jb/safari-1.png' },
    { id: 'settings', name: 'Settings', kind: 'app', appId: 'settings', icon: 'https://upload.wikimedia.org/wikipedia/commons/archive/e/ea/20200720144619%21Settings_%28iOS%29.png' },
    { id: 'notes', name: 'Notes', kind: 'app', appId: 'notes', icon: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_Notes_icon.svg/3840px-Apple_Notes_icon.svg.png' },
    { id: 'gnmath', name: 'gn-math', kind: 'app', appId: 'gnmath', icon: 'https://i.ibb.co/Z1YgPhPX/gnmathlogo.png' },
  ],
  Desktop: [
    { id: 'welcome', name: 'Welcome.txt', kind: 'file', detail: 'A note about GravityOS' },
    { id: 'wallpapers', name: 'Wallpapers', kind: 'folder' },
    { id: 'gravityai', name: 'GravityAI', kind: 'app', appId: 'gravityai' },
  ],
  Downloads: [
    { id: 'readme', name: 'readme.txt', kind: 'file', detail: 'GravityOS notes' },
    { id: 'purple', name: 'purple-aesthetic.jpg', kind: 'file', detail: 'Wallpaper' },
    { id: 'chisa', name: 'chisa-wuthering.jpg', kind: 'file', detail: 'Wallpaper' },
  ],
  Games: [
    { id: 'ps5', name: 'PS5', kind: 'app', appId: 'games', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/PlayStation_App_Icon.jpg' },
    { id: 'minecraft', name: 'Minecraft', kind: 'app', appId: 'minecraft', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Minecraft-creeper-face.jpg' },
  ],
}

const navItems: { id: FinderFolder; icon: typeof Star }[] = [
  { id: 'Recents', icon: Clock3 }, { id: 'Applications', icon: LayoutGrid }, { id: 'Desktop', icon: HardDrive }, { id: 'Downloads', icon: Download }, { id: 'Games', icon: Gamepad2 },
]

function Sidebar({ current, onNavigate }: { current: FinderFolder; onNavigate: (folder: FinderFolder) => void }) {
  return <aside className="w-[190px] shrink-0 border-r border-slate-300/60 bg-white/35 p-3 backdrop-blur-xl"><p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Favorites</p><nav className="space-y-1">{navItems.map(({ id, icon: Icon }) => <button key={id} onClick={() => onNavigate(id)} className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition ${current === id ? 'bg-blue-500/15 font-semibold text-blue-700' : 'text-slate-600 hover:bg-slate-900/5'}`}><Icon size={15} strokeWidth={1.8} />{id}</button>)}</nav></aside>
}

function Toolbar({ current, canBack, canForward, onBack, onForward, query, onQuery }: { current: FinderFolder; canBack: boolean; canForward: boolean; onBack: () => void; onForward: () => void; query: string; onQuery: (value: string) => void }) {
  return <div className="flex h-11 items-center gap-2 border-b border-slate-300/60 bg-white/25 px-3 backdrop-blur-xl"><button aria-label="Back" disabled={!canBack} onClick={onBack} className="rounded-md p-1.5 text-slate-600 transition hover:bg-slate-900/5 disabled:opacity-25"><ArrowLeft size={16}/></button><button aria-label="Forward" disabled={!canForward} onClick={onForward} className="rounded-md p-1.5 text-slate-600 transition hover:bg-slate-900/5 disabled:opacity-25"><ArrowRight size={16}/></button><div className="flex-1 text-center text-xs font-semibold text-slate-700">{current}</div><label className="flex w-40 items-center gap-1.5 rounded-lg border border-slate-300/70 bg-white/45 px-2 py-1.5 text-slate-400 shadow-sm"><Search size={13}/><input aria-label="Search current folder" value={query} onChange={event => onQuery(event.target.value)} placeholder="Search" className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400" /></label></div>
}

function FileItem({ item, selected, onSelect, onOpen }: { item: FinderItem; selected: boolean; onSelect: () => void; onOpen: () => void }) {
  return <button onClick={onSelect} onDoubleClick={onOpen} className={`group flex min-w-0 flex-col items-center gap-1 rounded-xl p-2 text-center transition duration-150 ${selected ? 'bg-blue-500/18 ring-1 ring-blue-400/35' : 'hover:bg-slate-900/5'}`}><span className={`grid size-14 place-items-center overflow-hidden rounded-[13px] shadow-sm ${item.kind === 'folder' ? 'bg-blue-500 text-white' : 'bg-white/70 text-slate-500 ring-1 ring-slate-200/80'}`}>{item.icon ? <img src={item.icon} alt="" className="size-full object-cover" /> : item.kind === 'folder' ? <Folder size={34} fill="currentColor" strokeWidth={1.2}/> : item.name.endsWith('.jpg') ? <Image size={28}/> : <FileText size={28}/>}</span><span className="w-full truncate text-[11px] font-medium text-slate-700">{item.name}</span></button>
}

function StatusBar({ count, selected }: { count: number; selected: number }) { return <div className="flex h-7 items-center justify-center border-t border-slate-300/60 bg-white/25 text-[10px] text-slate-500">{selected ? `${selected} selected` : `${count} items`}</div> }

export default function Finder({ onOpenApp }: { onOpenApp: (id: string) => void }) {
  const [current, setCurrent] = useState<FinderFolder>('Desktop')
  const [history, setHistory] = useState<FinderFolder[]>(['Desktop'])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [recents, setRecents] = useState<FinderItem[]>([])
  useEffect(() => { try { setRecents(JSON.parse(localStorage.getItem('gravityos-finder-recents') || '[]')) } catch { setRecents([]) } }, [])
  const items = useMemo(() => current === 'Recents' ? recents : folderItems[current], [current, recents])
  const filtered = useMemo(() => items.filter(item => item.name.toLowerCase().includes(query.trim().toLowerCase())), [items, query])
  const navigate = (folder: FinderFolder) => { const next = history.slice(0, historyIndex + 1).concat(folder); setHistory(next); setHistoryIndex(next.length - 1); setCurrent(folder); setQuery(''); setSelected(null) }
  const open = (item: FinderItem) => { const nextRecents = [item, ...recents.filter(entry => entry.id !== item.id)].slice(0, 8); setRecents(nextRecents); localStorage.setItem('gravityos-finder-recents', JSON.stringify(nextRecents)); if (item.appId) onOpenApp(item.appId); else if (item.kind === 'folder') navigate(item.name === 'Wallpapers' ? 'Downloads' : 'Desktop') }
  return <div className="flex h-full min-h-0 flex-col bg-slate-100/75 text-slate-700" onClick={() => setSelected(null)}><div className="flex min-h-0 flex-1"><Sidebar current={current} onNavigate={navigate}/><div className="flex min-w-0 flex-1 flex-col"><Toolbar current={current} canBack={historyIndex > 0} canForward={historyIndex < history.length - 1} onBack={() => { const index = historyIndex - 1; setHistoryIndex(index); setCurrent(history[index]); setSelected(null) }} onForward={() => { const index = historyIndex + 1; setHistoryIndex(index); setCurrent(history[index]); setSelected(null) }} query={query} onQuery={setQuery}/><main className="grid min-h-0 flex-1 content-start grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2 overflow-auto p-5" onClick={event => event.stopPropagation()}>{filtered.map(item => <FileItem key={item.id} item={item} selected={selected === item.id} onSelect={() => setSelected(item.id)} onOpen={() => open(item)}/>) }{filtered.length === 0 && <div className="col-span-full flex min-h-48 flex-col items-center justify-center text-center text-slate-400"><Folder size={34} strokeWidth={1.2}/><p className="mt-2 text-xs">{query ? 'No matching items' : 'This folder is empty'}</p></div>}</main></div></div><StatusBar count={filtered.length} selected={selected ? 1 : 0}/></div>
}
export type { FinderItem }
export { folderItems }
