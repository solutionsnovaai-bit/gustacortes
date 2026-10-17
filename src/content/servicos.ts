/*
  Tabela de valores (a mesma do cardápio da barbearia). Preço em reais, sem centavos.
*/

export type Servico = { nome: string; preco: number; detalhe: string }
export type Grupo = { id: string; titulo: string; subtitulo: string; cor: 'ciano' | 'violeta'; itens: readonly Servico[] }

export const GRUPOS: readonly Grupo[] = [
  {
    id: 'servicos',
    titulo: 'Serviços',
    subtitulo: 'Corte e finalização',
    cor: 'ciano',
    itens: [
      { nome: 'Corte', preco: 35, detalhe: 'Do social ao degradê, do jeito que você pedir.' },
      { nome: 'Corte & Barba', preco: 45, detalhe: 'O combo pra sair alinhado de cima a baixo.' },
      { nome: 'Corte & Penteado', preco: 45, detalhe: 'Corte com finalização pra sair pronto.' },
      { nome: 'Penteado', preco: 15, detalhe: 'Finalização pro evento, pra foto ou pro rolê.' },
    ],
  },
  {
    id: 'quimicas',
    titulo: 'Químicas',
    subtitulo: 'Cor e alinhamento',
    cor: 'violeta',
    itens: [
      { nome: 'Alisante', preco: 15, detalhe: 'Química pra domar o volume do fio.' },
      { nome: 'Corte & Luzes', preco: 80, detalhe: 'Corte com luzes pra mudar o visual.' },
      { nome: 'Corte & Progressiva', preco: 80, detalhe: 'Corte com progressiva pra alinhar o fio.' },
    ],
  },
]

export const MENOR_PRECO_CORTE = 35

export const reais = (v: number) => v.toLocaleString('pt-BR')
