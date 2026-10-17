import { useRef } from 'react'
import type { ReactNode, PointerEvent } from 'react'
import { m, useMotionValue, useSpring } from 'motion/react'
import { ArrowUpRight, CalendarDays } from 'lucide-react'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'

type Props = {
  href: string
  children: string
  variante?: 'marfim' | 'contorno' | 'neon'
  className?: string
  externo?: boolean
  icone?: ReactNode
  rotuloAcessivel?: string
  onClick?: () => void
}

/**
 * Botão principal: ícone num círculo, texto que "rola" no hover, preenchimento que sobe
 * e um leve efeito magnético com o mouse (só em telas com mouse).
 */
export function Botao({ href, children, variante = 'marfim', className = '', externo = true, icone, rotuloAcessivel, onClick }: Props) {
  const { reduced } = useMotionPreferences()
  const ref = useRef<HTMLAnchorElement>(null)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 16, mass: .6 })
  const y = useSpring(my, { stiffness: 220, damping: 16, mass: .6 })
  const mover = (e: PointerEvent) => {
    if (reduced || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * .18)
    my.set((e.clientY - (r.top + r.height / 2)) * .28)
  }
  const soltar = () => { mx.set(0); my.set(0) }
  return <m.a ref={ref} href={href} className={`botao botao-${variante} ${className}`} style={{ x, y }} onPointerMove={mover} onPointerLeave={soltar} onClick={onClick}
    {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})} aria-label={rotuloAcessivel}>
    <span className="botao-icone">{icone ?? <CalendarDays aria-hidden="true" strokeWidth={1.8} />}</span>
    <span className="botao-rolo"><span>{children}</span><span aria-hidden="true">{children}</span></span>
    <ArrowUpRight className="botao-seta" aria-hidden="true" strokeWidth={1.8} />
  </m.a>
}
