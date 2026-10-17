import { useRef } from 'react'
import type { MotionValue } from 'motion/react'
import { m, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { TABELA } from '../../content/textos'
import { GRUPOS, reais } from '../../content/servicos'
import type { Grupo } from '../../content/servicos'
import { MENSAGENS } from '../../config/site'
import { ITENS } from '../../config/imagens'
import type { Imagem } from '../../config/imagens'
import { AGENDA, waLink } from '../../lib/whatsapp'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import BrandIcon from '../ui/BrandIcon'
import Foto from '../ui/Foto'
import Neon from '../ui/Neon'
import Placar from '../ui/Placar'
import Revelar, { Rotulo } from '../ui/Revelar'

/** O "&" dos combos em itálico, como nos cardápios de alfaiataria. */
const comE = (nome: string) => nome.split(' & ').flatMap((p, i) => i ? [<span key={i} className="amp"> &amp; </span>, p] : [p])

function Lista({ grupo, indice }: { grupo: Grupo; indice: number }) {
  return <div className={`tabela-grupo tabela-${grupo.cor}`}>
    <Revelar className="tabela-grupo-cabeca" y={18}>
      <h3 className="tabela-grupo-titulo"><Neon texto={grupo.titulo} cor={grupo.cor} atraso={indice * .25} /></h3>
      <p className="tabela-grupo-sub">{grupo.subtitulo}</p>
    </Revelar>
    <ul className="tabela-lista">
      {grupo.itens.map((s, i) => <Revelar as="li" key={s.nome} delay={i * .06} y={20}>
        <a className="tabela-linha" href={AGENDA} target="_blank" rel="noopener noreferrer" data-cursor="Agendar"
          aria-label={`${s.nome}, R$ ${reais(s.preco)}. ${TABELA.agendar} (abre a agenda em nova aba)`}
          onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`) }}>
          <span className="tabela-nome">{comE(s.nome)}</span>
          <span className="tabela-pontos" aria-hidden="true" />
          <span className="tabela-preco" aria-hidden="true"><span className="tabela-rs">R$</span><Placar valor={s.preco} className="num" /><span className="tabela-cent num">,00</span></span>
          <span className="tabela-detalhe" aria-hidden="true">{s.detalhe}</span>
          <span className="tabela-agendar" aria-hidden="true">{TABELA.agendar}<ArrowUpRight strokeWidth={1.6} /></span>
        </a>
      </Revelar>)}
    </ul>
  </div>
}

function Ferramenta({ img, s, className, de, ate, giro, sizes }: {
  img: Imagem; s: MotionValue<number>; className: string; de: string; ate: string; giro: [number, number]; sizes: string
}) {
  const y = useTransform(s, [0, 1], [de, ate])
  const rotate = useTransform(s, [0, 1], giro)
  return <m.div className={`ferramenta ${className}`} style={{ y, rotate }} aria-hidden="true"><Foto img={img} sizes={sizes} /></m.div>
}

/**
 * A tabela: o título é revelado por uma navalha que corre com a rolagem (onde ela passa, a letra fica limpa).
 * Cada serviço é um link direto para a agenda. Tesoura, pente e máquina flutuam nas margens.
 */
export default function Tabela() {
  const { reduced } = useMotionPreferences()
  const secao = useRef<HTMLElement>(null)
  const cabeca = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: cabeca, offset: ['start 88%', 'start 32%'] })
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: .4 })
  const corte = useTransform(p, v => `inset(-12% ${(100 - Math.min(1, Math.max(0, v)) * 100).toFixed(2)}% -30% 0)`)
  const xNavalha = useTransform(p, v => `${(Math.min(1, Math.max(0, v)) * 100).toFixed(2)}%`)
  const opNavalha = useTransform(p, [0, .04, .9, 1], [0, 1, 1, 0])
  const giro = useTransform(p, [0, .5, 1], [-14, -4, 8])
  const { scrollYProgress: s } = useScroll({ target: secao, offset: ['start end', 'end start'] })

  return <section ref={secao} id="tabela" className="secao tabela tema-noite" aria-labelledby="tabela-titulo">
    {!reduced && <>
      <Ferramenta img={ITENS.tesoura} s={s} className="ferramenta-tesoura" de="20%" ate="-60%" giro={[-30, 24]} sizes="(max-width: 767px) 44vw, 380px" />
      <Ferramenta img={ITENS.pente} s={s} className="ferramenta-pente" de="40%" ate="-30%" giro={[18, -16]} sizes="(max-width: 767px) 40vw, 340px" />
      <Ferramenta img={ITENS.maquina} s={s} className="ferramenta-maquina" de="60%" ate="-50%" giro={[-12, 14]} sizes="(max-width: 767px) 30vw, 240px" />
    </>}

    <div className="conteiner">
      <div ref={cabeca} className="tabela-cabeca">
        <Rotulo>{TABELA.rotulo}</Rotulo>
        <h2 id="tabela-titulo" className="tabela-titulo" aria-label={TABELA.titulo}>
          <span className="tabela-titulo-fantasma" aria-hidden="true">{TABELA.titulo}</span>
          <m.span className="tabela-titulo-limpo" aria-hidden="true" style={reduced ? undefined : { clipPath: corte }}>{TABELA.titulo}</m.span>
          {!reduced && <>
            <m.span className="tabela-fio" aria-hidden="true" style={{ left: xNavalha, opacity: opNavalha }} />
            <m.span className="tabela-navalha" aria-hidden="true" style={{ left: xNavalha, opacity: opNavalha, rotate: giro, x: '-34%', y: '-62%' }}>
              <Foto img={ITENS.navalha} sizes="220px" />
            </m.span>
          </>}
        </h2>
        <Revelar as="p" className="lead tabela-lead" delay={.1}>{TABELA.texto}</Revelar>
      </div>

      <div className="tabela-grupos">
        {GRUPOS.map((g, i) => <Lista key={g.id} grupo={g} indice={i} />)}
      </div>

      <Revelar className="tabela-rodape" y={14}>
        <p className="tabela-nota">{TABELA.nota}</p>
        <a className="link-linha tabela-duvida" href={waLink(MENSAGENS.quimica)} target="_blank" rel="noopener noreferrer">
          <BrandIcon brand="whatsapp" />{TABELA.duvida}
        </a>
      </Revelar>
    </div>
  </section>
}
