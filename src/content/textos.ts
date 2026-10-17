/*
  Textos do site. Para mudar uma frase, é só editar aqui.
*/

export const NAV = [
  { href: '#casa', rotulo: 'A casa' },
  { href: '#tabela', rotulo: 'Valores' },
  { href: '#agenda', rotulo: 'Agenda' },
  { href: '#contato', rotulo: 'Contato' },
] as const

export const ABERTURA = {
  legenda: 'Afiando a navalha',
} as const

export const HERO = {
  rotulo: 'Barbearia · Hora marcada',
  titulo: ['Seu corte,', 'na régua.'],
  texto: 'Degradê, barba e química com horário marcado. Você escolhe a hora no app e chega só pra sentar na cadeira.',
  cta: 'Agendar horário',
  link: 'Ver valores',
  meta: 'Corte a partir de',
  rolar: 'Role',
} as const

export const FAIXA = ['Corte', 'Barba', 'Degradê', 'Penteado', 'Luzes', 'Progressiva', 'Alisante'] as const

/** Frase que acende palavra por palavra com a rolagem. Palavras com marca de cor: [ciano] e {violeta}. */
export const MANIFESTO = {
  rotulo: 'Gusta Cortes',
  texto: 'Aqui corte não é pressa. É [régua], {navalha} e acabamento. Do degradê à progressiva, com hora marcada e preço na parede, pra você sair do jeito que imaginou.',
} as const

export const CADEIRA = {
  rotulo: '01 — A casa',
  titulo: ['Senta.', 'O resto é', 'com o Gusta.'],
  itens: [
    { titulo: 'Hora marcada', texto: 'Você escolhe o dia e o horário pelo app e chega na sua vez.' },
    { titulo: 'Do degradê à química', texto: 'Corte, barba, penteado, luzes, progressiva e alisante.' },
    { titulo: 'Preço na parede', texto: 'Tabela clara, do penteado de R$ 15 ao corte com química.' },
  ],
} as const

export const TABELA = {
  rotulo: '02 — Valores',
  titulo: 'A tabela',
  texto: 'Toca no serviço e vai direto pra agenda.',
  nota: 'Valores de referência. O valor final aparece na hora de agendar.',
  agendar: 'Agendar',
  duvida: 'Dúvida sobre química? Chama no WhatsApp',
} as const

export const AGENDA_TXT = {
  rotulo: '03 — Agenda',
  neon: ['agenda', 'aberta'],
  titulo: ['Três toques', 'e o horário é seu.'],
  passos: [
    { n: '01', titulo: 'Toca em agendar', texto: 'O botão abre a agenda do Gusta direto no seu celular.' },
    { n: '02', titulo: 'Escolhe serviço e horário', texto: 'Corte, barba ou química: você vê os horários livres e marca o seu.' },
    { n: '03', titulo: 'Chega e senta', texto: 'No horário marcado, a cadeira já está te esperando.' },
  ],
  cta: 'Agendar horário',
  whatsapp: 'Prefiro o WhatsApp',
  qrTitulo: 'Tá no computador?',
  qrTexto: 'Aponta a câmera do celular aqui e agenda por lá.',
} as const

export const RODAPE = {
  frase: ['Seu corte,', 'na régua.'],
  instagram: 'Acompanha os cortes',
  agendar: 'Agenda',
} as const
