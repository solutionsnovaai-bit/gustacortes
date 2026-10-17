import { useEffect, useRef, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { AGENDA } from '../../lib/whatsapp'
import { useInercia } from '../../hooks/useInercia'

/*
  Pílula "Agendar" que flutua no canto esquerdo depois que o botão do topo sai da tela.
  Some quando o topo, a vitrine, a agenda ou o rodapé estão na tela (lá já tem botão grande). Mesma inércia do balão.
*/
export default function AgendarFlutuante({ liberado }: { liberado: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [mostra, setMostra] = useState(false)
  useInercia(ref, liberado && mostra, { giroMax: 6, forca: .4 })

  useEffect(() => {
    if (!liberado) return
    const visiveis = new Set<string>()
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        /* O fim da página conta como "na tela" a partir do momento em que passa da borda de baixo. */
        const naTela = e.target.id === 'contato' ? e.boundingClientRect.top < window.innerHeight : e.isIntersecting
        if (naTela) visiveis.add(e.target.id); else visiveis.delete(e.target.id)
      })
      setMostra(visiveis.size === 0)
    }, { threshold: .12 })
    ;['topo', 'vitrine', 'agenda', 'contato'].forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [liberado])

  return <div className={`flutuante ${liberado && mostra ? 'is-visivel' : ''}`}>
    <a ref={ref} className="flutuante-botao" href={AGENDA} target="_blank" rel="noopener noreferrer" aria-label="Agendar horário (abre a agenda em nova aba)" tabIndex={mostra ? 0 : -1}>
      <CalendarDays aria-hidden="true" strokeWidth={1.8} />
      <span>Agendar</span>
    </a>
  </div>
}
