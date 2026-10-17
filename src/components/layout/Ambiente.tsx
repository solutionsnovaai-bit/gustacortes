import { useEffect, useState } from 'react'
import { m, useMotionValue, useScroll, useSpring } from 'motion/react'
import { useMedia } from '../../hooks/useMedia'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'

/**
 * Ambiente da página inteira:
 * - fio de progresso no alto (ciano para violeta, como o letreiro);
 * - grão de filme bem fino por cima de tudo;
 * - no computador, um cursor próprio: ponto que acompanha seco e anel que vem atrás com mola;
 *   sobre links o anel cresce, e onde houver data-cursor ele mostra a palavra (ex.: "Agendar", "Arraste").
 */
export default function Ambiente({ liberado }: { liberado: boolean }) {
  const { reduced } = useMotionPreferences()
  const { scrollYProgress } = useScroll()
  const barra = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: .3 })
  const fino = useMedia('(hover: hover) and (pointer: fine)')
  const usaCursor = fino && !reduced && liberado
  const x = useMotionValue(-200), y = useMotionValue(-200)
  const ax = useSpring(x, { stiffness: 420, damping: 36, mass: .5 })
  const ay = useSpring(y, { stiffness: 420, damping: 36, mass: .5 })
  const [modo, setModo] = useState<'' | 'link' | 'rotulo'>('')
  const [rotulo, setRotulo] = useState('')
  const [apertado, setApertado] = useState(false)
  const [fora, setFora] = useState(true)

  useEffect(() => {
    if (!usaCursor) return
    document.documentElement.classList.add('cursor-proprio')
    const mover = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); setFora(false) }
    const sobre = (e: PointerEvent) => {
      const alvo = e.target instanceof Element ? e.target : null
      const marcado = alvo?.closest<HTMLElement>('[data-cursor]')
      const link = alvo?.closest('a, button, [role="button"], label')
      if (marcado) { setModo('rotulo'); setRotulo(marcado.dataset.cursor ?? '') }
      else if (link) { setModo('link'); setRotulo('') }
      else { setModo(''); setRotulo('') }
    }
    const desce = () => setApertado(true)
    const sobe = () => setApertado(false)
    const sai = () => setFora(true)
    window.addEventListener('pointermove', mover, { passive: true })
    window.addEventListener('pointerover', sobre, { passive: true })
    window.addEventListener('pointerdown', desce)
    window.addEventListener('pointerup', sobe)
    document.documentElement.addEventListener('pointerleave', sai)
    return () => {
      document.documentElement.classList.remove('cursor-proprio')
      window.removeEventListener('pointermove', mover); window.removeEventListener('pointerover', sobre)
      window.removeEventListener('pointerdown', desce); window.removeEventListener('pointerup', sobe)
      document.documentElement.removeEventListener('pointerleave', sai)
    }
  }, [usaCursor, x, y])

  return <>
    <div className="progresso" aria-hidden="true"><m.span style={{ scaleX: barra }} /></div>
    <div className="grao-global" aria-hidden="true" />
    {usaCursor && <>
      <m.div className={`cursor ${modo ? `is-${modo}` : ''} ${apertado ? 'is-apertado' : ''} ${fora ? 'is-fora' : ''}`} style={{ x: ax, y: ay }} aria-hidden="true">
        <span className="cursor-anel" />
        <span className="cursor-rotulo">{rotulo}</span>
      </m.div>
      <m.div className={`cursor-ponto ${modo ? 'is-oculto' : ''} ${fora ? 'is-fora' : ''}`} style={{ x, y }} aria-hidden="true" />
    </>}
  </>
}
