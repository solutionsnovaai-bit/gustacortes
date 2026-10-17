/*
  Dados da barbearia. Tudo o que muda (WhatsApp, link de agendamento, Instagram, endereço) fica aqui.
*/

export const SITE = {
  nome: 'Gusta Cortes',
  /** Como o nome aparece no letreiro (com o cifrão no lugar do S). */
  letreiro: 'GUSTA CORTE$',
  /** WhatsApp com 55 + DDD + número (só números). */
  whatsapp: '5511993989613',
  whatsappExibicao: '(11) 99398-9613',
  /** Link de agendamento do InBarber (o mesmo da bio do Instagram). */
  agenda: 'https://chat.inbarberapp.com/gustacortes',
  agendaExibicao: 'chat.inbarberapp.com/gustacortes',
  /** Perfil do Instagram (sem @). Deixe vazio para esconder o link. */
  instagram: 'gusta.douradoo',
  /**
   * Endereço da barbearia. Enquanto a rua estiver vazia, o site não mostra endereço nem mapa.
   * Ex.: { rua: 'Rua Exemplo, 123', bairro: 'Centro', cidade: 'São Paulo', uf: 'SP', cep: '00000-000' }
   */
  endereco: { rua: '', bairro: '', cidade: 'São Paulo', uf: 'SP', cep: '' },
} as const

export const INSTAGRAM_URL = SITE.instagram ? `https://www.instagram.com/${SITE.instagram}/` : ''
export const TEM_ENDERECO = SITE.endereco.rua.trim().length > 0
export const ENDERECO_LINHA = TEM_ENDERECO ? `${SITE.endereco.rua}${SITE.endereco.bairro ? `, ${SITE.endereco.bairro}` : ''}` : ''
export const ENDERECO_COMPLETO = TEM_ENDERECO
  ? [SITE.endereco.rua, SITE.endereco.bairro, `${SITE.endereco.cidade} - ${SITE.endereco.uf}`, SITE.endereco.cep].filter(Boolean).join(', ')
  : ''

export const SEO = {
  titulo: 'Gusta Cortes | Barbearia com hora marcada: corte, barba e química',
  descricao:
    'Corte, barba, penteado, luzes e progressiva com hora marcada. Veja a tabela de valores e agende seu horário pelo app em poucos toques.',
  compartilharTitulo: 'Gusta Cortes · Barbearia',
  compartilharTexto: 'Seu corte, na régua. Tabela de valores e agenda aberta: marca seu horário em poucos toques.',
  imagemAlt: 'Letreiro de neon da Gusta Cortes na parede de mármore preto, entre dois postes de barbearia.',
  corTema: '#050506',
  corFundo: '#050506',
} as const

/** Mensagens prontas do WhatsApp, uma para cada botão do site. */
export const MENSAGENS = {
  padrao: 'Oi, Gusta! Vim pelo site e queria tirar uma dúvida.',
  horario: 'Oi, Gusta! Vim pelo site e queria marcar um horário.',
  quimica: 'Oi, Gusta! Vim pelo site e queria saber mais sobre a química (luzes, progressiva ou alisante).',
} as const
