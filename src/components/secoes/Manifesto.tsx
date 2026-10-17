import { useMemo, useRef } from 'react'
import type { CSSProperties } from 'react'
import type { MotionValue } from 'motion/react'
import { m, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'
import { MANIFESTO } from '../../content/textos'
import { ITENS } from '../../config/imagens'
import type { Imagem } from '../../config/imagens'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import Foto from '../ui/Foto'

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

/* As ferramentas que orbitam a frase: imagem, ângulo de partida, largura na tela e giro próprio. */
const ORBITA: { img: Imagem; a0: number; w: string; giro: number }[] = [
  { img: ITENS.tesoura, a0: 0, w: 'clamp(120px, 17vw, 300px)', giro: 140 },
  { img: ITENS.navalha, a0: Math.PI * .5, w: 'clamp(110px, 15vw, 260px)', giro: -120 },
  { img: ITENS.pente, a0: Math.PI, w: 'clamp(120px, 16vw, 280px)', giro: 90 },
  { img: ITENS.maquina, a0: Math.PI * 1.5, w: 'clamp(70px, 9vw, 160px)', giro: -70 },
]

/** Uma ferramenta em órbita 3D: na frente da frase fica grande e nítida; atrás, pequena, escura e desfocada. */
/* No celular, sem desfoque (pesa no processador); só escurece o que passa atrás. */
const TOQUE = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

function Orbitante({ p, img, a0, w, giro }: { p: MotionValue<number> } & (typeof ORBITA)[number]) {
  const ang = useTransform(p, v => a0 + v * Math.PI * 2.4)
  const x = useTransform(ang, a => `${(Math.cos(a) * 41).toFixed(2)}vw`)
  const y = useTransform(ang, a => `${(Math.sin(a) * 15 + Math.sin(a * 2) * 4).toFixed(2)}vh`)
  const prof = useTransform(ang, a => (Math.sin(a) + 1) / 2)
  const scale = useTransform(prof, d => .55 + d * .65)
  const zIndex = useTransform(prof, d => (d > .5 ? 3 : 1))
  const filter = useTransform(prof, d => `${TOQUE ? '' : `blur(${((1 - d) * 5).toFixed(1)}px) `}brightness(${(.45 + d * .65).toFixed(2)})`)
  const rotate = useTransform(p, v => v * giro)
  return <m.div className="orbita-item" style={{ x, y, scale, zIndex, filter, rotate, width: w, left: `calc(50% - ${w} / 2)`, marginTop: `calc(${w} * -.42)` }} aria-hidden="true">
    <Foto img={img} sizes="300px" />
  </m.div>
}

/**
 * Manifesto: a tela trava, a frase acende palavra por palavra e as ferramentas orbitam em volta dela
 * em 3D (passando na frente e atrás do texto) enquanto você rola.
 */
export default function Manifesto() {
  const { reduced } = useMotionPreferences()
  const cena = useRef<HTMLDivElement>(null)
  const texto = useRef<HTMLParagraphElement>(null)
  const palavras = useMemo(() => separa(MANIFESTO.texto), [])
  const limpo = palavras.map(p => p.t).join(' ')
  const { scrollYProgress } = useScroll({ target: cena, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: .4 })
  const leitura = useTransform(p, [.08, .78], [0, 1])
  useMotionValueEvent(leitura, 'change', v => texto.current?.style.setProperty('--p', v.toFixed(4)))
  const escala = useTransform(p, [0, .15, .85, 1], [.92, 1, 1, .96])
  const brilho = useTransform(p, [0, .5, 1], [.2, 1, .3])

  return <section id="manifesto" className={`manifesto tema-noite ${reduced ? 'is-estatico' : ''}`} aria-label="Manifesto">
    <div ref={cena} className="manifesto-cena">
      <div className="manifesto-palco">
        {!reduced && <m.div className="manifesto-halo" aria-hidden="true" style={{ opacity: brilho }} />}
        {!reduced && <div className="orbita">{ORBITA.map((o, i) => <Orbitante key={i} p={p} {...o} />)}</div>}
        <m.div className="conteiner manifesto-grade" style={reduced ? undefined : { scale: escala }}>
          <p className="rotulo manifesto-rotulo">{MANIFESTO.rotulo}</p>
          <p ref={texto} className="manifesto-texto" aria-label={limpo} style={{ '--n': palavras.length } as CSSProperties}>
            {palavras.map((w, i) => <span key={i} aria-hidden="true" className={`mp ${w.cor ? `mp-${w.cor}` : ''}`} style={{ '--i': i } as CSSProperties}>{w.t} </span>)}
          </p>
        </m.div>
      </div>
    </div>
  </section>
}
