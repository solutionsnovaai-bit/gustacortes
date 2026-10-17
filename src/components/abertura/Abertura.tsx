import { useEffect, useRef, useState } from 'react'
import { animate } from 'motion/react'
import { ABERTURA } from '../../content/textos'
import { SITE } from '../../config/site'
import { espera, heroCarregado, modoAbertura } from '../../lib/carregamento'
import Poste from '../ui/Poste'

type Props = {
  /** Tudo carregado: o letreiro pode começar a acender. */
  onCarregado: () => void
  /** A cortina já saiu: pode desmontar. */
  sair: boolean
}

/*
  Abertura (só a tela de carregamento; o espetáculo é o letreiro acendendo no topo).
  1ª visita: no escuro, o poste gira e o contador vai de 0 a 100 conforme o site carrega de verdade
  (fontes e arte do topo). Ao voltar: só um véu preto rápido.
  Depois, a cortina se abre e revela a parede com o neon ainda apagado.
*/
export default function Abertura({ onCarregado, sair }: Props) {
  const raiz = useRef<HTMLDivElement>(null)
  const numero = useRef<HTMLSpanElement>(null)
  const fio = useRef<HTMLSpanElement>(null)
  const [montada, setMontada] = useState(true)
  const completa = modoAbertura() === 'completa'

  useEffect(() => {
    let cancelado = false
    try { sessionStorage.setItem('gusta-abertura', '1') } catch { /* navegação privada */ }
    const tarefas = [document.fonts?.ready ?? Promise.resolve(), heroCarregado]
    let feitas = 0
    let atual = 0
    const contador = { v: 0 }
    const mostra = (alvo: number, dur: number) => animate(contador, { v: alvo }, {
      duration: dur, ease: [0.3, 0, 0.2, 1],
      onUpdate: () => {
        atual = contador.v
        if (numero.current) numero.current.textContent = String(Math.round(atual)).padStart(3, '0')
        if (fio.current) fio.current.style.transform = `scaleX(${(atual / 100).toFixed(3)})`
      },
    })
    if (completa) mostra(18, .9)
    const carregado = Promise.race([
      Promise.all(tarefas.map(t => Promise.resolve(t).then(() => { feitas++; if (completa) mostra(18 + (feitas / tarefas.length) * 70, .9) }))),
      espera(7),
    ])
    const roda = async () => {
      await Promise.all([carregado, espera(completa ? 1.2 : .15)])
      if (cancelado) return
      if (completa) await mostra(100, .55).finished
      if (cancelado) return
      onCarregado()
    }
    roda().catch(() => { if (!cancelado) onCarregado() })
    return () => { cancelado = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* A cortina sobe e some. */
  useEffect(() => {
    if (!sair || !raiz.current) return
    const el = raiz.current
    el.classList.remove('is-bloqueando')
    const conteudo = el.querySelector('.ab-centro')
    if (conteudo) animate(conteudo, { opacity: 0, y: -14, filter: 'blur(6px)' }, { duration: .45, ease: 'easeIn' })
    const a = animate(el, { opacity: 0 }, { duration: completa ? .9 : .5, delay: completa ? .25 : 0, ease: [0.4, 0, 0.2, 1] })
    a.finished.then(() => setMontada(false))
    return () => a.stop()
  }, [sair, completa])

  if (!montada) return null
  return <div ref={raiz} className={`abertura is-bloqueando ${completa ? '' : 'is-rapida'}`} aria-hidden="true">
    {completa && <div className="ab-centro">
      <Poste className="ab-poste" sizes="60px" />
      <p className="ab-marca">{SITE.letreiro}</p>
      <p className="ab-numero num"><span ref={numero}>000</span></p>
      <span className="ab-trilho"><span ref={fio} className="ab-fio" /></span>
      <p className="ab-legenda">{ABERTURA.legenda}</p>
    </div>}
  </div>
}
