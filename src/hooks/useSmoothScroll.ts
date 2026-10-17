import { useEffect } from 'react'
import { cancelFrame, frame } from 'motion/react'
import type Lenis from 'lenis'
import { useMotionPreferences } from './useMotionPreferences'

/** Instância atual do Lenis (para parar a rolagem com um modal aberto, por exemplo). */
export const rolagem: { lenis?: Lenis } = {}

/**
 * Rolagem com inércia (Lenis) só no computador com mouse. No toque e com movimento reduzido, rolagem nativa.
 *
 * O Lenis roda dentro do mesmo relógio do Motion, na etapa "setup", antes da etapa "read" em que o Motion
 * mede a rolagem. Assim, rolagem e parallax são calculados no mesmo quadro: nada de parallax atrasado
 * um quadro (a "tremidinha" clássica de smooth scroll com parallax).
 * O relógio só gira enquanto há rolagem suave acontecendo; parado, não gasta nada.
 */
export function useSmoothScroll(enabled: boolean) {
  const { reduced } = useMotionPreferences()
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!enabled || reduced || !fine.matches) return
    let disposed = false
    let instance: Lenis | undefined
    let agendado = false
    let anterior = 0
    let tempo = 0

    const tick = ({ timestamp }: { timestamp: number }) => {
      if (!instance || disposed || document.hidden) { agendado = false; return }
      tempo += Math.min(Math.max(timestamp - anterior, 0), 34)
      anterior = timestamp
      instance.raf(tempo)
      if (instance.isScrolling === 'smooth') frame.setup(tick)
      else agendado = false
    }
    const wake = () => {
      if (disposed || !instance || document.hidden || agendado) return
      agendado = true
      anterior = performance.now() - 16
      frame.setup(tick)
    }
    const visibility = () => {
      if (document.hidden) { cancelFrame(tick); agendado = false; instance?.stop() }
      else { instance?.start(); wake() }
    }

    void import('lenis').then(({ default: SmoothScroll }) => {
      if (disposed || !fine.matches) return
      instance = new SmoothScroll({
        autoRaf: false,
        lerp: 0.085,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
        anchors: { duration: 1.5, offset: -72 },
        stopInertiaOnNavigate: true,
        prevent: node => node.closest('[data-lenis-prevent]') !== null,
      })
      rolagem.lenis = instance
      instance.on('scroll', wake)
      window.addEventListener('wheel', wake, { passive: true })
      window.addEventListener('click', wake)
      window.addEventListener('keydown', wake)
      document.addEventListener('visibilitychange', visibility)
    }).catch(() => {})

    return () => {
      disposed = true
      cancelFrame(tick)
      instance?.destroy()
      if (rolagem.lenis === instance) rolagem.lenis = undefined
      window.removeEventListener('wheel', wake)
      window.removeEventListener('click', wake)
      window.removeEventListener('keydown', wake)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [enabled, reduced])
}
