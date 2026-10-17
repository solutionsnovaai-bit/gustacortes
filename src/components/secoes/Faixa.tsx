import { useRef } from 'react'
import { m, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { FAIXA } from '../../content/textos'
import { ITENS } from '../../config/imagens'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { useSceneActivity } from '../../hooks/useSceneActivity'
import Foto from '../ui/Foto'

const enrola = (min: number, max: number, v: number) => { const r = max - min; return ((((v - min) % r) + r) % r) + min }

/**
 * Faixa editorial: os serviços em serifa itálica gigante, correndo devagar.
 * A rolagem acelera a faixa (e inverte o sentido quando você sobe); os bigodes de neon separam as palavras.
 */
export default function Faixa() {
  const { reduced } = useMotionPreferences()
  const ref = useRef<HTMLDivElement>(null)
  const ativo = useSceneActivity(ref)
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const fator = useTransform(vel, [-1000, 0, 1000], [-4, 0, 4], { clamp: false })
  const inclina = useTransform(vel, [-2000, 0, 2000], [4, 0, -4])
  const x = useTransform(base, v => `${enrola(-50, 0, v)}%`)
  const sentido = useRef(-1)

  useAnimationFrame((_, delta) => {
    if (reduced || !ativo) return
    const f = fator.get()
    if (f < 0) sentido.current = 1; else if (f > 0) sentido.current = -1
    const passo = sentido.current * 1.4 * (delta / 1000)
    base.set(base.get() + passo + sentido.current * Math.abs(f) * (delta / 1000) * 1.4)
  })

  const grupo = (oculto: boolean) => <div className="faixa-grupo" aria-hidden={oculto || undefined}>
    {FAIXA.map((p, i) => <span key={p} className="faixa-item">
      <span className={i % 2 ? 'faixa-contorno' : 'faixa-cheio'}>{p}</span>
      <Foto img={ITENS.bigode} className="faixa-bigode" sizes="90px" />
    </span>)}
  </div>

  return <div ref={ref} className="faixa">
    <p className="sr-only">Serviços: {FAIXA.join(', ')}.</p>
    <m.div className="faixa-trilho" aria-hidden="true" style={reduced ? undefined : { x, skewX: inclina }}>
      {grupo(false)}{grupo(true)}
    </m.div>
  </div>
}
