import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { CalendarDays } from 'lucide-react'
import { NAV } from '../../content/textos'
import { INSTAGRAM_URL, MENSAGENS, SITE } from '../../config/site'
import { ITENS } from '../../config/imagens'
import { AGENDA, waLink } from '../../lib/whatsapp'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { rolagem } from '../../hooks/useSmoothScroll'
import BrandIcon from '../ui/BrandIcon'
import { Botao } from '../ui/Botao'
import Foto from '../ui/Foto'
import { CORTINA, EASE } from '../ui/Revelar'

/** Marca do cabeçalho: o bigode de neon e o nome em serifa espaçada. */
export function Marca() {
  return <>
    <Foto img={ITENS.bigode} className="marca-bigode" sizes="44px" />
    <span className="marca-nome">GUSTA <span>CORTE$</span></span>
  </>
}

/**
 * Cabeçalho: transparente sobre o topo, vidro escuro ao rolar; some ao descer e volta ao subir.
 * No celular, abre um menu em tela cheia.
 */
export default function Topo({ visivel }: { visivel: boolean }) {
  const { reduced } = useMotionPreferences()
  const [solido, setSolido] = useState(false)
  const [escondido, setEscondido] = useState(false)
  const [aberto, setAberto] = useState(false)
  const [ativo, setAtivo] = useState('')
  const botaoMenu = useRef<HTMLButtonElement>(null)
  const primeiroLink = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    let ultimo = window.scrollY, raf = 0
    const ler = () => {
      raf = 0
      const y = window.scrollY
      setSolido(y > 24)
      if (Math.abs(y - ultimo) > 6) { setEscondido(y > ultimo && y > window.innerHeight * .7); ultimo = y }
    }
    const aoRolar = () => { if (!raf) raf = requestAnimationFrame(ler) }
    window.addEventListener('scroll', aoRolar, { passive: true })
    ler()
    return () => { window.removeEventListener('scroll', aoRolar); cancelAnimationFrame(raf) }
  }, [])

  /* Link ativo conforme a seção na tela. */
  useEffect(() => {
    const secoes = NAV.map(n => document.querySelector<HTMLElement>(n.href)).filter((s): s is HTMLElement => !!s)
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) setAtivo(`#${e.target.id}`) })
    }, { rootMargin: '-45% 0px -50% 0px' })
    secoes.forEach(s => io.observe(s))
    return () => io.disconnect()
  }, [])

  /* Menu aberto: trava a rolagem, Esc fecha, foco no primeiro link. */
  useEffect(() => {
    if (!aberto) return
    document.documentElement.classList.add('travado', 'menu-aberto')
    rolagem.lenis?.stop()
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setAberto(false); botaoMenu.current?.focus() } }
    window.addEventListener('keydown', esc)
    const t = window.setTimeout(() => primeiroLink.current?.focus(), 350)
    return () => {
      document.documentElement.classList.remove('travado', 'menu-aberto'); rolagem.lenis?.start()
      window.removeEventListener('keydown', esc); clearTimeout(t)
    }
  }, [aberto])

  const fechar = () => setAberto(false)

  return <>
    <header className={`topo ${solido ? 'is-solido' : ''} ${escondido && !aberto ? 'is-escondido' : ''} ${aberto ? 'menu-aberto' : ''}`}>
      <m.div className="conteiner topo-dentro"
        initial={reduced ? false : { y: -24, opacity: 0 }}
        animate={visivel || reduced ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 1, delay: .2, ease: EASE }}>
        <a href="#topo" className="topo-marca" aria-label={`${SITE.nome}, voltar ao início`} onClick={fechar}><Marca /></a>
        <nav className="topo-nav" aria-label="Seções">
          {NAV.map(n => <a key={n.href} href={n.href} className={`topo-link ${ativo === n.href ? 'is-ativo' : ''}`}>{n.rotulo}</a>)}
        </nav>
        <a className="topo-cta" href={AGENDA} target="_blank" rel="noopener noreferrer" aria-label="Agendar horário (abre a agenda em nova aba)">
          <CalendarDays aria-hidden="true" strokeWidth={1.8} />Agendar
        </a>
        <button ref={botaoMenu} className="topo-menu-botao" type="button" aria-expanded={aberto} aria-controls="menu" aria-label={aberto ? 'Fechar menu' : 'Abrir menu'} onClick={() => setAberto(v => !v)}>
          <span /><span />
        </button>
      </m.div>
    </header>

    <AnimatePresence>
      {aberto && <m.div id="menu" className="menu" role="dialog" aria-modal="true" aria-label="Menu"
        initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
        animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
        exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
        transition={{ duration: .75, ease: CORTINA }}>
        <nav className="menu-lista" aria-label="Seções">
          {NAV.map((n, i) => <m.a key={n.href} ref={i === 0 ? primeiroLink : undefined} href={n.href} className="menu-link" onClick={fechar}
            initial={reduced ? false : { y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0, transition: { duration: .2 } }}
            transition={{ duration: .85, delay: .22 + i * .07, ease: EASE }}>
            <span className="menu-link-n num">0{i + 1}</span>{n.rotulo}
          </m.a>)}
        </nav>
        <m.div className="menu-rodape" initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .8, delay: .5, ease: EASE }}>
          <Botao href={AGENDA} variante="marfim" rotuloAcessivel="Agendar horário (abre a agenda em nova aba)">Agendar horário</Botao>
          <p className="menu-info">
            <a href={waLink(MENSAGENS.padrao)} target="_blank" rel="noopener noreferrer"><BrandIcon brand="whatsapp" />{SITE.whatsappExibicao}</a>
            {INSTAGRAM_URL && <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><BrandIcon brand="instagram" />@{SITE.instagram}</a>}
          </p>
        </m.div>
      </m.div>}
    </AnimatePresence>
  </>
}
