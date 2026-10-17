import { useMemo, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { MANIFESTO } from '../../content/textos'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import Revelar from '../ui/Revelar'

type Palavra = { t: string; cor?: 'ciano' | 'violeta' }

/* "[régua]" vira ciano e "{navalha}" vira violeta; o resto é marfim. */
function separa(texto: string): Palavra[] {
  return texto.split(/\s+/).map(p => {
    const c = p.match(/^\[(.+)\](.*)$/), v = p.match(/^\{(.+)\}(.*)$/)
    if (c) return { t: c[1] + c[2], cor: 'ciano' }
    if (v) return { t: v[1] + v[2], cor: 'violeta' }
    return { t: p }
  })
}

/**
 * Manifesto: uma frase só, em serifa grande. As palavras acendem uma a uma conforme a rolagem
 * (o progresso vai numa variável CSS; nada de re-render a cada quadro).
 */
export default function Manifesto() {
  const { reduced } = useMotionPreferences()
  const ref = useRef<HTMLParagraphElement>(null)
  const palavras = useMemo(() => separa(MANIFESTO.texto), [])
  const limpo = palavras.map(p => p.t).join(' ')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 82%', 'end 45%'] })
  useMotionValueEvent(scrollYProgress, 'change', v => ref.current?.style.setProperty('--p', v.toFixed(4)))

  return <section id="manifesto" className="secao manifesto" aria-label="Manifesto">
    <div className="conteiner manifesto-grade">
      <Revelar as="p" className="rotulo manifesto-rotulo" y={12}>{MANIFESTO.rotulo}</Revelar>
      <p ref={ref} className={`manifesto-texto ${reduced ? 'is-estatico' : ''}`} aria-label={limpo}
        style={{ '--n': palavras.length } as CSSProperties}>
        {palavras.map((p, i) => <span key={i} aria-hidden="true" className={`mp ${p.cor ? `mp-${p.cor}` : ''}`} style={{ '--i': i } as CSSProperties}>{p.t} </span>)}
      </p>
    </div>
  </section>
}
