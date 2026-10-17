import { useLayoutEffect, useRef, useState } from 'react'
import type { MotionValue } from 'motion/react'
import { m, useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { BANCADA } from '../../content/textos'
import { ITENS } from '../../config/imagens'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import Foto from '../ui/Foto'
import Poste from '../ui/Poste'
import { Titulo } from '../ui/Revelar'

type Peca = (typeof BANCADA.pecas)[number]

/** Um painel da bancada: número gigante vazado, a ferramenta flutuando e girando, e a legenda. */
function Painel({ peca, p, i, n, estatico }: { peca: Peca; p: MotionValue<number>; i: number; n: number; estatico: boolean }) {
  const c = (i + 1) / (n + 1)
  const faixa = [c - .38, c + .38]
  const rotate = useTransform(p, faixa, peca.id === 'poste' ? [-8, 8] : [-38, 30])
  const y = useTransform(p, faixa, ['16%', '-16%'])
  const xNum = useTransform(p, faixa, ['40%', '-40%'])
  const escala = useTransform(p, [c - .3, c, c + .3], [.82, 1.06, .82])
  const luz = useTransform(p, [c - .28, c, c + .28], [.25, 1, .25])
  const img = peca.id === 'poste' ? null : ITENS[peca.id as 'tesoura' | 'navalha' | 'maquina' | 'pente']
  return <article className={`painel painel-${peca.cor} painel-${peca.id}`}>
    <m.span className="painel-n num" aria-hidden="true" style={estatico ? undefined : { x: xNum }}>0{i + 1}</m.span>
    <m.div className="painel-luz" aria-hidden="true" style={estatico ? undefined : { opacity: luz }} />
    <m.div className="painel-obj" style={estatico ? undefined : { rotate, y, scale: escala }}>
      {img ? <Foto img={img} sizes="(max-width: 767px) 70vw, 520px" /> : <Poste sizes="160px" className="painel-poste" />}
    </m.div>
    <div className="painel-legenda">
      <p className="painel-papel">{peca.papel}</p>
      <h3 className="painel-nome">{peca.nome}</h3>
      <p className="painel-texto">{peca.texto}</p>
    </div>
  </article>
}

/**
 * A bancada: a tela trava e os painéis correm na horizontal enquanto você rola para baixo.
 * Cada ferramenta gira e flutua em profundidade; embaixo, a barra de progresso é um poste de barbearia.
 */
export default function Bancada() {
  const { reduced } = useMotionPreferences()
  const cena = useRef<HTMLDivElement>(null)
  const trilho = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState(0)
  const [atual, setAtual] = useState(0)
  const n = BANCADA.pecas.length

  useLayoutEffect(() => {
    const t = trilho.current
    if (!t || reduced) return
    const medir = () => setDist(Math.max(0, t.scrollWidth - document.documentElement.clientWidth))
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(t)
    window.addEventListener('resize', medir)
    return () => { ro.disconnect(); window.removeEventListener('resize', medir) }
  }, [reduced])

  const { scrollYProgress } = useScroll({ target: cena, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 150, damping: 30, mass: .35 })
  const x = useTransform(p, v => -v * dist)
  /* Inclina de leve conforme a velocidade, como se o trilho tivesse peso. */
  const inclina = useSpring(useTransform(useVelocity(p), [-1.2, 0, 1.2], [5, 0, -5]), { stiffness: 120, damping: 24 })
  useMotionValueEvent(p, 'change', v => setAtual(Math.min(n, Math.max(1, Math.round(v * (n + 1))))))

  return <section id="bancada" className={`bancada tema-noite ${reduced ? 'is-estatica' : ''}`} aria-labelledby="bancada-titulo">
    <div ref={cena} className="bancada-cena" style={reduced ? undefined : { height: `calc(100svh + ${dist}px)` }}>
      <div className="bancada-palco">
        <m.div ref={trilho} className="bancada-trilho" style={reduced ? undefined : { x, skewX: inclina }}>
          <div className="bancada-abre">
            <p className="rotulo">{BANCADA.rotulo}</p>
            <Titulo id="bancada-titulo" className="display bancada-titulo" linhas={BANCADA.titulo} italico={[1]} />
            <p className="lead">{BANCADA.texto}</p>
          </div>
          {BANCADA.pecas.map((pc, i) => <Painel key={pc.id} peca={pc} p={p} i={i} n={n} estatico={reduced} />)}
          <div className="bancada-fim">
            <p className="display bancada-fim-texto"><span className="italico">{BANCADA.fim}</span></p>
            <a className="link-linha" href="#vitrine">Ver os serviços<ArrowRight aria-hidden="true" strokeWidth={1.6} /></a>
          </div>
        </m.div>
        {!reduced && <div className="bancada-rodape" aria-hidden="true">
          <span className="bancada-contador num">0{atual} <span>/ 0{n}</span></span>
          <span className="bancada-barra"><m.span className="bancada-barra-fio" style={{ scaleX: p }} /></span>
        </div>}
      </div>
    </div>
  </section>
}
