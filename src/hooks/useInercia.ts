import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Inércia de mola para os balões flutuantes: a velocidade da rolagem puxa o elemento,
 * e ao parar ele volta com um leve quique, inclinando e esticando conforme a velocidade.
 * Só mexe em transform (nada de layout). Com "reduzir movimento", fica parado.
 */
export function useInercia(ref: RefObject<HTMLElement | null>, ativo: boolean, { giroMax = 14, forca = .5 } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el || !ativo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let ultimoY = window.scrollY, ultimoT = performance.now()
    let alvo = 0, pos = 0, vel = 0, raf = 0, parado = 0

    const quadro = (agora: number) => {
      const dt = Math.min(2.5, (agora - ultimoT) / 16.667)
      ultimoT = agora
      alvo *= Math.pow(0.82, dt)
      const f = (alvo - pos) * 0.12 - vel * 0.26
      vel += f * dt
      pos += vel * dt
      const giro = Math.max(-giroMax, Math.min(giroMax, vel * 1.6))
      const estica = Math.min(.14, Math.abs(vel) / 38)
      el.style.transform = `translate3d(0, ${pos.toFixed(2)}px, 0) rotate(${giro.toFixed(2)}deg) scale(${(1 - estica * .6).toFixed(3)}, ${(1 + estica).toFixed(3)})`
      if (Math.abs(pos) < .05 && Math.abs(vel) < .05 && Math.abs(alvo) < .05) parado++; else parado = 0
      if (parado > 12) { el.style.transform = ''; raf = 0; return }
      raf = requestAnimationFrame(quadro)
    }
    const aoRolar = () => {
      const y = window.scrollY
      const d = y - ultimoY
      ultimoY = y
      alvo = Math.max(-40, Math.min(40, alvo + d * forca))
      if (!raf) { parado = 0; ultimoT = performance.now(); raf = requestAnimationFrame(quadro) }
    }
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => { window.removeEventListener('scroll', aoRolar); cancelAnimationFrame(raf); el.style.transform = '' }
  }, [ref, ativo, giroMax, forca])
}
