import { useRef } from 'react'
import { m, useInView } from 'motion/react'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'

const DIGITOS = Array.from({ length: 20 }, (_, i) => i % 10)

/**
 * Número que gira como placar de estádio quando entra na tela: cada dígito dá uma volta
 * inteira antes de parar no lugar (o da direita chega por último).
 */
export default function Placar({ valor, className = '' }: { valor: number; className?: string }) {
  const { reduced } = useMotionPreferences()
  const ref = useRef<HTMLSpanElement>(null)
  const visto = useInView(ref, { once: true, amount: .8 })
  const texto = String(valor)
  return <span ref={ref} className={`placar ${className}`} aria-label={texto}>
    {texto.split('').map((d, i) => {
      const alvo = 10 + Number(d)
      return <span key={i} className="placar-col" aria-hidden="true">
        <m.span className="placar-faixa"
          initial={reduced ? false : { y: '0%' }}
          animate={reduced ? undefined : visto ? { y: `${(-alvo / 20) * 100}%` } : undefined}
          style={reduced ? { y: `${(-alvo / 20) * 100}%` } : undefined}
          transition={{ duration: 1.5 + i * .35, ease: [0.16, 0.84, 0.24, 1], delay: .1 }}>
          {DIGITOS.map((n, k) => <span key={k}>{n}</span>)}
        </m.span>
      </span>
    })}
  </span>
}
