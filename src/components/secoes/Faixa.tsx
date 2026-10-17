import { useRef } from 'react'
import type { MotionValue } from 'motion/react'
import { m, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { FAIXA } from '../../content/textos'
import { ITENS } from '../../config/imagens'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { useSceneActivity } from '../../hooks/useSceneActivity'
import Foto from '../ui/Foto'

const enrola = (min: number, max: number, v: number) => { const r = max - min; return ((((v - min) % r) + r) % r) + min }

/** Um trilho que corre sozinho; a rolagem acelera e inverte o sentido. */
function Trilho({ sentido0, fator, ativo, estilo }: { sentido0: 1 | -1; fator: MotionValue<number>; ativo: boolean; estilo: 'marfim' | 'neon' }) {
  const { reduced } = useMotionPreferences()
  const base = useMotionValue(0)
  const x = useTransform(base, v => `${enrola(-50, 0, v)}%`)
  const sentido = useRef<number>(sentido0)
  useAnimationFrame((_, delta) => {
    if (reduced || !ativo) return
    const f = fator.get()
    if (f < -.05) sentido.current = -sentido0; else if (f > .05) sentido.current = sentido0
    base.set(base.get() + sentido.current * (1.1 + Math.abs(f) * 1.6) * (delta / 1000))
  })
  const grupo = (k: number) => <div className="faixa-grupo" key={k}>
    {FAIXA.map((p, i) => <span key={p} className="faixa-item">
      <span className={estilo === 'marfim' ? (i % 2 ? 'faixa-italico' : 'faixa-reto') : (i % 2 ? 'faixa-contorno' : 'faixa-neon')}>{p}</span>
      {estilo === 'neon' ? <Foto img={ITENS.bigode} className="faixa-bigode" sizes="90px" /> : <span className="faixa-estrela" aria-hidden="true">✦</span>}
    </span>)}
  </div>
  return <m.div className="faixa-trilho" style={reduced ? undefined : { x }}>{grupo(0)}{grupo(1)}</m.div>
}

/**
 * Faixas cruzadas, como fita de isolamento num editorial de moda: uma marfim com serifa,
 * outra preta com neon, correndo em sentidos opostos. A rolagem acelera as duas e entorta o cruzamento.
 */
export default function Faixa() {
  const { reduced } = useMotionPreferences()
  const ref = useRef<HTMLDivElement>(null)
  const ativo = useSceneActivity(ref)
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const fator = useTransform(vel, [-1000, 0, 1000], [-3, 0, 3], { clamp: false })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const giroA = useTransform(scrollYProgress, [0, 1], [-7, -2])
  const giroB = useTransform(scrollYProgress, [0, 1], [2, 7])

  return <div ref={ref} className="faixa" aria-label={`Serviços: ${FAIXA.join(', ')}.`} role="img">
    <m.div className="faixa-fita faixa-fita-a" aria-hidden="true" style={reduced ? undefined : { rotate: giroA }}>
      <Trilho sentido0={-1} fator={fator} ativo={ativo} estilo="marfim" />
    </m.div>
    <m.div className="faixa-fita faixa-fita-b" aria-hidden="true" style={reduced ? undefined : { rotate: giroB }}>
      <Trilho sentido0={1} fator={fator} ativo={ativo} estilo="neon" />
    </m.div>
  </div>
}
