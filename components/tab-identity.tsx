'use client'

import { useEffect } from 'react'

const SITE_TITLE = 'GravityOS'
const SITE_ICON = '/gravity-logo.png'
const AWAY_TITLE = 'Google'
const AWAY_ICON = '/google-favicon.png'

export function TabIdentity() {
  useEffect(() => {
    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]') ?? document.createElement('link')
    icon.rel = 'icon'
    document.head.appendChild(icon)

    const updateIdentity = () => {
      document.title = document.visibilityState === 'hidden' ? AWAY_TITLE : SITE_TITLE
      const nextIcon = document.visibilityState === 'hidden' ? AWAY_ICON : SITE_ICON
      icon.href = `${nextIcon}${nextIcon.includes('?') ? '&' : '?'}tab=${document.visibilityState}-${Date.now()}`
    }

    updateIdentity()
    document.addEventListener('visibilitychange', updateIdentity)
    window.addEventListener('focus', updateIdentity)
    return () => {
      document.removeEventListener('visibilitychange', updateIdentity)
      window.removeEventListener('focus', updateIdentity)
    }
  }, [])

  return null
}
