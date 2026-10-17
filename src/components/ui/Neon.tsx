import { useEffect, useRef } from 'react'
import { animate, useInView } from 'motion/react'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'

type Props = {
  texto: string
  cor: 'ciano' | 'violeta' | 'verde'
  className?: string
  /** Atraso (s) para acender depois de entrar na tela. */
  atraso?: number
}

/* Como um tubo de neon de verdade: engasga duas, três vezes antes de firmar. */
const PISCA = { opacity: [0, 1, .1, .85, .2, 1, .5, 1], times: [0, .07, .15, .3, .38, .55, .7, 1] }

/**
 * Palavra em neon: o tubo apagado (vidro) fica sempre lá; o tubo aceso vem por cima
 * e acende piscando quando a palavra entra na tela.
 */
export default function Neon({ texto, cor, className = '', atraso = 0 }: Props) {
  const { reduced } = useMotionPreferences()
  const caixa = useRef<HTMLSpanElement>(null)
  const luz = useRef<HTMLSpanElement>(null)
  const visto = useInView(caixa, { once: true, amount: .6 })
  useEffect(() => {
    const el = luz.current
    if (!el) return
    if (reduced) { el.style.opacity = '1'; return }
    if (!visto) return
    const a = animate(el, PISCA, { duration: 1.15, delay: atraso, ease: 'linear' })
    return () => a.stop()
  }, [visto, reduced, atraso])
  return <span ref={caixa} className={`neon neon-${cor} ${className}`}>
    <span className="neon-vidro">{texto}</span>
    <span ref={luz} className="neon-luz" aria-hidden="true">{texto}</span>
  </span>
}
