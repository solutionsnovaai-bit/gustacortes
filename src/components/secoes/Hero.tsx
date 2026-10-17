import { useEffect, useRef } from 'react'
import type { CSSProperties, Ref } from 'react'
import { animate, m, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { HERO } from '../../content/textos'
import { MENOR_PRECO_CORTE } from '../../content/servicos'
import { INSTAGRAM_URL, SITE } from '../../config/site'
import { HERO_DESKTOP, HERO_MOBILE } from '../../config/imagens'
import type { ArteHero, Tubo } from '../../config/imagens'
import { AGENDA } from '../../lib/whatsapp'
import { avisaHeroCarregado, modoAbertura } from '../../lib/carregamento'
import { useMedia } from '../../hooks/useMedia'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { useSceneActivity } from '../../hooks/useSceneActivity'
import { Botao } from '../ui/Botao'
import BrandIcon from '../ui/BrandIcon'
import { EASE, Titulo } from '../ui/Revelar'

export type Fase = 'carregando' | 'acendendo' | 'pronto'

/** Desktop a partir de telas mais largas que altas (e com espaço para o texto ao lado do letreiro). */
export const MQ_DESKTOP = '(min-aspect-ratio: 23/20) and (min-width: 700px)'

/** Máscara suave em volta de uma peça do letreiro (elipse, em % da arte). */
function mascara(arte: ArteHero, t: Tubo, folga = 1.8) {
  const rx = (t.r[0] * folga / arte.largura) * 100
  const ry = (t.r[1] * folga / arte.altura) * 100
  const cx = (t.c[0] / arte.largura) * 100
  const cy = (t.c[1] / arte.altura) * 100
  return `radial-gradient(ellipse ${rx.toFixed(2)}% ${ry.toFixed(2)}% at ${cx.toFixed(2)}% ${cy.toFixed(2)}%, #000 56%, transparent 100%)`
}
const comMascara = (g: string): CSSProperties => ({ WebkitMaskImage: g, maskImage: g })

/* Ordem em que o letreiro acende: postes, bigode, GUSTA, til, CORTE$, bigode, engrenagem e cifrão. [id, início em s, jeito de piscar] */
const ORDEM: readonly [string, number, number][] = [
  ['poste-e', .25, 0], ['poste-d', .38, 1],
  ['bigode-cima', .78, 2], ['gusta', 1.02, 0], ['til', 1.5, 1], ['cortes', 1.66, 2],
  ['bigode-baixo', 2.14, 1], ['engrenagem', 2.3, 0], ['cifrao', 2.46, 2],
]
const PISCADAS = [
  { opacity: [0, 1, .15, .95, .35, 1], times: [0, .1, .22, .4, .55, 1], duracao: .55 },
  { opacity: [0, .8, 0, 1, .5, 1], times: [0, .12, .25, .45, .6, 1], duracao: .6 },
  { opacity: [0, 1, .1, .1, 1, .3, 1], times: [0, .08, .16, .4, .5, .62, 1], duracao: .78 },
]
/** Peças que, de vez em quando, dão aquela falhada de neon velho. */
const FALHAM = ['cifrao', 'engrenagem', 'til', 'bigode-baixo', 'cifrao']

function Camada({ arte, className, style, imgRef, onCarregou, prioridade = false }: {
  arte: ArteHero; className: string; style?: CSSProperties; imgRef?: Ref<HTMLImageElement>; onCarregou?: () => void; prioridade?: boolean
}) {
  return <picture>
    <source type="image/avif" srcSet={arte.avif} />
    <img ref={imgRef} className={`camada ${className}`} src={arte.webp} width={arte.largura} height={arte.altura} alt="" style={style}
      decoding="async" fetchPriority={prioridade ? 'high' : 'auto'} draggable={false} onLoad={onCarregou} onError={onCarregou} />
  </picture>
}

/**
 * Topo: a parede de mármore com o letreiro de neon. Depois do carregamento, o neon acende
 * peça por peça, piscando como tubo de verdade; aí o texto entra.
 * Desktop: letreiro ancorado à direita. Celular: letreiro no alto, texto embaixo. O letreiro nunca é cortado.
 */
export default function Hero({ fase, onAceso }: { fase: Fase; onAceso: () => void }) {
  const { reduced } = useMotionPreferences()
  const desktop = useMedia(MQ_DESKTOP, true)
  const arte = desktop ? HERO_DESKTOP : HERO_MOBILE
  const ref = useRef<HTMLElement>(null)
  const base = useRef<HTMLImageElement>(null)
  const aceso = useRef<HTMLImageElement>(null)
  const falha = useRef<HTMLImageElement>(null)
  const tubos = useRef(new Map<string, HTMLImageElement>())
  const ativo = useSceneActivity(ref)
  const pronto = fase === 'pronto'
  const entrou = pronto || reduced

  /* Se a arte já estava no cache, avisa a abertura na hora. */
  useEffect(() => { if (base.current?.complete) avisaHeroCarregado() }, [])

  /* A ignição. */
  /* As animações da ignição seguem até o fim mesmo quando o texto já entrou (fase "pronto"); só param se o topo sair da página. */
  const ignicao = useRef<{ anim: { stop: () => void }[]; t: number }>({ anim: [], t: 0 })
  useEffect(() => () => { ignicao.current.anim.forEach(a => a.stop()); clearTimeout(ignicao.current.t) }, [])
  useEffect(() => {
    if (fase !== 'acendendo') return
    const luz = aceso.current
    if (!luz) { onAceso(); return }
    const { anim } = ignicao.current
    if (modoAbertura() === 'completa' && !reduced) {
      ORDEM.forEach(([id, inicio, jeito]) => {
        const el = tubos.current.get(id)
        const p = PISCADAS[jeito]
        if (el) anim.push(animate(el, { opacity: p.opacity }, { duration: p.duracao, times: p.times, delay: inicio, ease: 'linear' }))
      })
      const final = animate(luz, { opacity: [0, 1] }, { duration: 1.05, delay: 2.85, ease: [0.4, 0, 0.2, 1] })
      anim.push(final)
      /* Com o letreiro inteiro aceso por cima, as camadas de cada peça saem de cena (menos trabalho para a placa de vídeo). */
      final.finished.then(() => tubos.current.forEach(el => { el.style.visibility = 'hidden' })).catch(() => {})
      ignicao.current.t = window.setTimeout(onAceso, 2950)
    } else {
      anim.push(animate(luz, { opacity: [0, .9, .3, 1] }, { duration: .8, times: [0, .35, .55, 1], delay: .1, ease: 'linear' }))
      ignicao.current.t = window.setTimeout(onAceso, 380)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase])

  /* Vida: de vez em quando uma peça falha, como neon de verdade. Só com o topo na tela. */
  useEffect(() => {
    if (!pronto || reduced || !ativo) return
    let t = 0
    const proxima = () => {
      t = window.setTimeout(() => {
        const el = falha.current
        const tubo = arte.tubos.find(x => x.id === FALHAM[Math.floor(Math.random() * FALHAM.length)])
        if (el && tubo) {
          const g = mascara(arte, tubo, 1.5)
          el.style.setProperty('-webkit-mask-image', g)
          el.style.setProperty('mask-image', g)
          animate(el, { opacity: [0, .92, .08, .75, .2, 0] }, { duration: .62, times: [0, .12, .3, .5, .7, 1], ease: 'linear' })
        }
        proxima()
      }, 4200 + Math.random() * 6500)
    }
    proxima()
    return () => clearTimeout(t)
  }, [pronto, reduced, ativo, arte])

  /* Rolagem: a parede se aproxima e escurece, o texto sobe. */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const escala = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const yPalco = useTransform(scrollYProgress, [0, 1], ['0%', '9%'])
  const yTexto = useTransform(scrollYProgress, [0, 1], ['0%', '-16%'])
  const opTexto = useTransform(scrollYProgress, [0, .75], [1, 0])
  const veu = useTransform(scrollYProgress, [0, 1], [0, .7])

  /* Mouse: a parede acompanha de leve e uma luz passeia pelo mármore. */
  const mx = useMotionValue(0), my = useMotionValue(0)
  const px = useSpring(useTransform(mx, [-1, 1], [12, -12]), { stiffness: 60, damping: 18 })
  const py = useSpring(useTransform(my, [-1, 1], [8, -8]), { stiffness: 60, damping: 18 })
  useEffect(() => {
    const el = ref.current
    if (reduced || !pronto || !el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let raf = 0, ex = 0, ey = 0
    const mover = (e: PointerEvent) => {
      ex = e.clientX; ey = e.clientY
      mx.set((ex / window.innerWidth) * 2 - 1); my.set((ey / window.innerHeight) * 2 - 1)
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0
        const r = el.getBoundingClientRect()
        el.style.setProperty('--lx', `${ex - r.left}px`)
        el.style.setProperty('--ly', `${ey - r.top}px`)
        el.classList.add('com-luz')
      })
    }
    const sair = () => el.classList.remove('com-luz')
    window.addEventListener('pointermove', mover, { passive: true })
    document.documentElement.addEventListener('pointerleave', sair)
    return () => {
      window.removeEventListener('pointermove', mover); document.documentElement.removeEventListener('pointerleave', sair)
      cancelAnimationFrame(raf); mx.set(0); my.set(0)
    }
  }, [reduced, pronto, mx, my])

  const surge = (atraso: number) => ({
    initial: reduced ? false : { opacity: 0, y: 22, filter: 'blur(8px)' },
    animate: entrou ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined,
    transition: { duration: 1.1, delay: atraso, ease: EASE },
  })

  const registra = (id: string) => (el: HTMLImageElement | null) => { if (el) tubos.current.set(id, el); else tubos.current.delete(id) }

  return <section ref={ref} id="topo" className={`hero ${desktop ? 'modo-d' : 'modo-m'} ${pronto ? 'is-aceso' : ''}`} aria-labelledby="hero-titulo">
    <div className="hero-fundo" aria-hidden="true" />
    <div className="palco-pos" aria-hidden="true">
      <m.div className="palco-rolagem" style={reduced ? undefined : { scale: escala, y: yPalco }}>
        <m.div className="palco" style={reduced ? undefined : { x: px, y: py }}>
          <Camada arte={arte} className="palco-apagado" imgRef={base} onCarregou={avisaHeroCarregado} prioridade />
          {arte.tubos.map(t => <Camada key={t.id} arte={arte} className="palco-tubo" imgRef={registra(t.id)} style={comMascara(mascara(arte, t))} />)}
          <Camada arte={arte} className="palco-aceso" imgRef={aceso} />
          <Camada arte={arte} className="palco-falha" imgRef={falha} />
        </m.div>
      </m.div>
    </div>
    <div className="hero-luz" aria-hidden="true" />
    <div className="hero-sombra" aria-hidden="true" />
    <m.div className="hero-veu" aria-hidden="true" style={reduced ? undefined : { opacity: veu }} />

    <m.div className="hero-conteudo" style={reduced ? undefined : { y: yTexto, opacity: opTexto }}>
      <div className="hero-texto">
        <m.p className="rotulo hero-rotulo" {...surge(.05)}>{HERO.rotulo}</m.p>
        <Titulo as="h1" id="hero-titulo" className="display hero-titulo" linhas={HERO.titulo} italico={[1]} ativo={entrou} atraso={.12}
          rotulo={`${SITE.nome}: ${HERO.titulo.join(' ')}`} />
        <m.p className="lead hero-lead" {...surge(.42)}>{HERO.texto}</m.p>
        <m.div className="hero-acoes" {...surge(.56)}>
          <Botao href={AGENDA} variante="marfim" rotuloAcessivel={`${HERO.cta} (abre a agenda em nova aba)`}>{HERO.cta}</Botao>
          <a className="link-linha" href="#tabela">{HERO.link}<ArrowDown aria-hidden="true" strokeWidth={1.6} /></a>
        </m.div>
        <m.ul className="hero-base" {...surge(.7)}>
          <li><span className="hero-base-rotulo">{HERO.meta}</span> <span className="num">R$ {MENOR_PRECO_CORTE}</span></li>
          {INSTAGRAM_URL && <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hero-insta"><BrandIcon brand="instagram" />@{SITE.instagram}</a></li>}
        </m.ul>
      </div>
    </m.div>

    <m.a href="#manifesto" className="hero-rolar" aria-label="Rolar para o conteúdo" {...surge(.9)}>
      <span className="hero-rolar-fio" aria-hidden="true"><span className="anima-continua" /></span>
      <span>{HERO.rolar}</span>
    </m.a>
  </section>
}
