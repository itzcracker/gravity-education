'use client'

import { useEffect } from 'react'

const SITE_TITLE = 'GravityOS'
const SITE_ICON = '/gravity-favicon-logo.png'
const AWAY_TITLE = 'Google'
const AWAY_ICON = '/google-favicon.png'

export function TabIdentity() {
  useEffect(() => {
    const updateIdentity = () => {
      document.title = document.visibilityState === 'hidden' ? AWAY_TITLE : SITE_TITLE
      const nextIcon = document.visibilityState === 'hidden' ? AWAY_ICON : SITE_ICON
      document.querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="shortcut icon"]').forEach(link => link.remove())
      const icon = document.createElement('link')
      icon.rel = 'icon'
      icon.type = 'image/png'
      icon.href = `${nextIcon}?tab=${document.visibilityState}-${Date.now()}`
      document.head.appendChild(icon)
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
