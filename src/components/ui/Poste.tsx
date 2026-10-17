import { useRef } from 'react'
import { ITENS, VIDRO_POSTE } from '../../config/imagens'
import { useSceneActivity } from '../../hooks/useSceneActivity'
import Foto from './Foto'

/**
 * Poste de barbearia: o cromado é a foto; dentro do vidro, as listras giram de verdade
 * (desenhadas pelo navegador, com sombra de cilindro e reflexo do vidro por cima).
 * As listras só giram enquanto o poste está na tela.
 */
export default function Poste({ className = '', sizes = '120px' }: { className?: string; sizes?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const ativo = useSceneActivity(ref)
  const v = VIDRO_POSTE
  return <div ref={ref} className={`poste ${ativo ? 'is-girando' : ''} ${className}`} aria-hidden="true">
    <Foto img={ITENS.poste} className="poste-img" sizes={sizes} />
    <div className="poste-vidro" style={{ left: `${v.x}%`, top: `${v.y}%`, width: `${v.w}%`, height: `${v.h}%` }}>
      <span className="poste-listras anima-continua" />
      <span className="poste-sombra" />
    </div>
  </div>
}
