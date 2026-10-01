'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeft, ChevronRight, Gamepad2, Globe2, Grid2X2, LockKeyhole, Maximize2, Minus, MonitorCog, NotebookPen, Plus, Power, RefreshCw, Search, Settings, SlidersHorizontal, Sparkles, X, HatGlasses, Gem, Music, Bot,
} from 'lucide-react'
import GravityAI from './gravity-ai'

type AppId = 'browser' | 'games' | 'settings' | 'spotify' | 'minecraft' | 'notes' | 'gravityai' | 'gnmath'
type WindowState = { id: AppId; x: number; y: number; width: number; height: number; minimized?: boolean; fullscreen?: boolean; restore?: { x: number; y: number; width: number; height: number } }

type AppDefinition = { id: AppId; label: string; icon: typeof Globe2; color: string; image?: string }

const originalWallpaper = 'https://plain-weur-prod-public.komododecks.com/202609/20/5P7wYjTD1GJZGxW6Fpoe/image.png'
const wallpaperOptions = [
  { name: 'Original', url: originalWallpaper },
  { name: 'Stellefly', url: 'https://i.ibb.co/sJwY93m1/stellefly-honkai-3840x2160-26880.jpg' },
  { name: 'The Shorekeeper', url: 'https://i.ibb.co/LDrPxHWr/the-shorekeeper-3840x2160-25523.jpg' },
  { name: 'Windows Dark', url: 'https://i.ibb.co/6RrVdsk4/windows-11-dark-mode-abstract-background-black-background-3840x2160-8710.png' },
  { name: 'Surreal Cherry', url: 'https://i.ibb.co/RpqNkhF6/surreal-cherry-3840x2160-26233-1.jpg' },
  { name: 'Purple Aesthetic', url: 'https://i.ibb.co/cSV9CQBF/purple-aesthetic-3840x2160-18775.jpg' },
  { name: 'Chisa Wuthering', url: 'https://i.ibb.co/jkyrCk0z/chisa-wuthering-3840x2160-24840.jpg' },
  { name: 'Takanashi Hoshino', url: 'https://i.ibb.co/bj01ByZy/takanashi-hoshino-3840x2160-25273.jpg' },
]
const apps: AppDefinition[] = [
  { id: 'spotify', label: 'Spotify', icon: Music, color: 'from-yellow-300 to-orange-400', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Spotify_App_Logo.svg/3840px-Spotify_App_Logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail' },
  { id: 'browser', label: 'Browser', icon: HatGlasses, color: 'from-sky-400 to-blue-600', image: 'https://i.ibb.co/qFkfMKBP/image-1.png' },
  { id: 'games', label: 'PS5', icon: Gamepad2, color: 'from-violet-400 to-indigo-600', image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/PlayStation_App_Icon.jpg' },
  { id: 'minecraft', label: 'Minecraft', icon: Gem, color: 'from-pink-400 to-purple-500', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Minecraft-creeper-face.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original' },
  { id: 'gravityai', label: 'GravityAI', icon: Bot, color: 'from-orange-300 to-rose-500', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe_7n3WJOHmk5styrrW7rJe0cfs20bnm09DW_KUX8sr5C4hdE0R_weW--p&s=10' },
  { id: 'gnmath', label: 'gn-math', icon: Globe2, color: 'from-cyan-400 to-blue-600', image: 'https://i.ibb.co/Z1YgPhPX/gnmathlogo.png' },
  { id: 'notes', label: 'Notes', icon: NotebookPen, color: 'from-pink-400 to-purple-500', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_Notes_icon.svg/3840px-Apple_Notes_icon.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'from-slate-300 to-slate-500', image: 'https://upload.wikimedia.org/wikipedia/commons/archive/e/ea/20200720144619%21Settings_%28iOS%29.png' },
]

function AppIcon({ app, onClick, size = 'normal' }: { app: AppDefinition; onClick: () => void; size?: 'normal' | 'large' }) {
  const Icon = app.icon
  return <button aria-label={`Open ${app.label}`} onClick={onClick} className={`group flex flex-col items-center gap-1.5 ${size === 'large' ? 'w-24' : 'w-16'}`}>
    <span className={`grid place-items-center overflow-hidden rounded-[22%] bg-gradient-to-br ${app.color} text-white shadow-lg ring-1 ring-white/30 transition duration-300 group-hover:-translate-y-1 group-hover:scale-110 ${size === 'large' ? 'size-16' : 'size-12'}`}>{app.image ? <img src={app.image} alt="" className="size-full object-cover" /> : <Icon className={size === 'large' ? 'size-8' : 'size-6'} strokeWidth={1.7} />}</span>
    <span className="max-w-full truncate text-[11px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,.8)]">{app.label}</span>
  </button>
}

function WindowContent({ id, browserUrl, setBrowserUrl }: { id: AppId; browserUrl: string; setBrowserUrl: (v: string) => void }) {
  if (id === 'gravityai') return <div className="h-full"><GravityAI /></div>
  if (id === 'gnmath') return <iframe title="gn-math" src="https://itzcracker.github.io/gn-math/" className="size-full border-0 bg-white" />
  if (id === 'browser') return <div className="flex h-full flex-col bg-white/95 text-slate-800"><div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100/90 p-2"><button className="rounded p-1 text-slate-500 hover:bg-slate-200"><ChevronLeft size={16}/></button><button className="rounded p-1 text-slate-500 hover:bg-slate-200"><ChevronRight size={16}/></button><button className="rounded p-1 text-slate-500 hover:bg-slate-200" onClick={() => setBrowserUrl(browserUrl)}><RefreshCw size={14}/></button><div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm"><LockKeyhole size={12} className="text-emerald-500"/><span className="min-w-0 flex-1 truncate text-xs text-slate-600">gravity://</span><Search size={13} className="text-slate-400" /></div><Plus size={16} className="text-slate-500"/></div><iframe title="GravityOS Browser" src={browserUrl.startsWith('http') ? browserUrl : `https://gravityxfrogies.mooo.com/calculus/`} className="min-h-0 flex-1 border-0" /></div>
  if (id === 'games') return <div className="h-full bg-[#11121c] p-3"><div className="relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-indigo-950 via-[#201643] to-slate-950"><iframe title="PS5 Game Center" src="https://crackerloveps5.lovable.app" className="size-full border-0" /><div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-4 py-3 text-[10px] font-semibold tracking-[.2em] text-white/70"><span></span><span>ONLINE</span></div></div></div>
  if (id === 'spotify' || id === 'minecraft') return <div className="h-full bg-slate-950"><iframe title={id === 'spotify' ? 'Spotify' : 'Minecraft'} src={id === 'spotify' ? 'https://cineosweb.github.io/script/Apps/Spotify/index.html#/home' : 'https://itzcracker.github.io/cracker-math/'} className="size-full border-0" /></div>
  if (id === 'settings') return <div className="flex h-full flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center text-slate-800"><p className="text-sm font-semibold text-black">Get more links</p><a href="https://discord.gg/Htbp5tPdVd" target="_blank" rel="noreferrer" className="text-xs font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-4 transition hover:text-indigo-800">Join the Discord community</a><a href="https://dsc.gg/gravitycom" target="_blank" rel="noreferrer" className="text-xs text-slate-500 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-800">or dsc.gg/gravitycom</a><p className="pt-2 text-sm text-black">Made by itzcracker</p><a href="https://github.com/itzcracker" target="_blank" rel="noreferrer" aria-label="Visit itzcracker on GitHub" className="grid size-12 place-items-center overflow-hidden rounded-xl bg-white text-black shadow-sm ring-1 ring-slate-200 transition hover:scale-105 hover:bg-slate-100"><img src="https://cdn-icons-png.flaticon.com/512/25/25657.png" alt="GitHub" className="size-8 object-contain" /></a></div> 
  if (id === 'notes') return <div className="flex h-full flex-col bg-[#fffdf1] text-slate-800"><div className="border-b border-amber-200 bg-amber-50 px-5 py-3"><h2 className="font-semibold">Quick Notes</h2><p className="text-xs text-slate-500"></p></div><textarea aria-label="Notes" defaultValue="" className="min-h-0 flex-1 resize-none bg-transparent p-5 text-sm leading-7 outline-none" /></div>
  if (id === 'notes') return <div className="flex h-full flex-col bg-[#fffdf1] text-slate-800"><div className="border-b border-amber-200 bg-amber-50 px-5 py-3"><h2 className="font-semibold">Quick Notes</h2><p className="text-xs text-slate-500">Updated just now</p></div><textarea aria-label="Notes" defaultValue="" className="min-h-0 flex-1 resize-none bg-transparent p-5 text-sm leading-7 outline-none" /></div>
  return <div className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-fuchsia-100 via-white to-violet-100 text-slate-700"><Sparkles size={48} className="text-fuchsia-500"/><h2 className="text-lg font-semibold">Your memories, in orbit.</h2><p className="text-sm text-slate-500">Photos is ready for your favorite moments.</p><button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white">Import Photos</button></div>
}

export default function GravityOS() {
  const [locked, setLocked] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [now, setNow] = useState<Date | null>(null)
  const [launcher, setLauncher] = useState(false)
  const [launcherQuery, setLauncherQuery] = useState('')
  const [wallpaper, setWallpaper] = useState(originalWallpaper)
  const [wallpaperPicker, setWallpaperPicker] = useState(false)
  const [context, setContext] = useState<{x:number;y:number} | null>(null)
  const [windows, setWindows] = useState<WindowState[]>([])
  const [active, setActive] = useState<AppId | null>(null)
  const [browserUrl, setBrowserUrl] = useState('https://gravity-nmq7.onrender.com/')
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
  const openApp = (id: AppId) => { setLauncher(false); setContext(null); setWindows(ws => ws.some(w => w.id === id) ? ws.map(w => w.id === id ? { ...w, minimized: false } : w) : [...ws, { id, x: 160 + ws.length * 26, y: 90 + ws.length * 20, width: id === 'games' || id === 'gnmath' ? 720 : 650, height: id === 'settings' ? 500 : 440 }]); setActive(id) }
  const closeApp = (id: AppId) => { setWindows(ws => ws.filter(w => w.id !== id)); setActive(a => a === id ? null : a) }
  const toggleWindowFullscreen = (id: AppId) => setWindows(ws => ws.map(w => {
    if (w.id !== id) return w
    if (w.fullscreen && w.restore) return { ...w, ...w.restore, fullscreen: false, restore: undefined }
    return { ...w, fullscreen: true, restore: { x: w.x, y: w.y, width: w.width, height: w.height }, x: 0, y: 0, width: window.innerWidth, height: window.innerHeight }
  }))
  const toggleBrowserFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.()
      else await document.exitFullscreen?.()
    } catch {
      setWindows(ws => ws.map(w => w.id === active ? { ...w, fullscreen: true, restore: { x: w.x, y: w.y, width: w.width, height: w.height } } : w))
    }
  }
  const reloadSystem = () => window.location.reload()
  const appInfo = (id: AppId) => apps.find(a => a.id === id)!
  const windowIsFullscreen = windows.some(window => window.fullscreen && !window.minimized)
  return <main className="gravity-os relative h-dvh w-full overflow-hidden select-none" style={{ backgroundImage: `url(${wallpaper})` }} onContextMenu={(e) => { e.preventDefault(); setContext({x:e.clientX,y:e.clientY}) }} onClick={() => { if (context) setContext(null) }}>
    <div className="absolute inset-0 bg-black/10" />
    <div className="snowfall" aria-hidden="true">{snowflakes.map(flake => <span key={flake.id} style={{ left: `${flake.left}%`, animationDelay: `${flake.delay}s`, animationDuration: `${flake.duration}s`, width: flake.size, height: flake.size }} />)}</div>
    <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2 text-center text-white drop-shadow-lg"><p className="mt-1 text-xl font-medium tracking-tight">{now?.toLocaleDateString([], { weekday: 'long' }) ?? 'Loading day'}</p></div>
    <div className="absolute bottom-6 left-16 z-10 rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-white shadow-xl backdrop-blur-md"><time className="block text-2xl font-medium tracking-tight" style={{ fontFamily: 'ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{time}</time></div>
    <section className="pointer-events-none absolute inset-0">{windows.map(w => { const app = appInfo(w.id); const Icon = app.icon; return <article key={w.id} onClick={(e) => { e.stopPropagation(); setActive(w.id) }} className={`window pointer-events-auto ${active === w.id ? 'active' : ''} ${w.minimized ? 'minimized' : ''} ${w.fullscreen ? 'fullscreen' : ''}`} style={{ left: w.x, top: w.y, width: `min(${w.width}px, calc(100vw - 24px))`, height: `min(${w.height}px, calc(100dvh - 110px))`, zIndex: active === w.id ? 20 : 10 }}><div className="titlebar" onMouseDown={(e) => { setActive(w.id); drag.current = { id: w.id, dx: e.clientX - w.x, dy: e.clientY - w.y } }}><div className="traffic"><button aria-label={`Close ${app.label}`} className="traffic-close" onClick={() => closeApp(w.id)}><X size={9}/></button><button aria-label={`Minimize ${app.label}`} className="traffic-min" onClick={() => setWindows(ws => ws.map(x => x.id === w.id ? {...x, minimized: true} : x))}><Minus size={9}/></button><button aria-label={`${w.fullscreen ? 'Restore' : 'Fullscreen'} ${app.label}`} className="traffic-max" onClick={() => toggleWindowFullscreen(w.id)}><Maximize2 size={8}/></button></div><div className="flex items-center gap-1.5 text-xs font-medium text-white/80">{app.label}</div><div className="w-16" /></div><div className="window-body"><WindowContent id={w.id} browserUrl={browserUrl} setBrowserUrl={setBrowserUrl}/></div><span className="resize-grip" /></article> })}</section>
    {launcher && <div className="launcher" onClick={(e) => e.stopPropagation()}><div className="launcher-header"><div><p className="text-xs font-medium uppercase tracking-[.25em] text-white/60">Application space</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Launchpad</h1><p className="mt-1 text-sm text-white/55">Your apps, all in one place.</p></div><button aria-label="Close Launchpad" onClick={() => setLauncher(false)} className="launcher-close"><X size={17} /></button></div><label className="launcher-search"><Search size={15}/><input aria-label="Search apps" value={launcherQuery} onChange={event => setLauncherQuery(event.target.value)} placeholder="Search apps" autoFocus /><kbd>⌘ K</kbd></label><div className="launcher-grid">{apps.filter(app => app.label.toLowerCase().includes(launcherQuery.trim().toLowerCase())).map(app => <AppIcon key={app.id} app={app} size="large" onClick={() => { setLauncher(false); setLauncherQuery(''); openApp(app.id) }} />)}</div>{apps.every(app => !app.label.toLowerCase().includes(launcherQuery.trim().toLowerCase())) && <p className="mt-12 text-center text-sm text-white/60">No apps found</p>}</div>}
    {wallpaperPicker && <div className="fixed inset-0 z-[60] grid place-items-center bg-black/45 p-6 backdrop-blur-sm" onClick={() => setWallpaperPicker(false)}><section role="dialog" aria-modal="true" aria-labelledby="wallpaper-picker-title" className="w-full max-w-xl rounded-2xl border border-white/20 bg-slate-950/90 p-4 text-white shadow-2xl" onClick={(e) => e.stopPropagation()}><div className="mb-3 flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.25em] text-white/50">Desktop appearance</p><h2 id="wallpaper-picker-title" className="mt-1 text-base font-semibold">Choose a wallpaper</h2></div><button aria-label="Close wallpaper picker" className="rounded-full bg-white/10 p-1.5 text-white/70 hover:bg-white/20" onClick={() => setWallpaperPicker(false)}><X size={14} /></button></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{wallpaperOptions.map(option => <button key={option.url} aria-label={`Set ${option.name} wallpaper`} className={`group overflow-hidden rounded-xl border text-left transition hover:-translate-y-0.5 hover:border-white/70 ${wallpaper === option.url ? 'border-white ring-2 ring-white/30' : 'border-white/15'}`} onClick={() => { setWallpaper(option.url); setWallpaperPicker(false) }}><img src={option.url} alt={`${option.name} wallpaper preview`} className="aspect-video w-full object-cover transition group-hover:scale-105" /><span className="block truncate px-2 py-1.5 text-[11px] text-white/80">{option.name}</span></button>)}</div></section></div>}
    {context && <div className="context-menu" style={{left: context.x, top: context.y}} onClick={(e) => e.stopPropagation()}>{[['Change Wallpaper', MonitorCog], ['Refresh', RefreshCw], ['Open Launchpad', Grid2X2], ['Settings', Settings]].map(([label, Icon]) => <button key={label as string} onClick={() => { if (label === 'Change Wallpaper') setWallpaperPicker(true); if (label === 'Open Launchpad') setLauncher(true); if (label === 'Settings') openApp('settings'); setContext(null) }}><Icon size={14}/>{label as string}</button>)}</div>}
    <footer className={`dock ${windowIsFullscreen ? 'dock-hidden' : ''}`} onClick={(e) => e.stopPropagation()}><button aria-label="Open Launchpad" onClick={() => setLauncher(v => !v)} className="dock-icon"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/windows-color-icon-yROjBr2D3JW9n9SMGJG5iWAvu1nu8l.png" width={25} height={25} alt="Launchpad" /></button><span className="dock-divider" />{apps.map(app => <button key={app.id} aria-label={`Open ${app.label} from dock`} onClick={() => openApp(app.id)} className={`dock-icon ${active === app.id ? 'selected' : ''}`}><span className={`grid size-11 place-items-center overflow-hidden rounded-[22%] bg-gradient-to-br ${app.color} shadow-md`}>{app.image ? <img src={app.image} alt="" className="size-full object-cover" /> : <app.icon size={23}/>}</span></button>)}<span className="dock-divider" /><button aria-label="Power" onClick={reloadSystem} className="dock-icon"><Power size={22}/></button></footer>
    {showWelcome && <div className="pointer-events-none absolute bottom-6 right-6 z-50 rounded-2xl border border-white/20 bg-black/45 px-5 py-3 text-sm font-medium text-white shadow-2xl backdrop-blur-xl">Welcome to GravityOS!</div>}
    <div className={`lock-screen ${locked ? 'locked' : 'unlocked'}`} style={{ backgroundImage: `url(${wallpaper})` }} onClick={() => { if (!locked) return; setLocked(false); setShowWelcome(true); window.setTimeout(() => setShowWelcome(false), 3000) }}><div className="absolute inset-0 bg-black/15" /><div className="relative z-10 flex flex-col items-center pt-[16vh] text-white" style={{ fontFamily: 'ui-rounded, "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}><time className="rounded-[2rem] border border-white/25 bg-white/10 px-7 py-2 text-8xl font-semibold tracking-[-.07em] text-white/90 shadow-[inset_0_1px_1px_rgba(255,255,255,.35),0_18px_45px_rgba(0,0,0,.16)] backdrop-blur-xl drop-shadow-2xl sm:text-9xl">{time}</time><p className="mt-2 text-lg font-medium tracking-wide text-white/90">{date}</p><button className="mt-20 rounded-full border border-white/35 bg-white/15 px-5 py-2 text-sm font-semibold backdrop-blur-md transition hover:bg-white/25">Swipe to unlock</button></div><div className="absolute bottom-8 left-0 right-0 text-center text-xs text-white/60">GravityOS</div></div>
  </main> 
}

