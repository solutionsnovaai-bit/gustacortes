import { useRef, useState } from 'react'
import type { PointerEvent as PEvent } from 'react'
import type { MotionValue } from 'motion/react'
import { animate, m, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { VITRINE } from '../../content/textos'
import { GRUPOS, reais } from '../../content/servicos'
import { ITENS } from '../../config/imagens'
import type { Imagem } from '../../config/imagens'
import { AGENDA } from '../../lib/whatsapp'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import Foto from '../ui/Foto'
import Poste from '../ui/Poste'
import { Titulo } from '../ui/Revelar'

/* Cada serviço ganha uma peça da bancada como símbolo. */
const SIMBOLO: (Imagem | 'poste')[] = [ITENS.maquina, ITENS.navalha, ITENS.pente, ITENS.tesoura, 'poste', ITENS.bigode, ITENS.cadeira]
const CARTAS = GRUPOS.flatMap(g => g.itens.map(s => ({ ...s, cor: g.cor, grupo: g.titulo }))).map((s, i) => ({ ...s, simbolo: SIMBOLO[i % SIMBOLO.length] }))
const N = CARTAS.length
const PASSO = 360 / N

type Carta = (typeof CARTAS)[number]

/** Uma carta do carrossel 3D. O ângulo vem do giro do anel; de costas, ela some. */
function CartaAnel({ c, i, giro, arrastou }: { c: Carta; i: number; giro: MotionValue<number>; arrastou: () => boolean }) {
  const transform = useTransform(giro, g => `rotateY(${(i * PASSO + g).toFixed(2)}deg) translateZ(var(--raio))`)
  const frente = useTransform(giro, g => Math.cos(((i * PASSO + g) * Math.PI) / 180))
  const opacity = useTransform(frente, f => Math.max(0, .15 + f * .85))
  const filter = useTransform(frente, f => `brightness(${(.35 + Math.max(0, f) * .65).toFixed(2)})`)
  return <m.a className={`carta carta-${c.cor}`} href={AGENDA} target="_blank" rel="noopener noreferrer" data-cursor="Agendar" style={{ transform, opacity, filter }}
    aria-label={`${c.nome}, R$ ${reais(c.preco)}. Agendar (abre a agenda em nova aba)`} draggable={false}
    onClick={e => { if (arrastou()) e.preventDefault() }}>
    <span className="carta-topo"><span className="num">{String(i + 1).padStart(2, '0')}</span><span>{c.grupo}</span></span>
    <span className="carta-obj">{c.simbolo === 'poste' ? <Poste sizes="80px" className="carta-poste" /> : <Foto img={c.simbolo} sizes="260px" />}</span>
    <span className="carta-nome">{c.nome}</span>
    <span className="carta-preco"><span className="carta-rs">R$</span>{reais(c.preco)}</span>
    <span className="carta-agendar">{VITRINE.agendar}<ArrowUpRight strokeWidth={1.6} aria-hidden="true" /></span>
  </m.a>
}

/**
 * A vitrine: a tela trava e os serviços giram num carrossel 3D conforme você rola.
 * Dá para girar com o dedo ou com o mouse também (com inércia e encaixe na carta da frente).
 * Embaixo, o serviço da frente aparece grande, com o botão de agendar.
 */
export default function Vitrine() {
  const { reduced } = useMotionPreferences()
  const cena = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: cena, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: .5 })
  const base = useTransform(p, v => -v * PASSO * (N - 1))
  const arraste = useMotionValue(0)
  const giro = useTransform(() => base.get() + arraste.get())
  const inclina = useTransform(p, [0, .5, 1], [14, 6, 14])
  const [frente, setFrente] = useState(0)
  useMotionValueEvent(giro, 'change', g => setFrente(((Math.round(-g / PASSO) % N) + N) % N))

  /* Arrastar para girar (com inércia e encaixe). */
  const toque = useRef({ x: 0, ini: 0, t: 0, vel: 0, moveu: 0 })
  const segurando = useRef(false)
  const comecar = (e: PEvent) => {
    segurando.current = true
    toque.current = { x: e.clientX, ini: arraste.get(), t: performance.now(), vel: 0, moveu: 0 }
    arraste.stop()
  }
  const mover = (e: PEvent) => {
    if (!segurando.current) return
    const t = toque.current
    const dx = e.clientX - t.x
    const agora = performance.now()
    const novo = t.ini + dx * .32
    t.vel = (novo - arraste.get()) / Math.max(1, agora - t.t) * 1000
    t.t = agora
    t.moveu = Math.max(t.moveu, Math.abs(dx))
    arraste.set(novo)
  }
  const soltar = () => {
    if (!segurando.current) return
    segurando.current = false
    const projetado = base.get() + arraste.get() + toque.current.vel * .25
    const encaixe = Math.round(projetado / PASSO) * PASSO - base.get()
    animate(arraste, encaixe, { type: 'spring', stiffness: 140, damping: 22, velocity: toque.current.vel })
  }

  const destaque = CARTAS[frente]

  if (reduced) {
    return <section id="vitrine" className="vitrine is-estatica tema-noite" aria-labelledby="vitrine-titulo">
      <div className="conteiner">
        <p className="rotulo">{VITRINE.rotulo}</p>
        <Titulo id="vitrine-titulo" className="display vitrine-titulo" linhas={VITRINE.titulo} italico={[1]} />
      </div>
      <div className="vitrine-lista">
        {CARTAS.map((c, i) => <a key={c.nome} className={`carta carta-${c.cor}`} href={AGENDA} target="_blank" rel="noopener noreferrer">
          <span className="carta-topo"><span className="num">{String(i + 1).padStart(2, '0')}</span><span>{c.grupo}</span></span>
          <span className="carta-obj">{c.simbolo === 'poste' ? <Poste sizes="80px" className="carta-poste" /> : <Foto img={c.simbolo} sizes="260px" />}</span>
          <span className="carta-nome">{c.nome}</span>
          <span className="carta-preco"><span className="carta-rs">R$</span>{reais(c.preco)}</span>
          <span className="carta-agendar">{VITRINE.agendar}<ArrowUpRight strokeWidth={1.6} aria-hidden="true" /></span>
        </a>)}
      </div>
    </section>
  }

  return <section id="vitrine" className="vitrine tema-noite" aria-labelledby="vitrine-titulo">
    <div ref={cena} className="vitrine-cena">
      <div className="vitrine-palco">
        <div className="conteiner vitrine-cabeca">
          <p className="rotulo">{VITRINE.rotulo}</p>
          <Titulo id="vitrine-titulo" className="display vitrine-titulo" linhas={VITRINE.titulo} italico={[1]} />
          <p className="vitrine-dica">{VITRINE.dica}</p>
        </div>

        <div className="vitrine-anel-area" data-cursor="Arraste" onPointerDown={comecar} onPointerMove={mover} onPointerUp={soltar} onPointerCancel={soltar} onPointerLeave={soltar}>
          <div className="vitrine-recuo">
            <m.div className="vitrine-anel" style={{ rotateX: inclina }}>
              {CARTAS.map((c, i) => <CartaAnel key={c.nome} c={c} i={i} giro={giro} arrastou={() => toque.current.moveu > 6} />)}
            </m.div>
          </div>
          <div className="vitrine-chao" aria-hidden="true" />
        </div>

        <div className={`vitrine-destaque vitrine-${destaque.cor}`} aria-live="polite">
          <p className="vitrine-destaque-nome">{destaque.nome}</p>
          <p className="vitrine-destaque-detalhe">{destaque.detalhe}</p>
          <a className="vitrine-destaque-botao" href={AGENDA} target="_blank" rel="noopener noreferrer" aria-label={`Agendar ${destaque.nome} (abre a agenda em nova aba)`}>
            <span className="num">R$ {reais(destaque.preco)}</span><span>{VITRINE.agendar}</span><ArrowUpRight strokeWidth={1.6} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </section>
}
