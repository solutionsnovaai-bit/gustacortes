import { useRef } from 'react'
import type { CSSProperties } from 'react'
import type { MotionValue } from 'motion/react'
import { m, useScroll, useSpring, useTransform } from 'motion/react'
import { CADEIRA } from '../../content/textos'
import { ITENS } from '../../config/imagens'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { useSceneActivity } from '../../hooks/useSceneActivity'
import Foto from '../ui/Foto'
import { Rotulo, Titulo } from '../ui/Revelar'

/* Partículas de poeira na luz (posições fixas). */
const POEIRA = Array.from({ length: 16 }, (_, i) => ({
  x: 30 + ((i * 37) % 40), y: 8 + ((i * 53) % 70), d: 7 + ((i * 13) % 7), t: -((i * 17) % 9), s: 1.5 + (i % 3) * .8,
}))

function Item({ p, i, titulo, texto }: { p: MotionValue<number>; i: number; titulo: string; texto: string }) {
  const ini = .36 + i * .14
  const op = useTransform(p, [ini, ini + .1], [0, 1])
  const y = useTransform(p, [ini, ini + .1], [26, 0])
  const fio = useTransform(p, [ini, ini + .12], [0, 1])
  return <m.li className="cadeira-item" style={{ opacity: op, y }}>
    <m.span className="cadeira-item-fio" aria-hidden="true" style={{ scaleX: fio }} />
    <span className="cadeira-item-n num">0{i + 1}</span>
    <h3 className="cadeira-item-titulo">{titulo}</h3>
    <p className="cadeira-item-texto">{texto}</p>
  </m.li>
}

/**
 * A casa: cena presa na tela enquanto você rola (como página de produto).
 * A cadeira sobe para a luz, um brilho cromado atravessa o metal e os três motivos
 * aparecem um a um ao lado.
 */
export default function Cadeira() {
  const { reduced } = useMotionPreferences()
  const cena = useRef<HTMLDivElement>(null)
  const ativo = useSceneActivity(cena)
  const { scrollYProgress } = useScroll({ target: cena, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: .5 })
  const escala = useTransform(p, [0, .4], [.8, 1])
  const y = useTransform(p, [0, .4, 1], ['10%', '0%', '-3%'])
  const foco = useTransform(p, [.04, .3], [0, 1])
  const brilho = useTransform(p, [.28, .72], [100, 0])
  const brilhoPos = useTransform(brilho, v => `${v}% 0`)
  const xFundo = useTransform(p, [0, 1], ['6%', '-48%'])
  const xFundo2 = useTransform(p, [0, 1], ['-40%', '4%'])

  if (reduced) {
    return <section id="casa" className="cadeira is-estatica tema-noite" aria-labelledby="cadeira-titulo">
      <div ref={cena} className="conteiner cadeira-grade">
        <div className="cadeira-cabeca">
          <Rotulo>{CADEIRA.rotulo}</Rotulo>
          <Titulo id="cadeira-titulo" className="display cadeira-titulo" linhas={CADEIRA.titulo} italico={[2]} />
        </div>
        <div className="cadeira-centro"><div className="cadeira-obj"><Foto img={ITENS.cadeira} alt="Cadeira de barbeiro de couro preto com base cromada" sizes="(max-width: 767px) 70vw, 420px" /></div></div>
        <ol className="cadeira-itens">
          {CADEIRA.itens.map((it, i) => <li key={it.titulo} className="cadeira-item">
            <span className="cadeira-item-n num">0{i + 1}</span><h3 className="cadeira-item-titulo">{it.titulo}</h3><p className="cadeira-item-texto">{it.texto}</p>
          </li>)}
        </ol>
      </div>
    </section>
  }

  return <section id="casa" className="cadeira" aria-labelledby="cadeira-titulo">
    <div ref={cena} className="cadeira-cena">
      <div className="cadeira-palco tema-noite">
        <div className="cadeira-fundo" aria-hidden="true">
          <m.p style={{ x: xFundo }}>Senta · Senta · Senta · Senta ·</m.p>
          <m.p style={{ x: xFundo2 }} className="is-cheio">na cadeira · na cadeira · na cadeira ·</m.p>
        </div>
        <div className="conteiner cadeira-grade">
          <div className="cadeira-cabeca">
            <Rotulo>{CADEIRA.rotulo}</Rotulo>
            <Titulo id="cadeira-titulo" className="display cadeira-titulo" linhas={CADEIRA.titulo} italico={[2]} />
          </div>

          <div className="cadeira-centro">
            <m.div className="cadeira-foco" aria-hidden="true" style={{ opacity: foco }} />
            <div className={`cadeira-poeira ${ativo ? 'anima-continua is-ativa' : ''}`} aria-hidden="true">
              {POEIRA.map((d, i) => <span key={i} style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, animationDuration: `${d.d}s`, animationDelay: `${d.t}s` } as CSSProperties} />)}
            </div>
            <m.div className="cadeira-obj" style={{ scale: escala, y }}>
              <Foto img={ITENS.cadeira} alt="Cadeira de barbeiro de couro preto com base cromada" sizes="(max-width: 767px) 70vw, 420px" />
              <m.span className="cadeira-brilho" aria-hidden="true" style={{ backgroundPosition: brilhoPos }} />
              <Foto img={ITENS.cadeira} className="cadeira-reflexo" sizes="(max-width: 767px) 70vw, 420px" />
            </m.div>
          </div>

          <ol className="cadeira-itens">
            {CADEIRA.itens.map((it, i) => <Item key={it.titulo} p={p} i={i} titulo={it.titulo} texto={it.texto} />)}
          </ol>
        </div>
      </div>
    </div>
  </section>
}
