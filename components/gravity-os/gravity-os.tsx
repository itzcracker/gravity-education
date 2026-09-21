'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeft, ChevronRight, Gamepad2, Globe2, Grid2X2, LockKeyhole, Maximize2, Minus, MonitorCog, NotebookPen, Plus, Power, RefreshCw, Search, Settings, SlidersHorizontal, Sparkles, X,
} from 'lucide-react'

type AppId = 'browser' | 'games' | 'settings' | 'notes' | 'photos'
type WindowState = { id: AppId; x: number; y: number; width: number; height: number; minimized?: boolean; fullscreen?: boolean; restore?: { x: number; y: number; width: number; height: number } }

const wallpaper = 'https://plain-weur-prod-public.komododecks.com/202609/20/5P7wYjTD1GJZGxW6Fpoe/image.png'
const apps: { id: AppId; label: string; icon: typeof Globe2; color: string }[] = [
  { id: 'browser', label: 'Browser', icon: Globe2, color: 'from-sky-400 to-blue-600' },
  { id: 'games', label: 'Game Center', icon: Gamepad2, color: 'from-violet-400 to-indigo-600' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'from-slate-300 to-slate-500' },
  { id: 'notes', label: 'Notes', icon: NotebookPen, color: 'from-yellow-300 to-orange-400' },
  { id: 'photos', label: 'Photos', icon: Sparkles, color: 'from-pink-400 to-purple-500' },
]

function AppIcon({ app, onClick, size = 'normal' }: { app: typeof apps[number]; onClick: () => void; size?: 'normal' | 'large' }) {
  const Icon = app.icon
  return <button aria-label={`Open ${app.label}`} onClick={onClick} className={`group flex flex-col items-center gap-1.5 ${size === 'large' ? 'w-24' : 'w-16'}`}>
    <span className={`grid place-items-center rounded-[22%] bg-gradient-to-br ${app.color} text-white shadow-lg ring-1 ring-white/30 transition duration-300 group-hover:-translate-y-1 group-hover:scale-110 ${size === 'large' ? 'size-16' : 'size-12'}`}><Icon className={size === 'large' ? 'size-8' : 'size-6'} strokeWidth={1.7} /></span>
    <span className="max-w-full truncate text-[11px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,.8)]">{app.label}</span>
  </button>
}

