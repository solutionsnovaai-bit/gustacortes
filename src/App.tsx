import { useCallback, useEffect, useState } from 'react'
import { MotionPreferencesProvider } from './hooks/useMotionPreferences'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { modoAbertura } from './lib/carregamento'
import Abertura from './components/abertura/Abertura'
import Topo from './components/layout/Topo'
import Rodape from './components/layout/Rodape'
import WhatsAppFab from './components/layout/WhatsAppFab'
import AgendarFlutuante from './components/layout/AgendarFlutuante'
import DadosEstruturados from './components/layout/DadosEstruturados'
import Ambiente from './components/layout/Ambiente'
import Hero from './components/secoes/Hero'
import type { Fase } from './components/secoes/Hero'
import Faixa from './components/secoes/Faixa'
import Manifesto from './components/secoes/Manifesto'
import Cadeira from './components/secoes/Cadeira'
import Bancada from './components/secoes/Bancada'
import Vitrine from './components/secoes/Vitrine'
import Tabela from './components/secoes/Tabela'
import Agenda from './components/secoes/Agenda'

function Site() {
  const [fase, setFase] = useState<Fase>(() => (modoAbertura() === 'nenhuma' ? 'pronto' : 'carregando'))
  const carregado = useCallback(() => setFase(f => (f === 'carregando' ? 'acendendo' : f)), [])
  const aceso = useCallback(() => setFase('pronto'), [])
  const pronto = fase === 'pronto'
  useSmoothScroll(pronto)

  /* Durante a abertura a página fica parada no topo; depois, se veio com #âncora, vai até ela. */
  useEffect(() => {
    if (pronto) {
      document.documentElement.classList.remove('travado')
      const alvo = location.hash && document.querySelector(location.hash)
      if (alvo) window.setTimeout(() => alvo.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250)
      return
    }
    window.scrollTo(0, 0)
    document.documentElement.classList.add('travado')
  }, [pronto])

  return <>
    <a className="pular-link" href="#conteudo">Pular para o conteúdo</a>
    {modoAbertura() !== 'nenhuma' && <Abertura onCarregado={carregado} sair={fase !== 'carregando'} />}
    <Topo visivel={pronto} />
    <main id="conteudo">
      <Hero fase={fase} onAceso={aceso} />
      <Faixa />
      <Manifesto />
      <Cadeira />
      <Bancada />
      <Vitrine />
      <Tabela />
      <Agenda />
    </main>
    <Rodape />
    <AgendarFlutuante liberado={pronto} />
    <WhatsAppFab liberado={pronto} />
    <Ambiente liberado={pronto} />
    <DadosEstruturados />
  </>
}

export default function App() {
  return <MotionPreferencesProvider><Site /></MotionPreferencesProvider>
}
