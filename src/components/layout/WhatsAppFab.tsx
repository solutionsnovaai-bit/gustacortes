import { useEffect, useRef, useState } from 'react'
import { MENSAGENS, SITE } from '../../config/site'
import { waLink } from '../../lib/whatsapp'
import { useInercia } from '../../hooks/useInercia'
import BrandIcon from '../ui/BrandIcon'

/*
  Balão do WhatsApp, igual ao ícone oficial (verde do WhatsApp, glifo branco), no celular e no computador.
  Nunca some. A rolagem puxa o balão por uma mola amortecida; ao parar, ele volta com um leve quique.
*/
export default function WhatsAppFab({ liberado }: { liberado: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [dica, setDica] = useState(false)
  useInercia(ref, liberado)

  /* A dica aparece uma vez, alguns segundos depois de o site abrir. */
  useEffect(() => {
    if (!liberado) return
    const t1 = window.setTimeout(() => setDica(true), 5000)
    const t2 = window.setTimeout(() => setDica(false), 10500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [liberado])

  return <div className={`fab ${liberado ? 'is-visivel' : ''}`}>
    <span className={`fab-dica ${dica ? 'is-visivel' : ''}`} aria-hidden="true">Fala com o Gusta</span>
    <a ref={ref} className="fab-botao" href={waLink(MENSAGENS.padrao)} target="_blank" rel="noopener noreferrer"
      aria-label={`Chamar a ${SITE.nome} no WhatsApp (abre em nova aba)`}
      onMouseEnter={() => setDica(true)} onMouseLeave={() => setDica(false)} onFocus={() => setDica(true)} onBlur={() => setDica(false)}>
      <span className="fab-pulso anima-continua" aria-hidden="true" />
      <BrandIcon brand="whatsapp" />
    </a>
  </div>
}
