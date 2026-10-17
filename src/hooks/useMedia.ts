import { useSyncExternalStore } from 'react'

/** true enquanto a media query casa (ex.: '(min-width: 1024px)'). */
export function useMedia(query: string, padrao = false) {
  return useSyncExternalStore(
    cb => { const m = window.matchMedia(query); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb) },
    () => window.matchMedia(query).matches,
    () => padrao,
  )
}
