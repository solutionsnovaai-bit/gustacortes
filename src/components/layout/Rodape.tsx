import { useEffect, useRef, useState } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import { CalendarDays, MapPin, Pause, Play } from 'lucide-react'
import { NAV, RODAPE } from '../../content/textos'
import { ENDERECO_COMPLETO, INSTAGRAM_URL, MENSAGENS, SITE, TEM_ENDERECO } from '../../config/site'
import { LETREIRO } from '../../config/imagens'
import { AGENDA, waLink } from '../../lib/whatsapp'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import BrandIcon from '../ui/BrandIcon'
import Foto from '../ui/Foto'
import { Titulo } from '../ui/Revelar'

/** Rodapé: o letreiro aceso na parede, a frase da casa e os contatos. */
export default function Rodape() {
  const { reduced, paused, toggle } = useMotionPreferences()
  const ref = useRef<HTMLElement>(null)
  /* O rodapé pode ficar preso embaixo (revelado pela página), então a conta é pela rolagem da página toda:
     a fração final que corresponde à altura dele. */
  const { scrollYProgress } = useScroll()
  const [fatia, setFatia] = useState(.08)
  useEffect(() => {
    const medir = () => { const el = ref.current; if (el) setFatia(Math.min(.5, el.offsetHeight / Math.max(1, document.documentElement.scrollHeight - window.innerHeight))) }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [])
  const escala = useTransform(scrollYProgress, [1 - fatia, 1], [.86, 1])
  const op = useTransform(scrollYProgress, [1 - fatia, 1 - fatia * .45], [.2, 1])

  return <footer ref={ref} id="rodape" className="rodape tema-noite">
    <div className="conteiner rodape-topo">
      <m.div className="rodape-letreiro" style={reduced ? undefined : { scale: escala, opacity: op }}>
        <Foto img={LETREIRO} alt={`Letreiro de neon da ${SITE.nome}`} sizes="(max-width: 767px) 92vw, 640px" />
      </m.div>
      <Titulo as="p" className="display rodape-frase" linhas={RODAPE.frase} italico={[1]} />
    </div>

    <div className="conteiner rodape-grade">
      <div className="rodape-col">
        <p className="rotulo">{RODAPE.agendar}</p>
        <a href={AGENDA} target="_blank" rel="noopener noreferrer"><CalendarDays aria-hidden="true" strokeWidth={1.6} />{SITE.agendaExibicao}</a>
      </div>
      <div className="rodape-col">
        <p className="rotulo">Contato</p>
        <a href={waLink(MENSAGENS.padrao)} target="_blank" rel="noopener noreferrer"><BrandIcon brand="whatsapp" />{SITE.whatsappExibicao}</a>
        {INSTAGRAM_URL && <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><BrandIcon brand="instagram" />@{SITE.instagram}</a>}
        {TEM_ENDERECO && <address><MapPin aria-hidden="true" strokeWidth={1.6} />{ENDERECO_COMPLETO}</address>}
      </div>
      <nav className="rodape-col" aria-label="Seções do site">
        <p className="rotulo">No site</p>
        {NAV.map(n => <a key={n.href} href={n.href}>{n.rotulo}</a>)}
      </nav>
    </div>

    <div className="conteiner rodape-base">
      <p>© {new Date().getFullYear()} {SITE.nome}</p>
      {INSTAGRAM_URL && <a className="rodape-insta" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{RODAPE.instagram} <span>@{SITE.instagram}</span></a>}
      <button type="button" className="rodape-pausa" onClick={toggle} aria-pressed={paused}>
        {paused ? <Play aria-hidden="true" strokeWidth={1.8} /> : <Pause aria-hidden="true" strokeWidth={1.8} />}
        {paused ? 'Ligar movimento' : 'Pausar movimento'}
      </button>
    </div>
  </footer>
}
