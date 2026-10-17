/* Avisa a abertura quando a arte do topo já foi carregada (ou falhou: aí segue assim mesmo). */
let resolver: () => void = () => {}
export const heroCarregado = new Promise<void>(r => { resolver = r })
export const avisaHeroCarregado = () => resolver()

export const espera = (s: number) => new Promise<void>(r => window.setTimeout(r, s * 1000))

export type ModoAbertura = 'completa' | 'rapida' | 'nenhuma'

/** Decidido no index.html antes do primeiro quadro: completa na 1ª visita, rápida ao voltar, nenhuma com "reduzir movimento". */
export function modoAbertura(): ModoAbertura {
  const m = document.documentElement.dataset.abertura
  return m === 'rapida' || m === 'nenhuma' ? m : 'completa'
}
