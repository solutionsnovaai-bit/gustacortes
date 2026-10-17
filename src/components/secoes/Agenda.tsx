import { useRef } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import { AGENDA_TXT } from '../../content/textos'
import { QR_AGENDA } from '../../content/qr'
import { MENSAGENS, SITE } from '../../config/site'
import { AGENDA, waLink } from '../../lib/whatsapp'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { Botao } from '../ui/Botao'
import BrandIcon from '../ui/BrandIcon'
import Neon from '../ui/Neon'
import Poste from '../ui/Poste'
import Revelar, { Rotulo, Titulo } from '../ui/Revelar'

/**
 * Agenda aberta: a placa de neon acende entre dois postes girando, os três passos e o botão.
 * No computador, um QR code leva a agenda para o celular.
 */
export default function Agenda() {
  const { reduced } = useMotionPreferences()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yPostes = useTransform(scrollYProgress, [0, 1], ['14%', '-14%'])
  const brilho = useTransform(scrollYProgress, [.15, .45], [0, 1])

  return <section ref={ref} id="agenda" className="secao agenda tema-noite" aria-labelledby="agenda-titulo">
    <m.div className="agenda-halo" aria-hidden="true" style={reduced ? undefined : { opacity: brilho }} />
    <div className="conteiner">
      <div className="agenda-placa">
        <m.div className="agenda-poste agenda-poste-e" style={reduced ? undefined : { y: yPostes }}><Poste sizes="(max-width: 767px) 54px, 110px" /></m.div>
        <p className="agenda-neon" aria-label={AGENDA_TXT.neon.join(' ')}>
          <Neon texto={AGENDA_TXT.neon[0]} cor="ciano" />
          <Neon texto={AGENDA_TXT.neon[1]} cor="violeta" atraso={.45} />
        </p>
        <m.div className="agenda-poste agenda-poste-d" style={reduced ? undefined : { y: yPostes }}><Poste sizes="(max-width: 767px) 54px, 110px" /></m.div>
      </div>

      <div className="agenda-grade">
        <div className="agenda-cabeca">
          <Rotulo>{AGENDA_TXT.rotulo}</Rotulo>
          <Titulo id="agenda-titulo" className="display agenda-titulo" linhas={AGENDA_TXT.titulo} italico={[1]} />
          <Revelar className="agenda-acoes" delay={.12}>
            <Botao href={AGENDA} variante="neon" rotuloAcessivel={`${AGENDA_TXT.cta} (abre a agenda em nova aba)`}>{AGENDA_TXT.cta}</Botao>
            <a className="link-linha" href={waLink(MENSAGENS.horario)} target="_blank" rel="noopener noreferrer">
              <BrandIcon brand="whatsapp" />{AGENDA_TXT.whatsapp}
            </a>
          </Revelar>
        </div>

        <ol className="agenda-passos">
          {AGENDA_TXT.passos.map((s, i) => <Revelar as="li" key={s.n} className="agenda-passo" delay={i * .1}>
            <span className="agenda-passo-n num">{s.n}</span>
            <div>
              <h3 className="agenda-passo-titulo">{s.titulo}</h3>
              <p className="agenda-passo-texto">{s.texto}</p>
            </div>
          </Revelar>)}
        </ol>

        <Revelar className="agenda-qr" delay={.2}>
          <svg viewBox={QR_AGENDA.viewBox} className="agenda-qr-codigo" role="img" aria-label={`QR code da agenda: ${SITE.agendaExibicao}`} shapeRendering="crispEdges">
            <path d={QR_AGENDA.d} stroke="currentColor" fill="none" />
          </svg>
          <div>
            <p className="agenda-qr-titulo">{AGENDA_TXT.qrTitulo}</p>
            <p className="agenda-qr-texto">{AGENDA_TXT.qrTexto}</p>
            <a className="agenda-qr-link" href={AGENDA} target="_blank" rel="noopener noreferrer">{SITE.agendaExibicao}</a>
          </div>
        </Revelar>
      </div>
    </div>
  </section>
}