function WindowContent({ id, browserUrl, setBrowserUrl }: { id: AppId; browserUrl: string; setBrowserUrl: (v: string) => void }) {
  if (id === 'browser') return <div className="flex h-full flex-col bg-white/95 text-slate-800"><div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100/90 p-2"><button className="rounded p-1 text-slate-500 hover:bg-slate-200"><ChevronLeft size={16}/></button><button className="rounded p-1 text-slate-500 hover:bg-slate-200"><ChevronRight size={16}/></button><button className="rounded p-1 text-slate-500 hover:bg-slate-200" onClick={() => setBrowserUrl(browserUrl)}><RefreshCw size={14}/></button><form className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-inner" onSubmit={(e) => { e.preventDefault(); setBrowserUrl(browserUrl) }}><LockKeyhole size={12} className="text-emerald-500"/><input aria-label="Browser address" value={browserUrl} onChange={(e) => setBrowserUrl(e.target.value)} className="min-w-0 flex-1 bg-transparent text-xs outline-none" /></form><Plus size={16} className="text-slate-500"/></div><iframe title="GravityOS Browser" src={browserUrl.startsWith('http') ? browserUrl : `https://gravityxfrogies.mooo.com/calculus/`} className="min-h-0 flex-1 border-0" /></div>
  if (id === 'games') return <div className="h-full bg-[#11121c] p-3"><div className="relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-indigo-950 via-[#201643] to-slate-950"><iframe title="PS5 Game Center" src="https://cineosweb.github.io/script/Apps/Ps5/index.html" className="size-full border-0" /><div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-4 py-3 text-[10px] font-semibold tracking-[.2em] text-white/70"><span>GRAVITY GAME CENTER</span><span>ONLINE</span></div></div></div>
  if (id === 'settings') return <div className="h-full overflow-auto bg-slate-50 p-6 text-slate-800"><div className="mb-5 flex items-center gap-3"><div className="grid size-12 place-items-center rounded-2xl bg-slate-700 text-white"><Settings size={26}/></div><div><h2 className="font-semibold">System Settings</h2><p className="text-xs text-slate-500">GravityOS 1.0 · This Mac</p></div></div><div className="grid gap-2 sm:grid-cols-2">{['Wi-Fi','Bluetooth','Appearance','Notifications','Desktop & Dock','Privacy & Security'].map((item, i) => <button key={item} className="flex items-center gap-3 rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 hover:bg-slate-100"><span className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-500"><SlidersHorizontal size={15}/></span><span className="text-sm font-medium">{item}</span><ChevronRight size={14} className="ml-auto text-slate-400"/></button>)}</div></div>
  if (id === 'notes') return <div className="flex h-full flex-col bg-[#fffdf1] text-slate-800"><div className="border-b border-amber-200 bg-amber-50 px-5 py-3"><h2 className="font-semibold">Quick Notes</h2><p className="text-xs text-slate-500">Updated just now</p></div><textarea aria-label="Notes" defaultValue={'Welcome to GravityOS.\n\nCapture your ideas here...'} className="min-h-0 flex-1 resize-none bg-transparent p-5 text-sm leading-7 outline-none" /></div>
  return <div className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-fuchsia-100 via-white to-violet-100 text-slate-700"><Sparkles size={48} className="text-fuchsia-500"/><h2 className="text-lg font-semibold">Your memories, in orbit.</h2><p className="text-sm text-slate-500">Photos is ready for your favorite moments.</p><button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white">Import Photos</button></div>
}

export default function GravityOS() {
  const [locked, setLocked] = useState(true)
  const [now, setNow] = useState<Date | null>(null)
  const [launcher, setLauncher] = useState(false)
  const [context, setContext] = useState<{x:number;y:number} | null>(null)
  const [windows, setWindows] = useState<WindowState[]>([])
  const [active, setActive] = useState<AppId | null>(null)
  const [browserUrl, setBrowserUrl] = useState('gravity://')
  const drag = useRef<{ id: AppId; dx: number; dy: number } | null>(null)
  const snowflakes = useMemo(() => Array.from({ length: 42 }, (_, index) => ({ id: index, left: (index * 37) % 100, delay: (index * 0.31) % 7, duration: 7 + (index % 6), size: 2 + (index % 4) })), [])
  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  useEffect(() => { const move = (e: MouseEvent) => { if (!drag.current) return; const d = drag.current; setWindows(ws => ws.map(w => w.id === d.id ? { ...w, x: Math.max(8, e.clientX - d.dx), y: Math.max(32, e.clientY - d.dy) } : w)) }; const up = () => { drag.current = null }; window.addEventListener('mousemove', move); window.addEventListener('mouseup', up); return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) } }, [])
  const time = now?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? '--:--'
  const date = now?.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }) ?? 'Loading date'
  const openApp = (id: AppId) => { setLauncher(false); setContext(null); setWindows(ws => ws.some(w => w.id === id) ? ws.map(w => w.id === id ? { ...w, minimized: false } : w) : [...ws, { id, x: 160 + ws.length * 26, y: 90 + ws.length * 20, width: id === 'games' ? 720 : 650, height: id === 'settings' ? 500 : 440 }]); setActive(id) }
  const closeApp = (id: AppId) => { setWindows(ws => ws.filter(w => w.id !== id)); setActive(a => a === id ? null : a) }
  const toggleWindowFullscreen = (id: AppId) => setWindows(ws => ws.map(w => {
    if (w.id !== id) return w
    if (w.fullscreen && w.restore) return { ...w, ...w.restore, fullscreen: false, restore: undefined }
    return { ...w, fullscreen: true, restore: { x: w.x, y: w.y, width: w.width, height: w.height }, x: 8, y: 38, width: Math.max(320, window.innerWidth - 16), height: Math.max(260, window.innerHeight - 110) }
  }))
  const toggleBrowserFullscreen = async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.()
    else await document.exitFullscreen?.()
  }
  const appInfo = (id: AppId) => apps.find(a => a.id === id)!
  return <main className="gravity-os relative h-dvh w-full overflow-hidden select-none" style={{ backgroundImage: `url(${wallpaper})` }} onContextMenu={(e) => { e.preventDefault(); setContext({x:e.clientX,y:e.clientY}) }} onClick={() => { if (context) setContext(null) }}>
    <div className="absolute inset-0 bg-black/10" />
    <div className="snowfall" aria-hidden="true">{snowflakes.map(flake => <span key={flake.id} style={{ left: `${flake.left}%`, animationDelay: `${flake.delay}s`, animationDuration: `${flake.duration}s`, width: flake.size, height: flake.size }} />)}</div>
    <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2 text-center text-white drop-shadow-lg"><p className="text-[10px] font-semibold uppercase tracking-[.32em] text-white/65"></p><p className="mt-1 text-xl font-medium tracking-tight">{now?.toLocaleDateString([], { weekday: 'long' }) ?? 'Loading day'}</p></div>
    <div className="absolute bottom-28 left-5 z-10 rounded-2xl border border-white/20 bg-black/25 px-4 py-3 text-white shadow-xl backdrop-blur-md"><p className="text-[10px] font-semibold uppercase tracking-[.24em] text-white/60"></p><time className="mt-1 block text-2xl font-medium tracking-tight">{time}</time><p className="text-[11px] text-white/65"></p></div>
    <section className="pointer-events-none absolute inset-0">{windows.map(w => { const app = appInfo(w.id); const Icon = app.icon; return <article key={w.id} onClick={(e) => { e.stopPropagation(); setActive(w.id) }} className={`window pointer-events-auto ${active === w.id ? 'active' : ''} ${w.minimized ? 'minimized' : ''}`} style={{ left: w.x, top: w.y, width: `min(${w.width}px, calc(100vw - 24px))`, height: `min(${w.height}px, calc(100dvh - 110px))`, zIndex: active === w.id ? 20 : 10 }}><div className="titlebar" onMouseDown={(e) => { setActive(w.id); drag.current = { id: w.id, dx: e.clientX - w.x, dy: e.clientY - w.y } }}><div className="traffic"><button aria-label={`Close ${app.label}`} className="traffic-close" onClick={() => closeApp(w.id)}><X size={9}/></button><button aria-label={`Minimize ${app.label}`} className="traffic-min" onClick={() => setWindows(ws => ws.map(x => x.id === w.id ? {...x, minimized: true} : x))}><Minus size={9}/></button><button aria-label={`${w.fullscreen ? 'Restore' : 'Fullscreen'} ${app.label}`} className="traffic-max" onClick={() => toggleWindowFullscreen(w.id)}><Maximize2 size={8}/></button></div><div className="flex items-center gap-1.5 text-xs font-medium text-white/80"><Icon size={13}/>{app.label}</div><div className="w-16" /></div><div className="window-body"><WindowContent id={w.id} browserUrl={browserUrl} setBrowserUrl={setBrowserUrl}/></div><span className="resize-grip" /></article> })}</section>
    {launcher && <div className="launcher" onClick={(e) => e.stopPropagation()}><div className="mb-8 flex items-center justify-between"><div><p className="text-xs font-medium uppercase tracking-[.25em] text-white/60">Application space</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Launchpad</h1></div><div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-white/60"><Search size={14}/> Search apps</div></div><div className="grid grid-cols-3 gap-7 sm:grid-cols-5">{apps.map(app => <AppIcon key={app.id} app={app} size="large" onClick={() => openApp(app.id)} />)}</div></div>}
    {context && <div className="context-menu" style={{left: context.x, top: context.y}} onClick={(e) => e.stopPropagation()}>{[['Change Wallpaper', MonitorCog], ['Refresh', RefreshCw], ['Open Launchpad', Grid2X2], ['System Settings', Settings]].map(([label, Icon]) => <button key={label as string} onClick={() => label === 'Open Launchpad' ? setLauncher(true) : undefined}><Icon size={14}/>{label as string}</button>)}</div>}
    <footer className="dock" onClick={(e) => e.stopPropagation()}><button aria-label="Open Launchpad" onClick={() => setLauncher(v => !v)} className="dock-icon"><Grid2X2 size={25}/></button><span className="dock-divider" />{apps.map(app => <button key={app.id} aria-label={`Open ${app.label} from dock`} onClick={() => openApp(app.id)} className={`dock-icon ${active === app.id ? 'selected' : ''}`}><span className={`grid size-11 place-items-center rounded-[22%] bg-gradient-to-br ${app.color} shadow-md`}><app.icon size={23}/></span></button>)}<span className="dock-divider" /><button aria-label="Toggle fullscreen" onClick={toggleBrowserFullscreen} className="dock-icon"><Maximize2 size={22}/></button><button aria-label="Power" className="dock-icon"><Power size={22}/></button></footer>
    <div className={`lock-screen ${locked ? 'locked' : 'unlocked'}`} style={{ backgroundImage: `url(${wallpaper})` }} onClick={() => setLocked(false)}><div className="absolute inset-0 bg-black/15" /><div className="relative z-10 flex flex-col items-center pt-[16vh] text-white"><div className="mb-3 rounded-full border border-white/25 bg-white/10 p-3 backdrop-blur-md"><LockKeyhole size={20}/></div><time className="text-8xl font-thin tracking-[-.07em] drop-shadow-2xl sm:text-9xl">{time}</time><p className="mt-2 text-lg font-light tracking-wide text-white/90">{date}</p><button className="mt-20 rounded-full border border-white/35 bg-white/15 px-5 py-2 text-sm font-medium backdrop-blur-md transition hover:bg-white/25">Click to unlock</button></div><div className="absolute bottom-8 left-0 right-0 text-center text-xs text-white/60">GravityOS · Made by itzcracker</div></div>
  </main>
}

