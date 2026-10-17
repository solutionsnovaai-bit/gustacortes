import type { ReactNode } from 'react'
import { m } from 'motion/react'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'

export const EASE = [0.22, 1, 0.36, 1] as const
export const CORTINA = [0.76, 0, 0.24, 1] as const

type Tag = 'div' | 'li' | 'p' | 'figure' | 'span'

/** Entrada ao rolar: sobe e aparece uma vez. */
export default function Revelar({ children, className = '', delay = 0, y = 26, as = 'div', amount = .2 }: { children: ReactNode; className?: string; delay?: number; y?: number; as?: Tag; amount?: number }) {
  const { reduced } = useMotionPreferences()
  const Comp = m[as] as typeof m.div
  return <Comp className={className} initial={reduced ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount }} transition={{ duration: 1.1, delay, ease: EASE }}>{children}</Comp>
}

type TituloProps = {
  linhas: readonly string[]
  /** Índices das linhas em itálico (o acento editorial). */
  italico?: readonly number[]
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  /** Se definido, anima quando virar true (em vez de ao entrar na tela). */
  ativo?: boolean
  atraso?: number
  id?: string
  /** Texto lido pelo leitor de tela (padrão: as linhas juntas). */
  rotulo?: string
}

/** Título com linhas mascaradas: cada linha sobe de trás de uma borda invisível. */
export function Titulo({ linhas, italico = [], as: Tag = 'h2', className = '', ativo, atraso = 0, id, rotulo }: TituloProps) {
  const { reduced } = useMotionPreferences()
  const controlado = ativo !== undefined
  const estado = reduced ? 'show' : controlado ? (ativo ? 'show' : 'hidden') : undefined
  return <Tag className={className} aria-label={rotulo ?? linhas.join(' ')} id={id}>
    <m.span className="linhas" aria-hidden="true"
      initial={reduced ? 'show' : 'hidden'}
      animate={estado}
      whileInView={controlado || reduced ? undefined : 'show'}
      viewport={{ once: true, amount: .5 }}>
      {linhas.map((l, i) => <span className="linha-mascara" key={l + i}>
        <m.span className={italico.includes(i) ? 'italico' : undefined}
          variants={{ hidden: { y: '112%' }, show: { y: 0, transition: { duration: 1.25, delay: atraso + i * .1, ease: EASE } } }}>{l}</m.span>
      </span>)}
    </m.span>
  </Tag>
}

/** Rótulo de seção no estilo editorial: número, traço e nome, em caixa alta espaçada. */
export function Rotulo({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <Revelar as="p" className={`rotulo ${className}`} y={12}>{children}</Revelar>
}
