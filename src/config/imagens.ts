/*
  Imagens fixas do site. Todas em AVIF com reserva em WebP, servidas pelo próprio site.
*/

export type Imagem = { avif: string; webp: string; largura: number; altura: number }

const img = (base: string, largura: number, altura: number): Imagem => ({ avif: `${base}.avif`, webp: `${base}.webp`, largura, altura })

/**
 * Peças do letreiro de neon, em pixels da arte. Cada uma acende sozinha na abertura.
 * c = centro, r = meia largura e meia altura da peça.
 */
export type Tubo = { id: string; c: [number, number]; r: [number, number] }

export type ArteHero = Imagem & {
  /** Retângulo que contém o letreiro inteiro (nunca pode ser cortado). */
  letreiro: [number, number, number, number]
  tubos: readonly Tubo[]
}

/** Desktop: letreiro ancorado à direita, espaço livre à esquerda para o texto. */
export const HERO_DESKTOP: ArteHero = {
  ...img('/hero/hero-desktop', 1672, 941),
  letreiro: [670, 185, 1580, 660],
  tubos: [
    { id: 'poste-e', c: [750, 416], r: [72, 224] },
    { id: 'poste-d', c: [1495, 416], r: [75, 224] },
    { id: 'bigode-cima', c: [1132, 228], r: [103, 37] },
    { id: 'gusta', c: [1130, 337], r: [190, 58] },
    { id: 'til', c: [1150, 413], r: [65, 22] },
    { id: 'cortes', c: [1137, 480], r: [218, 70] },
    { id: 'bigode-baixo', c: [1137, 605], r: [103, 35] },
    { id: 'engrenagem', c: [1358, 247], r: [40, 43] },
    { id: 'cifrao', c: [1360, 600], r: [38, 55] },
  ],
}

/** Celular: letreiro sangrando no topo, texto embaixo. */
export const HERO_MOBILE: ArteHero = {
  ...img('/hero/hero-mobile', 941, 1672),
  letreiro: [36, 195, 908, 660],
  tubos: [
    { id: 'poste-e', c: [106, 420], r: [66, 220] },
    { id: 'poste-d', c: [835, 420], r: [70, 220] },
    { id: 'bigode-cima', c: [477, 237], r: [103, 38] },
    { id: 'gusta', c: [475, 347], r: [190, 58] },
    { id: 'til', c: [495, 422], r: [65, 22] },
    { id: 'cortes', c: [485, 495], r: [215, 65] },
    { id: 'bigode-baixo', c: [477, 610], r: [103, 35] },
    { id: 'engrenagem', c: [702, 255], r: [38, 40] },
    { id: 'cifrao', c: [705, 602], r: [37, 52] },
  ],
}

export const MARMORE = img('/fundo/marmore', 1600, 900)
export const LETREIRO = img('/marca/letreiro', 1000, 540)

export const ITENS = {
  tesoura: img('/itens/tesoura', 760, 706),
  navalha: img('/itens/navalha', 759, 760),
  maquina: img('/itens/maquina', 571, 900),
  pente: img('/itens/pente', 760, 566),
  poste: img('/itens/poste', 295, 900),
  cadeira: img('/itens/cadeira', 818, 980),
  bigode: img('/itens/bigode', 720, 313),
} as const

/** Vidro do poste (onde as listras giram), em % da imagem do poste. */
export const VIDRO_POSTE = { x: 17.6, y: 22.4, w: 65.8, h: 54 }
